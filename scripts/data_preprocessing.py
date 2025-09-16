"""
Data preprocessing pipeline for cyberbullying detection
Handles text cleaning, tokenization, and dataset preparationī
"""

import pandas as pd
import numpy as np
import re
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import RobertaTokenizer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from typing import List, Dict, Tuple, Optional
import json

class TextPreprocessor:
    """Text preprocessing utilities for cyberbullying detection"""
    
    def __init__(self):
        self.url_pattern = re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\$$\$$,]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
        self.mention_pattern = re.compile(r'@[A-Za-z0-9_]+')
        self.hashtag_pattern = re.compile(r'#[A-Za-z0-9_]+')
        
    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not isinstance(text, str):
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Replace URLs
        text = self.url_pattern.sub(' [URL] ', text)
        
        # Replace mentions
        text = self.mention_pattern.sub(' [USER] ', text)
        
        # Replace hashtags
        text = self.hashtag_pattern.sub(' [HASHTAG] ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def create_vocabulary(self, texts: List[str], min_freq: int = 2) -> Dict[str, int]:
        """Create vocabulary from text corpus"""
        word_counts = {}
        
        for text in texts:
            words = text.split()
            for word in words:
                word_counts[word] = word_counts.get(word, 0) + 1
        
        # Filter by minimum frequency
        vocab = {'<PAD>': 0, '<UNK>': 1, '<START>': 2, '<END>': 3}
        idx = 4
        
        for word, count in word_counts.items():
            if count >= min_freq:
                vocab[word] = idx
                idx += 1
        
        print(f"Vocabulary created with {len(vocab)} words")
        return vocab

class CyberbullyingDataset(Dataset):
    """PyTorch Dataset for cyberbullying detection"""
    
    def __init__(self, 
                 texts: List[str], 
                 labels: List[int],
                 tokenizer: RobertaTokenizer,
                 vocab: Dict[str, int],
                 max_length: int = 512):
        
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.vocab = vocab
        self.max_length = max_length
        
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = self.texts[idx]
        label = self.labels[idx]
        
        # RoBERTa tokenization
        roberta_encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )
        
        # GloVe tokenization (word-level)
        words = text.split()[:self.max_length]
        glove_ids = [self.vocab.get(word, self.vocab['<UNK>']) for word in words]
        
        # Pad GloVe sequence
        while len(glove_ids) < self.max_length:
            glove_ids.append(self.vocab['<PAD>'])
        
        return {
            'input_ids': roberta_encoding['input_ids'].squeeze(),
            'attention_mask': roberta_encoding['attention_mask'].squeeze(),
            'glove_input_ids': torch.tensor(glove_ids, dtype=torch.long),
            'labels': torch.tensor(label, dtype=torch.long)
        }

def create_sample_dataset() -> pd.DataFrame:
    """Create a sample cyberbullying dataset for demonstration"""
    
    # Sample data (in production, load from actual datasets like Founta et al.)
    sample_data = [
        ("You're such an amazing person, keep up the great work!", 0),  # Not bullying
        ("I love your creativity and positive attitude", 0),  # Not bullying
        ("Thanks for sharing this helpful information", 0),  # Not bullying
        ("Great job on your presentation today", 0),  # Not bullying
        ("You're so stupid and worthless", 1),  # Bullying
        ("Nobody likes you, just give up", 1),  # Bullying
        ("You're ugly and should disappear", 1),  # Bullying
        ("Kill yourself, loser", 1),  # Bullying
        ("What a beautiful day for a walk", 0),  # Not bullying
        ("Looking forward to the weekend", 0),  # Not bullying
        ("You're pathetic and everyone knows it", 1),  # Bullying
        ("Hope you have a wonderful day", 0),  # Not bullying
        ("You're trash and always will be", 1),  # Bullying
        ("Congratulations on your achievement", 0),  # Not bullying
        ("Go die in a hole", 1),  # Bullying
    ]
    
    # Expand dataset with variations
    expanded_data = []
    for text, label in sample_data:
        expanded_data.append((text, label))
        # Add some variations
        if label == 0:  # Positive examples
            expanded_data.append((f"Really {text.lower()}", label))
            expanded_data.append((f"{text} 😊", label))
        else:  # Negative examples
                expanded_data.append((f"{text.upper()}", label))
                expanded_data.append((f"@user {text}", label))
    
    df = pd.DataFrame(expanded_data, columns=['text', 'label'])
    print(f"Sample dataset created with {len(df)} examples")
    print(f"Label distribution: {df['label'].value_counts().to_dict()}")
    
    return df

def prepare_data(df: pd.DataFrame, 
                test_size: float = 0.2, 
                val_size: float = 0.1,
                max_length: int = 512) -> Tuple[DataLoader, DataLoader, DataLoader, Dict]:
    """Prepare data loaders for training"""
    
    # Initialize preprocessor and tokenizer
    preprocessor = TextPreprocessor()
    tokenizer = RobertaTokenizer.from_pretrained('roberta-base')
    
    # Clean texts
    df['cleaned_text'] = df['text'].apply(preprocessor.clean_text)
    
    # Create vocabulary for GloVe
    vocab = preprocessor.create_vocabulary(df['cleaned_text'].tolist())
    
    # Split data
    X = df['cleaned_text'].tolist()
    y = df['label'].tolist()
    
    X_temp, X_test, y_temp, y_test = train_test_split(
        X, y, test_size=test_size, random_state=42, stratify=y
    )
    
    X_train, X_val, y_train, y_val = train_test_split(
        X_temp, y_temp, test_size=val_size/(1-test_size), random_state=42, stratify=y_temp
    )
    
    # Create datasets
    train_dataset = CyberbullyingDataset(X_train, y_train, tokenizer, vocab, max_length)
    val_dataset = CyberbullyingDataset(X_val, y_val, tokenizer, vocab, max_length)
    test_dataset = CyberbullyingDataset(X_test, y_test, tokenizer, vocab, max_length)
    
    # Create data loaders
    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=16, shuffle=False)
    test_loader = DataLoader(test_dataset, batch_size=16, shuffle=False)
    
    data_info = {
        'vocab_size': len(vocab),
        'num_classes': len(set(y)),
        'train_size': len(X_train),
        'val_size': len(X_val),
        'test_size': len(X_test),
        'vocab': vocab
    }
    
    print(f"Data preparation completed:")
    print(f"  Train: {len(X_train)} samples")
    print(f"  Validation: {len(X_val)} samples") 
    print(f"  Test: {len(X_test)} samples")
    
    return train_loader, val_loader, test_loader, data_info

if __name__ == "__main__":
    # Test data preprocessing
    print("Testing data preprocessing pipeline...")
    
    # Create sample dataset
    df = create_sample_dataset()
    
    # Prepare data loaders
    train_loader, val_loader, test_loader, data_info = prepare_data(df)
    
    # Test data loading
    for batch in train_loader:
        print(f"Batch shapes:")
        print(f"  input_ids: {batch['input_ids'].shape}")
        print(f"  attention_mask: {batch['attention_mask'].shape}")
        print(f"  glove_input_ids: {batch['glove_input_ids'].shape}")
        print(f"  labels: {batch['labels'].shape}")
        break
    
    print("Data preprocessing test completed successfully!")
