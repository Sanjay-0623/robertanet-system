"""
Training pipeline for RoBERTaNET cyberbullying detection model
"""

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import numpy as np
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
import json
import os
from datetime import datetime
from typing import Dict, List, Tuple

# Import our custom modules
from model_architecture import RoBERTaNET, create_model
from data_preprocessing import create_sample_dataset, prepare_data

class ModelTrainer:
    """Training manager for RoBERTaNET model"""
    
    def __init__(self, 
                 model: RoBERTaNET,
                 device: str = 'cpu',
                 learning_rate: float = 2e-5,
                 weight_decay: float = 0.01):
        
        self.model = model.to(device)
        self.device = device
        self.learning_rate = learning_rate
        
        # Optimizer with different learning rates for different components
        self.optimizer = optim.AdamW([
            {'params': self.model.roberta.parameters(), 'lr': learning_rate},
            {'params': self.model.glove_embedding.parameters(), 'lr': learning_rate * 10},
            {'params': self.model.classifier.parameters(), 'lr': learning_rate * 5}
        ], weight_decay=weight_decay)
        
        # Loss function
        self.criterion = nn.CrossEntropyLoss()
        
        # Training history
        self.train_history = {
            'train_loss': [],
            'train_acc': [],
            'val_loss': [],
            'val_acc': []
        }
        
    def train_epoch(self, train_loader: DataLoader) -> Tuple[float, float]:
        """Train for one epoch"""
        self.model.train()
        total_loss = 0
        all_predictions = []
        all_labels = []
        
        for batch_idx, batch in enumerate(train_loader):
            # Move batch to device
            input_ids = batch['input_ids'].to(self.device)
            attention_mask = batch['attention_mask'].to(self.device)
            glove_input_ids = batch['glove_input_ids'].to(self.device)
            labels = batch['labels'].to(self.device)
            
            # Forward pass
            self.optimizer.zero_grad()
            logits = self.model(input_ids, attention_mask, glove_input_ids)
            loss = self.criterion(logits, labels)
            
            # Backward pass
            loss.backward()
            torch.nn.utils.clip_grad_norm_(self.model.parameters(), max_norm=1.0)
            self.optimizer.step()
            
            # Track metrics
            total_loss += loss.item()
            predictions = torch.argmax(logits, dim=1)
            all_predictions.extend(predictions.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            
            if batch_idx % 10 == 0:
                print(f"  Batch {batch_idx}/{len(train_loader)}, Loss: {loss.item():.4f}")
        
        avg_loss = total_loss / len(train_loader)
        accuracy = accuracy_score(all_labels, all_predictions)
        
        return avg_loss, accuracy
    
    def validate(self, val_loader: DataLoader) -> Tuple[float, float, Dict]:
        """Validate the model"""
        self.model.eval()
        total_loss = 0
        all_predictions = []
        all_labels = []
        
        with torch.no_grad():
            for batch in val_loader:
                # Move batch to device
                input_ids = batch['input_ids'].to(self.device)
                attention_mask = batch['attention_mask'].to(self.device)
                glove_input_ids = batch['glove_input_ids'].to(self.device)
                labels = batch['labels'].to(self.device)
                
                # Forward pass
                logits = self.model(input_ids, attention_mask, glove_input_ids)
                loss = self.criterion(logits, labels)
                
                # Track metrics
                total_loss += loss.item()
                predictions = torch.argmax(logits, dim=1)
                all_predictions.extend(predictions.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())
        
        avg_loss = total_loss / len(val_loader)
        accuracy = accuracy_score(all_labels, all_predictions)
        
        # Detailed metrics
        precision, recall, f1, _ = precision_recall_fscore_support(
            all_labels, all_predictions, average='weighted'
        )
        
        metrics = {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1': f1,
            'confusion_matrix': confusion_matrix(all_labels, all_predictions).tolist()
        }
        
        return avg_loss, accuracy, metrics
    
    def train(self, 
              train_loader: DataLoader,
              val_loader: DataLoader,
              num_epochs: int = 10,
              save_path: str = 'robertanet_model.pth') -> Dict:
        """Full training loop"""
        
        print(f"Starting training for {num_epochs} epochs...")
        print(f"Device: {self.device}")
        print(f"Model parameters: {sum(p.numel() for p in self.model.parameters()):,}")
        
        best_val_acc = 0
        best_metrics = {}
        
        for epoch in range(num_epochs):
            print(f"\nEpoch {epoch + 1}/{num_epochs}")
            print("-" * 50)
            
            # Training
            train_loss, train_acc = self.train_epoch(train_loader)
            
            # Validation
            val_loss, val_acc, val_metrics = self.validate(val_loader)
            
            # Update history
            self.train_history['train_loss'].append(train_loss)
            self.train_history['train_acc'].append(train_acc)
            self.train_history['val_loss'].append(val_loss)
            self.train_history['val_acc'].append(val_acc)
            
            # Print epoch results
            print(f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.4f}")
            print(f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.4f}")
            print(f"Val F1: {val_metrics['f1']:.4f}")
            
            # Save best model
            if val_acc > best_val_acc:
                best_val_acc = val_acc
                best_metrics = val_metrics
                torch.save({
                    'model_state_dict': self.model.state_dict(),
                    'optimizer_state_dict': self.optimizer.state_dict(),
                    'epoch': epoch,
                    'val_acc': val_acc,
                    'train_history': self.train_history,
                    'model_config': self.model.get_model_info()
                }, save_path)
                print(f"New best model saved! Val Acc: {val_acc:.4f}")
        
        print(f"\nTraining completed!")
        print(f"Best validation accuracy: {best_val_acc:.4f}")
        
        return {
            'best_val_acc': best_val_acc,
            'best_metrics': best_metrics,
            'train_history': self.train_history
        }

def main():
    """Main training function"""
    print("RoBERTaNET Training Pipeline")
    print("=" * 50)
    
    # Set device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Create sample dataset
    print("\n1. Creating sample dataset...")
    df = create_sample_dataset()
    
    # Prepare data
    print("\n2. Preparing data loaders...")
    train_loader, val_loader, test_loader, data_info = prepare_data(df)
    
    # Create model
    print("\n3. Creating RoBERTaNET model...")
    model_config = {
        'vocab_size': data_info['vocab_size'],
        'glove_dim': 300,
        'roberta_model': 'roberta-base',
        'num_classes': data_info['num_classes'],
        'dropout_rate': 0.3,
        'fusion_method': 'concatenate'
    }
    
    model = create_model(model_config)
    
    # Initialize trainer
    print("\n4. Initializing trainer...")
    trainer = ModelTrainer(model, device=device, learning_rate=2e-5)
    
    # Train model
    print("\n5. Starting training...")
    results = trainer.train(
        train_loader=train_loader,
        val_loader=val_loader,
        num_epochs=5,  # Reduced for prototype
        save_path='robertanet_best_model.pth'
    )
    
    # Test final model
    print("\n6. Testing final model...")
    test_loss, test_acc, test_metrics = trainer.validate(test_loader)
    
    print(f"\nFinal Test Results:")
    print(f"Test Accuracy: {test_acc:.4f}")
    print(f"Test F1 Score: {test_metrics['f1']:.4f}")
    print(f"Test Precision: {test_metrics['precision']:.4f}")
    print(f"Test Recall: {test_metrics['recall']:.4f}")
    
    # Save final results
    final_results = {
        'training_results': results,
        'test_metrics': test_metrics,
        'model_config': model_config,
        'data_info': data_info
    }
    
    with open('training_results.json', 'w') as f:
        json.dump(final_results, f, indent=2)
    
    print("\nTraining pipeline completed successfully!")
    print("Results saved to 'training_results.json'")

if __name__ == "__main__":
    main()
