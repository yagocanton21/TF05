import mysql.connector
from time import perf_counter
from typing import Dict, Any
from urllib.parse import urlparse

def check_db_connection(name: str, config: Dict[str, Any]) -> dict:
    connection_url = config.get("connection", "")
    query = config.get("query", "SELECT 1")
    retries = config.get("retries", 1)

    try:
        # mysql://user:pass@db:3306/app
        parsed = urlparse(connection_url)
        db_config = {
            "user": parsed.username,
            "password": parsed.password,
            "host": parsed.hostname,
            "port": parsed.port or 3306,
            "database": parsed.path.lstrip('/')
        }
        
        start_time = perf_counter()
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute(query)
        cursor.fetchall()
        cursor.close()
        conn.close()
        
        end_time = perf_counter()
        response_time_ms = int((end_time - start_time) * 1000)
        
        return {"status": "healthy", "response_time": response_time_ms, "message": "DB Online"}
        
    except Exception as e:
        return {"status": "critical", "response_time": 0, "message": f"Erro de conexão DB: {str(e)}"}
