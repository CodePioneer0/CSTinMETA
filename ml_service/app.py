from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import json
import os
import requests
from dotenv import load_dotenv

# Load env variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

MODEL_NAME = "llama-3.1-8b-instant"
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

app = FastAPI()

# Load ML model + encoders
model = joblib.load("risk_model.pkl")
time_encoder = joblib.load("time_encoder.pkl")
sugar_encoder = joblib.load("sugar_encoder.pkl")


# -------------------------------
# INPUT SCHEMA
# -------------------------------
class PredictRequest(BaseModel):
    bmi: float
    steps_today: int
    sleep_minutes: float
    sugar_count_today: int
    sugar_count_week: int
    time_of_day: str
    sugar_type: str
    estimated_sugar_grams: float = 0


# -------------------------------
# RULE BASED LOGIC
# -------------------------------
def get_risk_tag(risk, sugar_count_week, sleep_hours, steps_today):
    if sugar_count_week >= 10:
        return "HIGH_SUGAR_HABIT"

    elif sleep_hours < 6 and risk > 0.5:
        return "SLEEP_DISRUPTION"

    elif steps_today < 3000:
        return "WEIGHT_GAIN_RISK"

    elif risk > 0.7:
        return "ENERGY_CRASH"

    else:
        return "DEHYDRATION_RISK"


def get_suggested_action(risk, sugar_count_today, sleep_hours, steps_today):
    if sugar_count_today >= 3:
        return "STOP_MORE_SUGAR"

    elif steps_today < 5000:
        return "10_MIN_WALK"

    elif sleep_hours < 6:
        return "DRINK_WATER"

    elif risk > 0.6:
        return "PROTEIN_SWAP"

    else:
        return "EAT_FRUIT"


def get_fallback_explanation(action):
    if action == "STOP_MORE_SUGAR":
        return "You’ve already had multiple sugary items today, so stopping now helps prevent a bigger crash."

    elif action == "DRINK_WATER":
        return "Low sleep can worsen sugar effects, so hydration helps your body recover."

    elif action == "10_MIN_WALK":
        return "Your step count is low today, and a short walk helps reduce sugar spikes."

    elif action == "PROTEIN_SWAP":
        return "Protein stabilizes blood sugar and reduces cravings later."

    else:
        return "Fruit provides sweetness with fiber, helping reduce sugar spikes."


def get_fallback_insight(risk_tag):
    if risk_tag == "HIGH_SUGAR_HABIT":
        return "Your sugar intake has been high this week, which may increase cravings and fatigue."

    elif risk_tag == "SLEEP_DISRUPTION":
        return "Sugar later in the day may affect your sleep recovery tonight."

    elif risk_tag == "ENERGY_CRASH":
        return "This sugar intake may cause an energy crash later in the day."

    elif risk_tag == "WEIGHT_GAIN_RISK":
        return "On low activity days, sugar intake can increase long-term weight gain risk."

    else:
        return "Sugar spikes often feel good short-term but can cause tiredness later."


# -------------------------------
# GROQ LLM CALL
# -------------------------------
def generate_text_with_groq(context):
    if not GROQ_API_KEY:
        return None

    prompt = f"""
You are a friendly health assistant for young adults.

Generate 2 short messages:
1) insight_text: a simple cause-effect insight about the sugar intake
2) explanation: why the suggested action was chosen

Rules:
- Do NOT mention diabetes, prediabetes, medical diagnosis, or scary disease terms.
- Use simple and friendly tone.
- Keep insight_text <= 20 words.
- Keep explanation <= 25 words.
- Output must be strict JSON only.

Context:
{json.dumps(context)}
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.6
    }

    response = requests.post(GROQ_URL, headers=headers, json=payload)

    if response.status_code != 200:
        return None

    result = response.json()
    raw = result["choices"][0]["message"]["content"].strip()

    raw = raw.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(raw)
    except:
        return None


# -------------------------------
# MAIN PREDICT ENDPOINT
# -------------------------------
@app.post("/predict")
def predict(data: PredictRequest):
    sleep_hours = data.sleep_minutes / 60

    # Encode categorical values safely
    try:
        time_encoded = time_encoder.transform([data.time_of_day])[0]
    except:
        time_encoded = 0

    try:
        sugar_encoded = sugar_encoder.transform([data.sugar_type])[0]
    except:
        sugar_encoded = 0

    # Create dataframe for prediction
    X = pd.DataFrame([{
        "bmi": data.bmi,
        "steps_today": data.steps_today,
        "sleep_hours": sleep_hours,
        "sugar_count_today": data.sugar_count_today,
        "sugar_count_week": data.sugar_count_week,
        "time_of_day": time_encoded,
        "sugar_type": sugar_encoded
    }])

    # Predict risk
    risk = model.predict(X)[0]

    # Clamp risk
    if risk < 0:
        risk = 0
    if risk > 1:
        risk = 1

    # Rule based tag + action
    risk_tag = get_risk_tag(risk, data.sugar_count_week, sleep_hours, data.steps_today)
    suggested_action = get_suggested_action(risk, data.sugar_count_today, sleep_hours, data.steps_today)

    # Context for LLM
    context = {
        "bmi": data.bmi,
        "steps_today": data.steps_today,
        "sleep_hours": round(sleep_hours, 2),
        "sugar_count_today": data.sugar_count_today,
        "sugar_count_week": data.sugar_count_week,
        "time_of_day": data.time_of_day,
        "sugar_type": data.sugar_type,
        "estimated_sugar_grams": data.estimated_sugar_grams,
        "risk_tag": risk_tag,
        "risk_score": round(float(risk), 2),
        "suggested_action": suggested_action
    }

    # Call Groq LLM
    insight_text = None
    explanation = None

    llm_output = generate_text_with_groq(context)

    if llm_output:
        insight_text = llm_output.get("insight_text")
        explanation = llm_output.get("explanation")

    # Fallback text if Groq fails
    if not insight_text:
        insight_text = get_fallback_insight(risk_tag)

    if not explanation:
        explanation = get_fallback_explanation(suggested_action)

    return {
        "risk_tag": risk_tag,
        "risk_score": round(float(risk), 2),
        "insight_text": insight_text,
        "suggested_action": suggested_action,
        "explanation": explanation
    }
