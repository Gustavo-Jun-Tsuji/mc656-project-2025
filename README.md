# (PT) Projeto MC426/MC656 - Mobilidade Ativa
Repositório para um projeto da disciplina MC426/MC656 (Engenharia de Software) do Instituto de Computação da Unicamp.

(inserir descrição em português aqui)

# (PT) Descrição do projeto e arquitetura de software
O software do projeto, feito com Python/Django no _backend_ e Javascript/React no _frontend_, possui uma arquitetura baseada no modelo **cliente-servidor** (client-server), na qual clientes (usuários/_frontend_) solicitam recursos, serviços ou outra informação e servidores (programas/_backend_) retornam algo em resposta à solicitação. Essa arquitetura foi escolhida porque as interações usuário-sistema do nosso projeto se encaixam bem na ideia geral do modelo cliente-servidor, no qual uma aplicação _web_ se conecta a um _backend_ com lógica de negócio específica -- no nosso caso, cálculos de avaliações, retorno de rotas, filtros por _tags_ etc.

Essas interações são feitas por **chamadas a APIs RESTful**, na qual são enviados comandos de métodos HTTP (GET, POST, PATCH, PUT, DELETE) para interações com dados armazenados no banco de dados PostgreSQL do sistema. No futuro, a implementação de autenticação em particular fará bastante uso desse estilo arquitetural. Além desse, o sistema implementa o estilo **model-view-template (MVT)**, que é o padrão arquitetural do Django análogo ao estilo model-view-controller (MVC). Com ele, são criados _models_, que definem como dados são armazenados e buscados do banco de dados, _views_, que servem como a interface do usuário, e _templates_, que são as manifestações em formato HTML do sistema mais alguns itens especiais para conteúdo dinâmico. Nesse projeto, os _templates_ são de responsabilidade do React.

Uma descrição sucinta de cada componente e o diagrama C4 nível 3 da arquitetura do sistema podem ser acessados [aqui](componentdiagram.png).

# (EN) MC426/MC656 Project - Active Mobility
Repository for a project of MC426/MC656 (Software Engineering) course of Unicamp's Institute of Computing.

(inserir descrição em inglês aqui)

# (EN) Software design and architecture

(to be added in english soon)
