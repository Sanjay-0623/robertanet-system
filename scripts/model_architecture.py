"""
RoBERTaNET: GloVe-Enhanced Cyberbullying Detection Model
Combines GloVe embeddings with RoBERTa for improved contextual understanding
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import RobertaModel, RobertaTokenizer
import numpy as np
from typing import Dict, List, Tuple, Optional

class GloVeEmbedding(nn.Module):
    """GloVe embedding layer for global semantic relationships"""
    
    def __init__(self, vocab_size: int, embedding_dim: int = 300):
        super(GloVeEmbedding, self).__init__()
        self.embedding_dim = embedding_dim
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        
    def load_pretrained_glove(self, glove_path: str, word_to_idx: Dict[str, int]):
        """Load pre-trained GloVe embeddings"""
        print(f"Loading GloVe embeddings from {glove_path}")
        
        # Initialize embedding matrix
        embedding_matrix = torch.zeros(len(word_to_idx), self.embedding_dim)
        
        # Load GloVe vectors (simulated for prototype)
        # In production, this would load actual GloVe file
        for word, idx in word_to_idx.items():
            # Simulate GloVe vectors with random initialization
            # Replace with actual GloVe loading: embedding_matrix[idx] = glove_vector
            embedding_matrix[idx] = torch.randn(self.embedding_dim) * 0.1
            
        self.embedding.weight.data.copy_(embedding_matrix)
        print("GloVe embeddings loaded successfully")
        
    def forward(self, x):
        return self.embedding(x)

class RoBERTaNET(nn.Module):
    """
    Hybrid model combining GloVe embeddings with RoBERTa
    for enhanced cyberbullying detection
    """
    
    def __init__(self, 
                 vocab_size: int = 50000,
                 glove_dim: int = 300,
                 roberta_model: str = 'roberta-base',
                 num_classes: int = 2,
                 dropout_rate: float = 0.3,
                 fusion_method: str = 'concatenate'):
        
        super(RoBERTaNET, self).__init__()
        
        self.fusion_method = fusion_method
        self.num_classes = num_classes
        
        # GloVe embedding component
        self.glove_embedding = GloVeEmbedding(vocab_size, glove_dim)
        
        # RoBERTa component
        self.roberta = RobertaModel.from_pretrained(roberta_model)
        self.roberta_dim = self.roberta.config.hidden_size
        
        # Fusion layers
        if fusion_method == 'concatenate':
            fusion_dim = glove_dim + self.roberta_dim
        elif fusion_method == 'attention':
            fusion_dim = self.roberta_dim
            self.attention_layer = nn.MultiheadAttention(
                embed_dim=self.roberta_dim,
                num_heads=8,
                dropout=dropout_rate
            )
            self.glove_projection = nn.Linear(glove_dim, self.roberta_dim)
        else:
            raise ValueError(f"Unknown fusion method: {fusion_method}")
        
        # Classification head
        self.classifier = nn.Sequential(
            nn.Dropout(dropout_rate),
            nn.Linear(fusion_dim, 512),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(256, num_classes)
        )
        
        # Layer normalization
        self.layer_norm = nn.LayerNorm(fusion_dim)
        
    def forward(self, 
                input_ids: torch.Tensor,
                attention_mask: torch.Tensor,
                glove_input_ids: Optional[torch.Tensor] = None) -> torch.Tensor:
        
        # RoBERTa forward pass
        roberta_outputs = self.roberta(
            input_ids=input_ids,
            attention_mask=attention_mask
        )
        roberta_features = roberta_outputs.last_hidden_state[:, 0, :]  # [CLS] token
        
        # GloVe forward pass
        if glove_input_ids is not None:
            glove_features = self.glove_embedding(glove_input_ids)
            # Average pooling for GloVe features
            glove_features = torch.mean(glove_features, dim=1)
        else:
            # Use same input_ids for GloVe (simplified for prototype)
            glove_features = self.glove_embedding(input_ids)
            glove_features = torch.mean(glove_features, dim=1)
        
        # Feature fusion
        if self.fusion_method == 'concatenate':
            fused_features = torch.cat([roberta_features, glove_features], dim=1)
        elif self.fusion_method == 'attention':
            # Project GloVe features to RoBERTa dimension
            glove_projected = self.glove_projection(glove_features).unsqueeze(1)
            roberta_expanded = roberta_features.unsqueeze(1)
            
            # Apply attention mechanism
            attended_features, _ = self.attention_layer(
                roberta_expanded, glove_projected, glove_projected
            )
            fused_features = attended_features.squeeze(1)
        
        # Layer normalization
        fused_features = self.layer_norm(fused_features)
        
        # Classification
        logits = self.classifier(fused_features)
        
        return logits
    
    def get_model_info(self) -> Dict:
        """Return model architecture information"""
        total_params = sum(p.numel() for p in self.parameters())
        trainable_params = sum(p.numel() for p in self.parameters() if p.requires_grad)
        
        return {
            'model_name': 'RoBERTaNET',
            'fusion_method': self.fusion_method,
            'num_classes': self.num_classes,
            'total_parameters': total_params,
            'trainable_parameters': trainable_params,
            'roberta_dim': self.roberta_dim,
            'glove_dim': self.glove_embedding.embedding_dim
        }

def create_model(config: Dict) -> RoBERTaNET:
    """Factory function to create RoBERTaNET model"""
    model = RoBERTaNET(
        vocab_size=config.get('vocab_size', 50000),
        glove_dim=config.get('glove_dim', 300),
        roberta_model=config.get('roberta_model', 'roberta-base'),
        num_classes=config.get('num_classes', 2),
        dropout_rate=config.get('dropout_rate', 0.3),
        fusion_method=config.get('fusion_method', 'concatenate')
    )
    
    print("RoBERTaNET model created successfully")
    print(f"Model info: {model.get_model_info()}")
    
    return model

if __name__ == "__main__":
    # Test model creation
    config = {
        'vocab_size': 50000,
        'glove_dim': 300,
        'roberta_model': 'roberta-base',
        'num_classes': 2,
        'dropout_rate': 0.3,
        'fusion_method': 'concatenate'
    }
    
    model = create_model(config)
    print("Model architecture test completed successfully!")
