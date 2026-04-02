let responseTimeChart;
let uptimeChart;

const initCharts = () => {
    const ctxResponse = document.getElementById('responseTimeChart').getContext('2d');
    const ctxUptime = document.getElementById('uptimeChart').getContext('2d');

    // Configuração Premium com cores harmoniosas
    Chart.defaults.color = '#94A3B8';
    Chart.defaults.font.family = 'Inter, sans-serif';

    responseTimeChart = new Chart(ctxResponse, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Ping Geral da API (ms)',
                data: [],
                borderColor: '#38BDF8',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#1E293B',
                pointBorderColor: '#38BDF8',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { grid: { display: false } }
            },
            animation: {
                duration: 400
            }
        }
    });

    uptimeChart = new Chart(ctxUptime, {
        type: 'bar',
        data: {
            labels: ['Frontend', 'Backend', 'Database', 'Redis'],
            datasets: [{
                label: 'Uptime Atualizado',
                data: [100, 100, 100, 100],
                backgroundColor: ['#10B981', '#10B981', '#10B981', '#10B981'],
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });
};

document.addEventListener("DOMContentLoaded", initCharts);

// Lê os eventos enviados pelo dashboard.js
document.addEventListener("newMetricsData", (e) => {
    if (!responseTimeChart || !uptimeChart) return;
    
    const metrics = e.detail;
    
    // Gráfico de linha (Histórico de Response Time)
    const now = new Date();
    const timeLabel = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    responseTimeChart.data.labels.push(timeLabel);
    
    // Pega o tempo do backend como principal pro gráfico de linha
    let latency = 0;
    if (metrics["api-backend"]) {
         latency = metrics["api-backend"].response_time || 0;
    }
    responseTimeChart.data.datasets[0].data.push(latency);
    
    // Limita o histórico na tela (15 ultimos pings)
    if (responseTimeChart.data.labels.length > 15) {
        responseTimeChart.data.labels.shift();
        responseTimeChart.data.datasets[0].data.shift();
    }
    responseTimeChart.update();

    // Gráfico de Barras Uptime + Cor dinâmica de falha
    const uptimeData = [];
    const keysMap = ['web-frontend', 'api-backend', 'database', 'redis-cache'];
    
    keysMap.forEach((key, index) => {
        if(metrics[key]) {
            // Se ta saudavel 100%, se deu critical barra cai pra zero parecendo downtime
            const val = metrics[key].status === 'healthy' ? 100 : (metrics[key].status === 'warning' ? 95 : 0);
            uptimeData.push(val);
            uptimeChart.data.datasets[0].backgroundColor[index] = val === 100 ? '#10B981' : (val === 95 ? '#F59E0B' : '#EF4444');
        } else {
            uptimeData.push(100);
            uptimeChart.data.datasets[0].backgroundColor[index] = '#94A3B8';
        }
    });

    uptimeChart.data.datasets[0].data = uptimeData;
    uptimeChart.update();
});
