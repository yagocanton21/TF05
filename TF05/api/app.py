import yaml
import asyncio
import mysql.connector
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import os

from healthchecks.http_check import check_http_service
from healthchecks.db_check import check_db_connection
from healthchecks.custom_check import perform_custom_check

app = FastAPI(title="TF05 Health Monitor API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Caminho para configuração (referente ao Docker-compose volume)
CONFIG_PATH = "/app/config/healthchecks.yml"
DB_CONFIG = {
    "host": "db", "user": "user", "password": "pass", "database": "app", "port": 3306
}

last_health_state = {}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

def log_metric_to_db(service_name, response_time, status):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO metrics_history (service_name, response_time, status) VALUES (%s, %s, %s)",
            (service_name, response_time, status)
        )
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Erro salvando db métricas: {e}")

def run_healthchecks():
    global last_health_state
    if not os.path.exists(CONFIG_PATH):
        return

    with open(CONFIG_PATH, "r") as f:
        config_data = yaml.safe_load(f)
        
    checks = config_data.get("healthchecks", {})
    
    for service_name, settings in checks.items():
        ctype = settings.get("type", "")
        result = {}
        if ctype == "http":
            result = check_http_service(service_name, settings)
        elif ctype == "database":
            result = check_db_connection(service_name, settings)
        else:
            result = perform_custom_check(service_name, settings)
            
        # Atualiza dicionário na ram
        last_health_state[service_name] = result
        
        # Loga no histórico
        log_metric_to_db(service_name, result.get("response_time", 0), result.get("status", "critical"))

async def periodic_checks():
    while True:
        try:
            await asyncio.to_thread(run_healthchecks)
        except Exception as e:
            print("Erro no scheduler de healthchecks:", e)
        await asyncio.sleep(15)  # Checa tudo a cada 15 segundos  

@app.on_event("startup")
async def schedule_tasks():
    asyncio.create_task(periodic_checks())

@app.get("/health/status")
def get_health_status():
    return {"status": "ok", "message": "Sistema Monitor Operante"}

@app.get("/metrics")
def get_metrics():
    return last_health_state

@app.get("/metrics/history")
def get_metrics_history():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        # Pegar histórico dos últimos checks, limitando para não estourar a API
        cursor.execute("SELECT * FROM metrics_history ORDER BY id DESC LIMIT 50")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    except Exception as e:
        return {"error": str(e)}
