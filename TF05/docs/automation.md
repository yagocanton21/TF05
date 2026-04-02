# Automação

Neste documento detalhamos as lógicas robustas de Automação CI/CD configuradas para o escopo do projeto TF05, focando em segurança e disponibilidade total através de arquitetura Blue/Green.

## 1. Pipeline de Compilação (`scripts/build.sh`)
* **Testes Integrados Funcionais**: Instancia um conteiner descartável (`tf05-test-suite`) que verifica a integridade de rotas HTTP.
* **Escaneamento de Vulnerabilidades**: Atua na camada final inspecionando pontos cegos estruturais via Security Audit simulado.
* **Building Cached**: Reconstrói imagens NGINX e Python sem dependências cruzadas e utilizando volumes de cache de pacotes `pip` para evitar repetições lentas.

## 2. Roteamento ZDD Sem Queda (`scripts/deploy.sh`)
* **Zero Downtime Deploy (ZDD)**: Realiza uma pré-avaliação do status antigo através da interface interna `--pre-deploy`. Em seguida, usa `docker-compose up -d --no-deps backend frontend` para substituir gradativamente os pacotes. Essa operação substitui as APIs sem deslogar conexões persistentes vigentes (downtime real = 0).
* **Backups Automáticos Instantâneos**: Antes de iniciar o swap de contêineres, executa nativamente o backup de todas as configurações do diretório host (`scripts/backup.sh`) salvando subpastas versionadas por data+hora que protegem os releases.
