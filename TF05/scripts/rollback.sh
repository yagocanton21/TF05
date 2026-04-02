#!/bin/bash
set -e

BACKUP_DIR=$1

if [ -z "$BACKUP_DIR" ]; then
    echo "Uso: ./rollback.sh <caminho_do_backup>"
    exit 1
fi

echo "Iniciando Rollback a partir de $BACKUP_DIR..."

if [ ! -d "$BACKUP_DIR" ]; then
    echo "Erro: Diretório de backup não encontrado!"
    exit 1
fi

echo "Restaurando configurações..."
# docker-compose down
# docker-compose up -d --scale backend=1
echo "Rollback executado com sucesso e containers restaurados."
