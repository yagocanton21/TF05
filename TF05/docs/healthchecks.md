# Healthchecks (Arquitetura e Sensores)

O TF05 foi programado para suportar verificações multicamadas controladas passivamente pelo arquivo `config/healthchecks.yml`. O backend em Python (FastAPI) utiliza chamadas assíncronas `(asyncio.to_thread)` impedindo que a Thread HTTP de métricas congele o Event Loop ao verificar latências externas.

## Tipos de Monitoramento Suportados

* **HTTP (Status 200/Token)**: Direcionado à Frontend (Nginx 3000) e Backend-Loopback (`127.0.0.1:5000/health/status`). Protege conexões da engine docker prevenindo DNS Deadlocks de rede.
* **Database (MySQL)**: Sensores de persistência que batem ativamente queries cruas `SELECT 1` e acionam flag de erro se o Threshold cruzar a margem crítica dos Milissegundos estipulados no `alerts.yml`.
* **TCP/Redis**: Dispara sondas exclusivas na porta crua `6379` e mede bytes de respingo sem sobrepor camadas de protocolo (Velocidade total).

*Toda leitura da máquina (Metrics Engine) é transportada para a Dashboard Web (Chart.js) que plota o histórico visual dinâmico a cada 3 segundos em milissegundos autênticos.*
