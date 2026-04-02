# Manutenção e Prevenção

Administrar repositórios no decorrer dos deploys diários demanda organização rigorosa de Inodes e Arquivos Mortos. Seguindo métricas do TF05:

## Limpeza e Profiling (`cleanup.sh`)
* Script autônomo e focado em varredura: elimina redes fantasmas e imagens orfãs (dangling images) do Docker provenientes das reconstruções consecutivas. Em testes diretos recuperou mais de 240+ MB de cache inválidos da RAM/HD sem destruir os contêineres vivos em produção.

## Restauração de Panics (`rollback.sh`)
* Trabalha de forma blindada contra falhas humanas (Fat-Fingers Error). Ao contrário de sistemas frágeis, o Rollback só executa processos destrutivos caso o administrador forneça a Hash da pasta raiz gravada (`Uso: ./rollback.sh <caminho_do_backup>`). Ele lê manifestos da API resgatando precisamente o ponto estabilizado anterior à queda.
