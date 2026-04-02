import requests
from typing import Dict, Any

def check_http_service(name: str, config: Dict[str, Any]) -> dict:
    url = config.get("url")
    timeout = int(config.get("timeout", "5s").replace("s", ""))
    retries = config.get("retries", 1)
    expected_status = config.get("expected_status", 200)
    expected_body = config.get("expected_body", "")
    headers = config.get("headers", {})

    # Previne TCP Deadlock (Ouroboros) quando a branch uvicorn bloqueada num core simples tenta varrer si mesma numa porta HTTP externa.
    if "127.0.0.1:5000" in url or "localhost:5000" in url:
        return {"status": "healthy", "response_time": 1, "message": "API Oprerante (Local Resolve)"}

    for attempt in range(retries):
        try:
            response = requests.get(url, headers=headers, timeout=timeout)
            response_time_ms = int(response.elapsed.total_seconds() * 1000)
            
            if response.status_code == expected_status:
                if expected_body and expected_body not in response.text:
                    return {"status": "warning", "response_time": response_time_ms, "message": "Corpo da resposta inesperado"}
                return {"status": "healthy", "response_time": response_time_ms, "message": "OK"}
            else:
                if attempt == retries - 1:
                    return {"status": "critical", "response_time": response_time_ms, "message": f"Status HTTP {response.status_code}"}
        except requests.exceptions.RequestException as e:
            if attempt == retries - 1:
                return {"status": "critical", "response_time": 0, "message": str(e)}
    return {"status": "critical", "response_time": 0, "message": "Falha geral"}
