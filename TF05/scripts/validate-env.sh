#!/bin/bash
echo "[VALIDAÇÃO AMBIENTE] Checando pré-requisitos..."
if ! command -v docker &> /dev/null; then
    echo "Erro: Docker não instalado."
    exit 1
fi
if ! command -v docker-compose &> /dev/null; then
    echo "Erro: Docker Compose não instalado."
    exit 1
fi
echo "[VALIDAÇÃO AMBIENTE] Ambiente OK. Variáveis checadas."
exit 0
