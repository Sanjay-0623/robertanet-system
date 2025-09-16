"""
Comprehensive evaluation suite for RoBERTaNET model
"""

import torch
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, precision_recall_fscore_support, 
    confusion_matrix, classification_report, roc_auc_score, roc_curve
)
import json
from typing import Dict, List, Tuple
import pandas as pd

# Import our modules
from model_architecture import RoBERTaNET, create_model
from data_preprocessing import create_sample_dataset, prepare_data

class ModelEvaluator:
    """Comprehensive model evaluation and analysis"""
    
    def __init__(self, model: RoBERTaNET, device: str = 'cpu'):
        self.model = model.to(device)
        self.device = device
        self.model.eval()
        
    def predict(self, data_loader) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """Get predictions and probabilities"""
        all_predictions = []
        all_labels = []
        all_probabilities = []
        
        with torch.no_grad():
            for batch in data_loader:
                input_ids = batch['input_ids'].to(self.device)
                attention_mask = batch['attention_mask'].to(self.device)
                glove_input_ids = batch['glove_input_ids'].to(self.device)
                labels = batch['labels'].to(self.device)
                
                logits = self.model(input_ids, attention_mask, glove_input_ids)
                probabilities = torch.softmax(logits, dim=1)
                predictions = torch.argmax(logits, dim=1)
                
                all_predictions.extend(predictions.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())
                all_probabilities.extend(probabilities.cpu().numpy())
        
        return np.array(all_labels), np.array(all_predictions), np.array(all_probabilities)
    
    def compute_metrics(self, y_true: np.ndarray, y_pred: np.ndarray, y_prob: np.ndarray) -> Dict:
        """Compute comprehensive evaluation metrics"""
        
        # Basic metrics
        accuracy = accuracy_score(y_true, y_pred)
        precision, recall, f1, support = precision_recall_fscore_support(
            y_true, y_pred, average=None
        )
        
        # Weighted averages
        precision_weighted, recall_weighted, f1_weighted, _ = precision_recall_fscore_support(
            y_true, y_pred, average='weighted'
        )
        
        # ROC AUC (for binary classification)
        if y_prob.shape[1] == 2:
            auc = roc_auc_score(y_true, y_prob[:, 1])
        else:
            auc = None
        
        # Confusion matrix
        cm = confusion_matrix(y_true, y_pred)
        
        metrics = {
            'accuracy': float(accuracy),
            'precision_per_class': precision.tolist(),
            'recall_per_class': recall.tolist(),
            'f1_per_class': f1.tolist(),
            'support_per_class': support.tolist(),
            'precision_weighted': float(precision_weighted),
            'recall_weighted': float(recall_weighted),
            'f1_weighted': float(f1_weighted),
            'auc': float(auc) if auc is not None else None,
            'confusion_matrix': cm.tolist(),
            'classification_report': classification_report(y_true, y_pred, output_dict=True)
        }
        
        return metrics
    
    def plot_confusion_matrix(self, cm: np.ndarray, class_names: List[str] = None):
        """Plot confusion matrix"""
        if class_names is None:
            class_names = ['Non-Bullying', 'Bullying']
        
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                   xticklabels=class_names, yticklabels=class_names)
        plt.title('Confusion Matrix - RoBERTaNET')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.tight_layout()
        plt.savefig('confusion_matrix.png', dpi=300, bbox_inches='tight')
        plt.show()
        
    def plot_roc_curve(self, y_true: np.ndarray, y_prob: np.ndarray):
        """Plot ROC curve for binary classification"""
        if y_prob.shape[1] != 2:
            print("ROC curve only available for binary classification")
            return
        
        fpr, tpr, _ = roc_curve(y_true, y_prob[:, 1])
        auc = roc_auc_score(y_true, y_prob[:, 1])
        
        plt.figure(figsize=(8, 6))
        plt.plot(fpr, tpr, color='darkorange', lw=2, 
                label=f'ROC curve (AUC = {auc:.3f})')
        plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.title('ROC Curve - RoBERTaNET Cyberbullying Detection')
        plt.legend(loc="lower right")
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.savefig('roc_curve.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def analyze_predictions(self, texts: List[str], y_true: np.ndarray, 
                          y_pred: np.ndarray, y_prob: np.ndarray) -> pd.DataFrame:
        """Analyze individual predictions"""
        
        results = []
        for i, text in enumerate(texts):
            results.append({
                'text': text,
                'true_label': int(y_true[i]),
                'predicted_label': int(y_pred[i]),
                'confidence': float(np.max(y_prob[i])),
                'bullying_probability': float(y_prob[i, 1]) if y_prob.shape[1] == 2 else None,
                'correct': bool(y_true[i] == y_pred[i])
            })
        
        df = pd.DataFrame(results)
        
        # Show some examples
        print("\nCorrect Predictions (High Confidence):")
        correct_high_conf = df[(df['correct'] == True) & (df['confidence'] > 0.8)].head(3)
        for _, row in correct_high_conf.iterrows():
            print(f"  Text: '{row['text'][:50]}...'")
            print(f"  Label: {row['true_label']}, Confidence: {row['confidence']:.3f}\n")
        
        print("Incorrect Predictions:")
        incorrect = df[df['correct'] == False].head(3)
        for _, row in incorrect.iterrows():
            print(f"  Text: '{row['text'][:50]}...'")
            print(f"  True: {row['true_label']}, Pred: {row['predicted_label']}, Conf: {row['confidence']:.3f}\n")
        
        return df
    
    def generate_report(self, metrics: Dict, save_path: str = 'evaluation_report.json'):
        """Generate comprehensive evaluation report"""
        
        report = {
            'model_name': 'RoBERTaNET',
            'evaluation_timestamp': pd.Timestamp.now().isoformat(),
            'metrics': metrics,
            'summary': {
                'overall_accuracy': metrics['accuracy'],
                'weighted_f1': metrics['f1_weighted'],
                'auc_score': metrics['auc'],
                'bullying_detection_f1': metrics['f1_per_class'][1] if len(metrics['f1_per_class']) > 1 else None,
                'bullying_detection_precision': metrics['precision_per_class'][1] if len(metrics['precision_per_class']) > 1 else None,
                'bullying_detection_recall': metrics['recall_per_class'][1] if len(metrics['recall_per_class']) > 1 else None
            }
        }
        
        with open(save_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"Evaluation report saved to {save_path}")
        return report

