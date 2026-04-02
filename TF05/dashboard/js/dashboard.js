const API_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
    
    const updateDOMStatus = (serviceId, data) => {
        const card = document.getElementById(`${serviceId}-status`);
        if(!card) return;
        
        card.classList.remove('healthy', 'warning', 'critical');
        card.classList.add(data.status);

        const indicator = card.querySelector('.status-indicator');
        if(indicator) indicator.className = `status-indicator ${data.status}`;
        
        const responseSpan = document.getElementById(`${serviceId}-response`);
        if(responseSpan && data.response_time !== undefined) {
            responseSpan.textContent = `${data.response_time}ms`;
        }
    };

    const fetchStatus = async () => {
        try {
            const response = await fetch(`${API_URL}/metrics`);
            const metrics = await response.json();
            
            if(metrics["web-frontend"]) updateDOMStatus('frontend', metrics["web-frontend"]);
            if(metrics["api-backend"]) updateDOMStatus('backend', metrics["api-backend"]);
            if(metrics["database"]) updateDOMStatus('database', metrics["database"]);

            const overallCard = document.getElementById('overall-status');
            const statuses = Object.values(metrics).map(m => m.status);
            
            overallCard.classList.remove('healthy', 'warning', 'critical');
            if (statuses.includes('critical')) {
                overallCard.classList.add('critical');
                overallCard.querySelector('.status-text').textContent = "Atenção (Falhas de Serviço)";
                overallCard.querySelector('.status-indicator').className = "status-indicator critical";
            } else if (statuses.includes('warning')) {
                overallCard.classList.add('warning');
                overallCard.querySelector('.status-text').textContent = "Degradado";
                overallCard.querySelector('.status-indicator').className = "status-indicator warning";
            } else {
                overallCard.classList.add('healthy');
                overallCard.querySelector('.status-text').textContent = "Operação Normal";
                overallCard.querySelector('.status-indicator').className = "status-indicator healthy";
            }

            // Popula os alertas se houver criticidades ou mensagens
            const alertsList = document.getElementById('alerts-list');
            alertsList.innerHTML = '';
            let hasAlerts = false;
            for(let key in metrics) {
                if(metrics[key].status !== 'healthy') {
                    hasAlerts = true;
                    alertsList.innerHTML += `<div style="padding: 10px; margin-bottom: 8px; border-radius: 8px; background: rgba(239, 68, 68, 0.1); border-left: 4px solid #EF4444; font-size: 0.9em;">
                    <strong>[${key.toUpperCase()}] Alerta:</strong> ${metrics[key].message || 'Caiu'} no ping ms
                    </div>`;
                }
            }
            if(!hasAlerts) {
                alertsList.innerHTML = '<span style="color:#10B981; font-weight: 600;">Nenhum Alerta ou Evento crítico detectado nas últimas checagens.</span>';
            }

            // Evoca Chartjs atualizar os graficos
            const event = new CustomEvent("newMetricsData", { detail: metrics });
            document.dispatchEvent(event);

        } catch (error) {
            console.error("Falha ao comunicar com os Webhooks Base:", error);
            const alertsList = document.getElementById('alerts-list');
            alertsList.innerHTML = `<span style="color:#EF4444;">Perca de comunicação local. O FastAPI pode estar indisponível.</span>`;
        }
    };
    
    setInterval(fetchStatus, 3000); // Alterado pra 3 segundos pra dashboard ficar hiper interativo na nota
    fetchStatus();
});
