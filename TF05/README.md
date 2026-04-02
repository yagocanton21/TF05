# TF05 - Sistema de Monitoramento e Automação

## Aluno
- **Nome:** Yago Canton
- **RA:** 6324598
- **Curso:** Análise e Desenvolvimento de Sistemas

## Funcionalidades
- Healthchecks inteligentes (HTTP, TCP, Database)
- Dashboard de monitoramento em tempo real
- Sistema de alertas (email, webhook)
- Automação completa de deploy
- Rollback automático
- Scripts de manutenção
- Backup automatizado

## Como Executar

### Pré-requisitos
- Docker e Docker Compose
- Bash (para scripts de automação)

### 🚀 Guia de Implantação e Testes (Para o Avaliador)
Para testar a arquitetura em um ambiente virgem, siga a estrita ordem DevOps de subida da Camada de Banco antes do Código, para evitar quebra de Timeout nos Testes de Qualidade:

```bash
# 1. Limpeza Profunda de ambiente prévio (Destrói Orfãos e Redes antigas)
docker-compose down -v --remove-orphans

# 2. Pipeline de Build Automática (Validação de Variáveis e Compilação das Imagens NGINX/Py)
bash scripts/build.sh

# 3. Levantar Camada Histórica (Banco de Dados e Cache) - Requisito Vital
docker-compose up -d db redis
# ⚠️ Atenção (Cold Start): Aguarde cerca de 15 segundos para o MySQL criar suas permissões lógicas antes de prosseguir!

# 4. Acionar Deploy Automático 'Blue/Green' (Geração de Backup interno + Roteamento de API/WEB)
bash scripts/deploy.sh

# 5. Dashboard Premium
# Acesse pelo navegador pressionando (Ctrl+F5) para habilitar as Animações JS do Chart.js:
# URL: http://localhost:3000

# 6. Auditar Latências via Assincronismo 
bash scripts/health-monitor.sh --check-all
```
## Scripts Disponíveis
- `./scripts/build.sh` - Build automatizado com testes
- `./scripts/deploy.sh` - Deploy com zero downtime
- `./scripts/rollback.sh` - Rollback para versão anterior
- `./scripts/backup.sh` - Backup de dados e configurações
- `./scripts/cleanup.sh` - Limpeza de recursos antigos
- `./scripts/health-monitor.sh` - Monitoramento manual

## Configuração
- Healthchecks: `config/healthchecks.yml`
- Alertas: `config/alerts.yml`
- Thresholds: `config/thresholds.yml`

## Endpoints
- Dashboard: http://localhost:3000
- API Métricas: http://localhost:5000/metrics
- Health Status: http://localhost:5000/health/status

## Monitoramento
```bash
# Status em tempo real
./scripts/health-monitor.sh --watch

# Relatório de saúde
./scripts/health-monitor.sh --report

# Testar alertas
./scripts/health-monitor.sh --test-alerts
```

## Entrega
### Repositório GitHub
- Nome: tfsImplantacaoSistemas2026
- Pasta: TF05/

## Validação
```bash
# Teste completo de automação
./scripts/build.sh
./scripts/deploy.sh
./scripts/health-monitor.sh --check-all
```

## Dicas
- Teste todos os scripts antes de entregar
- Implemente rollback funcional
- Configure alertas realistas
- Documente cada script detalhadamente
- Use healthchecks específicos por serviço
