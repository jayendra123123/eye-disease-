import os
import io
import numpy as np
from PIL import Image
import tensorflow as tf
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the custom F1Score metric class
class F1Score(tf.keras.metrics.Metric):
    def __init__(self, name='f1', **kwargs):
        super(F1Score, self).__init__(name=name, **kwargs)
        self.precision = tf.keras.metrics.Precision()
        self.recall = tf.keras.metrics.Recall()

    def update_state(self, y_true, y_pred, sample_weight=None):
        # Convert one-hot labels to class index
        if y_true.shape[-1] > 1:
            y_true = tf.argmax(y_true, axis=-1)

        # Convert probabilities to predicted class
        y_pred = tf.argmax(y_pred, axis=-1)

        self.precision.update_state(y_true, y_pred, sample_weight)
        self.recall.update_state(y_true, y_pred, sample_weight)

    def result(self):
        precision = self.precision.result()
        recall = self.recall.result()
        return 2 * ((precision * recall) / (precision + recall + 1e-7))

    def reset_states(self):
        self.precision.reset_states()
        self.recall.reset_states()

    def get_config(self):
        base_config = super().get_config()
        return base_config

    @classmethod
    def from_config(cls, config):
        return cls(**config)

app = FastAPI(title="DeepEye Disease Detection API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global variables for models
mobilenet_model = None
resnet_model = None
densenet_model = None
efficientnetb0_model = None

# Class names (based on your dataset structure)
CLASS_NAMES = ["cataract", "diabetic_retinopathy", "glaucoma", "normal"]

def load_models():
    """Load all ML models on startup"""
    global mobilenet_model, resnet_model, densenet_model, efficientnetb0_model
    # Define custom objects for model loading
    custom_objects = {'F1Score': F1Score}
    try:
        # Load MobileNet model
        if os.path.exists("./mobileNet_model.keras"):
            mobilenet_model = tf.keras.models.load_model("./mobileNet_model.keras", custom_objects=custom_objects)
            logger.info("✅ MobileNet model loaded successfully")
        elif os.path.exists("./mobileNet_model.h5"):
            mobilenet_model = tf.keras.models.load_model("./mobileNet_model.h5", custom_objects=custom_objects)
            logger.info("✅ MobileNet model loaded successfully (h5 format)")
        else:
            logger.warning("❌ MobileNet model not found")

        # Load ResNet model
        if os.path.exists("./ResNet_model.keras"):
            resnet_model = tf.keras.models.load_model("./ResNet_model.keras", custom_objects=custom_objects)
            logger.info("✅ ResNet model loaded successfully")
        elif os.path.exists("./ResNet_model.h5"):
            resnet_model = tf.keras.models.load_model("./ResNet_model.h5", custom_objects=custom_objects)
            logger.info("✅ ResNet model loaded successfully (h5 format)")
        else:
            logger.warning("❌ ResNet model not found")

        # Load DenseNet model
        if os.path.exists("./DenseNet_model.keras"):
            densenet_model = tf.keras.models.load_model("./DenseNet_model.keras", custom_objects=custom_objects)
            logger.info("✅ DenseNet model loaded successfully")
        elif os.path.exists("./DenseNet_model.h5"):
            densenet_model = tf.keras.models.load_model("./DenseNet_model.h5", custom_objects=custom_objects)
            logger.info("✅ DenseNet model loaded successfully (h5 format)")
        else:
            logger.warning("❌ DenseNet model not found")

        # Load EfficientNetB0 model
        if os.path.exists("./EfficientNetB0_model.keras"):
            efficientnetb0_model = tf.keras.models.load_model("./EfficientNetB0_model.keras", custom_objects=custom_objects)
            logger.info("✅ EfficientNetB0 model loaded successfully")
        elif os.path.exists("./EfficientNetB0_model.h5"):
            efficientnetb0_model = tf.keras.models.load_model("./EfficientNetB0_model.h5", custom_objects=custom_objects)
            logger.info("✅ EfficientNetB0 model loaded successfully (h5 format)")
        else:
            logger.warning("❌ EfficientNetB0 model not found")

    except Exception as e:
        logger.error(f"❌ Error loading models: {str(e)}")

def preprocess_image(image_data: bytes) -> np.ndarray:
    """Preprocess uploaded image for model prediction"""
    try:
        # Load image from bytes
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to model input size (224x224)
        image = image.resize((224, 224))
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Add batch dimension and normalize
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array.astype(np.float32) / 255.0
        
        return img_array
    
    except Exception as e:
        logger.error(f"❌ Error preprocessing image: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid image format")

def get_prediction_details(predictions: np.ndarray, model_name: str):
    """Convert model predictions to human-readable format"""
    predicted_class_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][predicted_class_idx]) * 100
    predicted_class = CLASS_NAMES[predicted_class_idx]
    
    # Determine if disease is detected (not normal)
    is_disease_detected = predicted_class != "normal"
    
    # Get severity based on confidence
    if confidence >= 90:
        severity = "Severe"
    elif confidence >= 70:
        severity = "Moderate"
    else:
        severity = "Mild"
    
    # Generate recommendations based on detected condition
    recommendations = get_recommendations(predicted_class, severity)
    
    # Format disease name properly
    disease_name = predicted_class.replace("_", " ").title()
    
    return {
        "model_used": model_name,
        "detected": is_disease_detected,
        "disease": disease_name,
        "predicted_class": predicted_class,
        "confidence": round(confidence, 1),
        "severity": severity if is_disease_detected else "N/A",
        "recommendations": recommendations,
        "all_predictions": {
            CLASS_NAMES[i]: round(float(predictions[0][i]) * 100, 1) 
            for i in range(len(CLASS_NAMES))
        }
    }

