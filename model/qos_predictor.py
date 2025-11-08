"""
QoS Predictor Module
Trains and uses Scikit-learn model for QoS prediction based on network metrics
"""

import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from pathlib import Path

MODEL_PATH = Path(__file__).parent / 'qos_model.pkl'


def train_qos_model():
    """
    Train a RandomForest model to predict QoS score (0-100) based on latency and packet loss
    Saves model to disk for reuse
    """
    # Synthetic training data
    # Features: [latency_ms, packet_loss_percent]
    # Target: QoS score (0-100, higher is better)
    
    X_train = np.array([
        [2.0, 0.05],
        [3.5, 0.1],
        [5.0, 0.15],
        [8.0, 0.3],
        [12.0, 0.5],
        [1.5, 0.02],
        [4.0, 0.12],
        [10.0, 0.4],
        [15.0, 0.8],
        [20.0, 1.0],
    ])
    
    # QoS targets: higher latency and packet loss = lower QoS
    y_train = np.array([98, 95, 92, 85, 75, 99, 93, 80, 70, 60])
    
    model = RandomForestRegressor(n_estimators=10, max_depth=5, random_state=42)
    model.fit(X_train, y_train)
    
    # Save model
    joblib.dump(model, MODEL_PATH)
    print(f"[QoS] Model trained and saved to {MODEL_PATH}")
    
    return model


def load_or_train_model():
    """
    Load existing model or train a new one if not found
    """
    if MODEL_PATH.exists():
        model = joblib.load(MODEL_PATH)
        print(f"[QoS] Model loaded from {MODEL_PATH}")
        return model
    else:
        print(f"[QoS] Model not found, training new model...")
        return train_qos_model()


def predict_qos(latency_ms, packet_loss_percent):
    """
    Predict QoS score based on latency and packet loss
    Returns score between 0-100
    """
    model = load_or_train_model()
    
    X = np.array([[latency_ms, packet_loss_percent]])
    prediction = model.predict(X)[0]
    
    # Clamp to 0-100 range
    qos_score = max(0, min(100, float(prediction)))
    
    return round(qos_score, 2)
