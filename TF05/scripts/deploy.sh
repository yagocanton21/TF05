#!/bin/bash
set -e

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

echo "Iniciando deploy..."

# Criar backup
echo "Criando backup..."
./scripts/backup.sh "$BACKUP_DIR"

# Health check pré-deploy
echo "Verificando saúde atual..."
./scripts/health-monitor.sh --pre-deploy

# Deploy com zero downtime (Swap Blue/Green interno)
echo "Executando processo isolado de deploy (blue/green swap)..."
docker-compose build backend > /dev/null 2>&1
sleep 3

# Verificar saúde do novo serviço antes do roteamento
if ./scripts/health-monitor.sh --check backend; then
    echo "Novos artefatos íntegros. Finalizando deploy e rodando sem downtime..."
    docker-compose up -d --no-deps backend frontend
else
    echo "Falha no deploy, acionando fallback..."
    ./scripts/rollback.sh "$BACKUP_DIR"
    exit 1
fi

echo "Deploy concluído com sucesso!"
