import json
import os

DATASET_PATH = os.path.join(os.path.dirname(__file__), "dataset", "fintech_terms.json")

def load_dataset():
    with open(DATASET_PATH, 'r') as f:
        return json.load(f)

def train():
    dataset = load_dataset()
    print(f"Dataset loaded with {len(dataset)} terms")
    print("Sample terms:", list(dataset.keys())[:5])
    
    stats = {
        "total_terms": len(dataset),
        "categories": list(set(term.split()[0] for term in dataset.keys() if term.split()))
    }
    
    print("Training stats:", stats)
    print("Training complete (using dataset-based inference)")
    return stats

if __name__ == "__main__":
    train()