def main():
    """Main evaluation function"""
    print("RoBERTaNET Model Evaluation")
    print("=" * 50)
    
    # Set device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Load data
    print("\n1. Loading test data...")
    df = create_sample_dataset()
    train_loader, val_loader, test_loader, data_info = prepare_data(df)
    
    # Create and load model
    print("\n2. Loading trained model...")
    model_config = {
        'vocab_size': data_info['vocab_size'],
        'glove_dim': 300,
        'roberta_model': 'roberta-base',
        'num_classes': data_info['num_classes'],
        'dropout_rate': 0.3,
        'fusion_method': 'concatenate'
    }
    
    model = create_model(model_config)
    
    # For prototype, we'll use the untrained model
    # In production: model.load_state_dict(torch.load('robertanet_best_model.pth')['model_state_dict'])
    
    # Initialize evaluator
    evaluator = ModelEvaluator(model, device=device)
    
    # Get predictions
    print("\n3. Generating predictions...")
    y_true, y_pred, y_prob = evaluator.predict(test_loader)
    
    # Compute metrics
    print("\n4. Computing evaluation metrics...")
    metrics = evaluator.compute_metrics(y_true, y_pred, y_prob)
    
    # Print results
    print(f"\nEvaluation Results:")
    print(f"Accuracy: {metrics['accuracy']:.4f}")
    print(f"Weighted F1: {metrics['f1_weighted']:.4f}")
    print(f"Weighted Precision: {metrics['precision_weighted']:.4f}")
    print(f"Weighted Recall: {metrics['recall_weighted']:.4f}")
    if metrics['auc']:
        print(f"AUC Score: {metrics['auc']:.4f}")
    
    print(f"\nPer-Class Results:")
    class_names = ['Non-Bullying', 'Bullying']
    for i, name in enumerate(class_names):
        if i < len(metrics['f1_per_class']):
            print(f"{name}:")
            print(f"  Precision: {metrics['precision_per_class'][i]:.4f}")
            print(f"  Recall: {metrics['recall_per_class'][i]:.4f}")
            print(f"  F1-Score: {metrics['f1_per_class'][i]:.4f}")
            print(f"  Support: {metrics['support_per_class'][i]}")
    
    # Generate visualizations
    print("\n5. Generating visualizations...")
    evaluator.plot_confusion_matrix(np.array(metrics['confusion_matrix']))
    if metrics['auc']:
        evaluator.plot_roc_curve(y_true, y_prob)
    
    # Analyze predictions
    print("\n6. Analyzing predictions...")
    # Get original texts for analysis
    test_texts = df['text'].tolist()[-len(y_true):]  # Get test portion
    prediction_analysis = evaluator.analyze_predictions(test_texts, y_true, y_pred, y_prob)
    
    # Generate report
    print("\n7. Generating evaluation report...")
    report = evaluator.generate_report(metrics)
    
    print("\nEvaluation completed successfully!")
    print("Check generated files: confusion_matrix.png, roc_curve.png, evaluation_report.json")

if __name__ == "__main__":
    main()