def get_recommendations(disease: str, severity: str):
    """Get medical recommendations based on detected condition"""
    base_recommendations = [
        "⚠️ This is an AI analysis tool - always consult healthcare professionals",
        "Schedule a comprehensive eye examination with an ophthalmologist"
    ]
    
    if disease == "diabetic_retinopathy":
        return base_recommendations + [
            "Monitor blood sugar levels regularly and maintain good diabetic control",
            "Follow up with your endocrinologist for diabetes management",
            "Consider laser treatment if recommended by your doctor"
        ]
    elif disease == "glaucoma":
        return base_recommendations + [
            "Monitor intraocular pressure regularly",
            "Use prescribed eye drops as directed",
            "Avoid activities that may increase eye pressure"
        ]
    elif disease == "cataract":
        return base_recommendations + [
            "Discuss surgical options with your ophthalmologist",
            "Use proper lighting when reading or working",
            "Consider updating eyeglass prescription"
        ]
    else:
        return base_recommendations + [
            "Maintain regular eye check-ups",
            "Protect eyes from UV radiation",
            "Follow a healthy diet rich in eye-friendly nutrients"
        ]

@app.on_event("startup")
async def startup_event():
    """Load models when the API starts"""
    logger.info("🚀 Starting DeepEye API...")
    load_models()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "DeepEye Disease Detection API",
        "status": "running",
        "models_loaded": {
            "mobilenet": mobilenet_model is not None,
            "resnet": resnet_model is not None,
            "densenet": densenet_model is not None,
            "efficientnetb0": efficientnetb0_model is not None
        }
    }

@app.post("/predict")
async def predict_disease(file: UploadFile = File(...), model: str = "mobilenet"):
    """Main prediction endpoint. Specify model: mobilenet, resnet, densenet, efficientnetb0"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Please upload an image file")

        # Read image data
        image_data = await file.read()

        # Preprocess image
        processed_image = preprocess_image(image_data)

        # Model selection logic
        model = model.lower()
        selected_model = None
        model_name = ""
        if model == "mobilenet" and mobilenet_model is not None:
            selected_model = mobilenet_model
            model_name = "MobileNet"
        elif model == "resnet" and resnet_model is not None:
            selected_model = resnet_model
            model_name = "ResNet"
        elif model == "densenet" and densenet_model is not None:
            selected_model = densenet_model
            model_name = "DenseNet"
        elif model == "efficientnetb0" and efficientnetb0_model is not None:
            selected_model = efficientnetb0_model
            model_name = "EfficientNetB0"
        else:
            # Fallback: use first available model
            if mobilenet_model is not None:
                selected_model = mobilenet_model
                model_name = "MobileNet"
            elif resnet_model is not None:
                selected_model = resnet_model
                model_name = "ResNet"
            elif densenet_model is not None:
                selected_model = densenet_model
                model_name = "DenseNet"
            elif efficientnetb0_model is not None:
                selected_model = efficientnetb0_model
                model_name = "EfficientNetB0"
            else:
                raise HTTPException(status_code=503, detail="No models available")

        predictions = selected_model.predict(processed_image)
        result = get_prediction_details(predictions, model_name)
        logger.info(f"✅ Prediction completed: {result['disease']} ({result['confidence']}%)")
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during prediction")

@app.post("/predict/ensemble")
async def predict_disease_ensemble(file: UploadFile = File(...)):
    """Ensemble prediction using all available models"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Please upload an image file")

        # Read image data
        image_data = await file.read()
        processed_image = preprocess_image(image_data)

        predictions_list = []
        models_used = []

        # Get predictions from all available models
        if mobilenet_model is not None:
            mobilenet_pred = mobilenet_model.predict(processed_image)
            predictions_list.append(mobilenet_pred[0])
            models_used.append("MobileNet")
        if resnet_model is not None:
            resnet_pred = resnet_model.predict(processed_image)
            predictions_list.append(resnet_pred[0])
            models_used.append("ResNet")
        if densenet_model is not None:
            densenet_pred = densenet_model.predict(processed_image)
            predictions_list.append(densenet_pred[0])
            models_used.append("DenseNet")
        if efficientnetb0_model is not None:
            efficientnetb0_pred = efficientnetb0_model.predict(processed_image)
            predictions_list.append(efficientnetb0_pred[0])
            models_used.append("EfficientNetB0")

        if not predictions_list:
            raise HTTPException(status_code=503, detail="No models available")

        # Average predictions from all models
        ensemble_pred = np.mean(predictions_list, axis=0)
        ensemble_pred = np.expand_dims(ensemble_pred, axis=0)

        result = get_prediction_details(ensemble_pred, f"Ensemble ({', '.join(models_used)})")

        logger.info(f"✅ Ensemble prediction completed: {result['disease']} ({result['confidence']}%)")
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Ensemble prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during ensemble prediction")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)