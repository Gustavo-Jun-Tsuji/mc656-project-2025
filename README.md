# (PT) UniMaps - Mobilidade Ativa
Este é um repositório para um projeto da disciplina MC426/MC656 (Engenharia de Software) do Instituto de Computação da Unicamp.

Considerando a mobilidade ativa como o deslocamento por meios não motorizados e sua importância para a saúde e o meio ambiente, criamos o UniMaps como uma solução tecnólogica para tornar mais fácil, acessível e interessante a mobilidade ativa no campus Campinas da Unicamp. O sistema funciona como um catálogo interativo de rotas entre pontos de interesse no campus.

## Funcionalidades
No UniMaps, é possível:
1. adicionar uma rota ao sistema;
2. explorar rotas do catálogo com ou sem filtros; e
3. avaliar e denunciar rotas do sistema.

Essas funcionalidades podem ser acessadas por meio de um cadastro e login no sistema. Então, no canto superior esquerdo da página, um menu estará disponível centralizando as funcionalidades. Em particular, a adição de rotas é explicada com mais detalhes em sua seção no sistema.

## Passos para Configuração e Execução

### 1. Instale o Docker Engine
Siga as instruções disponíveis na [documentação oficial do Docker Engine](https://docs.docker.com/engine/install/).

### 2. Clone o Repositório
Execute os seguintes comandos no terminal:
```bash
git clone https://github.com/Gustavo-Jun-Tsuji/mc656-project-2025.git
cd mc656-project-2025
```

### 3. Configure o Arquivo `.env`
1. Navegue até a pasta `dotenv_files`.
2. Edite o arquivo `.env-example` com as configurações necessárias.
3. Renomeie o arquivo para `.env` após realizar as alterações.

### 4. Inicie o Docker Compose
Suba os serviços com o comando:
```bash
docker compose up
```

### 5. Acesse a Aplicação
Abra o navegador e acesse: [http://0.0.0.0:8001/](http://0.0.0.0:8001/)


## (PT) Descrição do projeto e arquitetura de software
O software do projeto, feito com Python/Django no _backend_ e Javascript/React no _frontend_, possui uma arquitetura baseada no modelo **cliente-servidor** (client-server), na qual clientes (usuários/_frontend_) solicitam recursos, serviços ou outra informação e servidores (programas/_backend_) retornam algo em resposta à solicitação. Essa arquitetura foi escolhida porque as interações usuário-sistema do nosso projeto se encaixam bem na ideia geral do modelo cliente-servidor, no qual uma aplicação _web_ se conecta a um _backend_ com lógica de negócio específica -- no nosso caso, cálculos de avaliações, retorno de rotas, filtros por _tags_ etc.

Essas interações são feitas por **chamadas a APIs RESTful**, na qual são enviados comandos de métodos HTTP (GET, POST, PATCH, PUT, DELETE) para interações com dados armazenados no banco de dados PostgreSQL do sistema. No futuro, a implementação de autenticação em particular fará bastante uso desse estilo arquitetural. Além desse, o sistema implementa o estilo **model-view-template (MVT)**, que é o padrão arquitetural do Django análogo ao estilo model-view-controller (MVC). Com ele, são criados _models_, que definem como dados são armazenados e buscados do banco de dados, _views_, que servem como a interface do usuário, e _templates_, que são as manifestações em formato HTML do sistema mais alguns itens especiais para conteúdo dinâmico. Nesse projeto, os _templates_ são de responsabilidade do React.

Uma descrição sucinta de cada componente e o diagrama C4 nível 3 da arquitetura do sistema podem ser acessados [aqui](componentdiagram.png).

## Documentação
- `ARTIFACTS.md` possui alguns artefatos gerais sobre o projeto, como a prototipação e o fluxo de telas.
- `REQUIREMENTSDOC.md` é o documento de requisitos criado após a elicitação de requisitos do projeto e que orientou a criação das _user stories_ do projeto.
- `REQUIREMENTS.md` possui as _user stories_ que guiaram o desenvolvimento do projeto, seus critérios de aceitação e o histórico de alterações dos requisitos/_user stories_.

---

# (EN) UniMaps - Active Mobility
This is a repository for a project for Unicamp's Institute of Computing's MC426/MC656 (Software Engineering) class.

Considering active mobility as transportation by non-motorized means and its importance to health and the environment, we created UniMaps as a technological solution to make it easier, more acessible and more interesting to consider active mobility options in Unicamp's Campinas campus. The system works as an interactive catalog of routes between interest points in the campus.

## Functionalities
In UniMaps, you can:
1. add a route to the system;
2. explore routes of the catalog with or without filters; and
3. rate and report routes of the system.

These functionalities can be accessed after registering and logging in to the system. Then, on the upper left corner of the page, an options menu will be available with these functionalities. A more detailed explanation of how to add routes is provided in its dedicated section.

## Setup and Execution

### 1. Install Docker Engine
Follow the instructions available on [Docker Engine's oficial documentation](https://docs.docker.com/engine/install/).

### 2. Clone the Repository
Execute the following commands on the terminal:
```bash
git clone https://github.com/Gustavo-Jun-Tsuji/mc656-project-2025.git
cd mc656-project-2025
```

### 3. `.env` file setup
1. Go to the `dotenv_files` folder.
2. Edit the `.env-example` file with the required settings.
3. Rename the file to `.env` after the changes.

### 4. Start Docker Compose
Start the services with the command:
```bash
docker compose up
```

### 5. Access the application
Open your browser and access: [http://0.0.0.0:8001/](http://0.0.0.0:8001/)

## (EN) Software design and architecture
This project's software, developed with Python/Django in the backend and Javascript/React in the frontend, has an architecture based on the **client-server** model, in which clients (users/frontend) request resources, services or other data and servers (programs/backend) respond accordingly. This architecture was chosen because the user/system interactions of our project generally follow the client-server model, in which a web application is connected to a backend with specific business logic -- in our case, rating calculations, route retrieval, tag-based filtering etc.

These interactions are handled through **RESTful API calls**, in which HTTP methods (GET, POST, PATCH, PUT, DELETE) are sent in order to interact with data stored in the system's PostgreSQL database. In the future, the authentication in particular will frequently use this architectural style. The system also implements the **model-view-template (MVT)** style, which is Django's architectural pattern analog to the model-view-controller (MVC) style. In this pattern, the system creates _models_, that define how data is stored and fetched from the database; _views_, which serve as the user interface; and _templates_, the way the system manifests itself as HTML and other special items for dynamic content. In this project, React is responsible for rendering the templates.

## Documentation
- `ARTIFACTS.md` contains some general artifacts about the project, such as the prototyping and screen flow design.
- `REQUIREMENTSDOC.md` is the requirements document which guided the creation of the project's user stories. It was created after the requirements elicitation.
- `REQUIREMENTS.md` contains the user stories that shaped the project's development, their acceptance criteria, and the change history of the requirements/user stories.
