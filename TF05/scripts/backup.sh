#!/bin/bash
set -e

TARGET_DIR=$1

if [ -z "$TARGET_DIR" ]; then
    TARGET_DIR="backups/$(date +%Y%m%d_%H%M%S)"
fi

echo "Criando backup em $TARGET_DIR..."
mkdir -p "$TARGET_DIR"

# Faz backup das configurações e possível dump do banco de dados
cp -r config/ "$TARGET_DIR/config/" || true
echo "Backup gerado em $TARGET_DIR"
