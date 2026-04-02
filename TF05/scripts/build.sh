#!/bin/bash
set -e

echo "Iniciando build automatizado..."

# Validar ambiente
./scripts/validate-env.sh

# Executar testes
echo "Executando testes..."
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Build das imagens
echo "Construindo imagens..."
docker-compose build --no-cache

# Validar imagens
echo "Validando imagens..."
./scripts/validate-images.sh

echo "Build concluído com sucesso!"
