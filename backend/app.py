from flask import Flask, request, jsonify
from flask_cors import CORS   # ✅ ADD THIS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)   # ✅ ENABLE CORS

# Load model and scaler
model = pickle.load(open("model/model.pkl", "rb"))
scaler = pickle.load(open("model/scaler.pkl", "rb"))

# Home route
@app.route("/")
def home():
    return {"message": "API is running 🚀"}

# Prediction API
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        features = np.array([[
            data["gre"],
            data["toefl"],
            data["rating"],
            data["sop"],
            data["lor"],
            data["cgpa"],
            data["research"]
        ]])

        features_scaled = scaler.transform(features)

        prediction = model.predict(features_scaled)[0]

        # Clamp 0–1
        prediction = max(0, min(1, prediction))

        prediction_percent = prediction * 100

        return jsonify({
            "prediction": float(prediction),
            "prediction_percent": round(prediction_percent, 2)
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        })


if __name__ == "__main__":
    print("Server starting...")
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)