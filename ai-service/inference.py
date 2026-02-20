import json
import os

DATASET_PATH = os.path.join(os.path.dirname(__file__), "dataset", "fintech_terms.json")

def load_dataset():
    with open(DATASET_PATH, 'r') as f:
        return json.load(f)

def predict(text: str) -> dict:
    dataset = load_dataset()
    
    text_lower = text.lower()
    
    for term, definition in dataset.items():
        if term.lower() in text_lower:
            return {
                "answer": f"{term}: {definition}",
                "confidence": 0.95,
                "matched_term": term
            }
    
    for term, definition in dataset.items():
        words = term.lower().split()
        if any(word in text_lower for word in words):
            return {
                "answer": f"{term}: {definition}",
                "confidence": 0.75,
                "matched_term": term
            }
    
    return {
        "answer": "I couldn't find information about this topic. Try asking about FinTech concepts like blockchain, cryptocurrency, or digital banking.",
        "confidence": 0.0,
        "matched_term": None
    }
