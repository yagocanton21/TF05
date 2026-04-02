import socket
from time import perf_counter
from typing import Dict, Any

def perform_tcp_check(name: str, config: Dict[str, Any]) -> dict:
    host = config.get("host", "localhost")
    port = config.get("port", 80)
    timeout = int(config.get("timeout", "5s").replace("s", ""))
    
    start_time = perf_counter()
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        
        end_time = perf_counter()
        response_time_ms = int((end_time - start_time) * 1000)
        
        if result == 0:
            return {"status": "healthy", "response_time": response_time_ms, "message": "Porta TCP Aberta"}
        else:
            return {"status": "critical", "response_time": response_time_ms, "message": "Porta TCP Fechada"}
            
    except Exception as e:
        return {"status": "critical", "response_time": 0, "message": f"Erro TCP: {str(e)}"}

def perform_custom_check(name: str, config: Dict[str, Any]) -> dict:
    # Direciona os tipos customizados pro local correto baseado no YAML
    check_type = config.get("type")
    
    if check_type == "tcp":
        return perform_tcp_check(name, config)
    else:
        return {"status": "warning", "response_time": 0, "message": f"Check desconhecido {check_type}"}
