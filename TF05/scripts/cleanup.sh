#!/bin/bash
set -e

echo "Iniciando limpeza do sistema..."

# Remove containers parados / inutilizados
docker container prune -f

# Limpeza de imagens paradas
docker image prune -af

# Limpeza opcional de backups mais velhos de 30 dias se existirem
find backups/ -type d -mtime +30 -exec rm -rf {} + 2>/dev/null || true

echo "Limpeza efetuada com sucesso!"
