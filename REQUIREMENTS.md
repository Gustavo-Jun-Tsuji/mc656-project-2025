# Elicitação de requisitos
A elicitação de requisitos começou desde a primeira idealização do projeto em março, quando fizemos uma sessão de _brainstorming_ de ideias e definimos o MVP do projeto. Para validarmos nossas ideias, realizamos entrevistas com três estudantes da Unicamp. O roteiro de entrevistas e as respostas transcritas estão [aqui](https://docs.google.com/document/d/1jlGIR3KYCl7HlIZ5O9nZma3UJ8xCyHSlMV7LgNYG6Cw/edit?usp=sharing). Uma prototipação será feita e validada com pessoas do nosso público-alvo, inclusive pessoas entrevistadas, para novamente validarmos nossas ideias e termos uma ideia de como o sistema será de verdade. Um _link_ para a prototipação será adicionado neste arquivo futuramente. 

# Documento de requisitos
O documento de requisitos do projeto pode ser acessado [aqui](https://docs.google.com/document/d/1bfxvux5tZ281JTklTgLpy9pdul8RSYijmZBbUmnGSqw/edit?tab=t.0). Quaisquer adições a esse documento serão registradas neste arquivo `REQUIREMENTS.md`.

# Épicos e _user stories_
Para os requisitos do documento original de requisitos, foram pensados os épicos e _user stories_ associados a seguir. 

### EP01 - Gerenciamento de acesso e de usuários
**Descrição**: Controle de permissões, autenticação e gestão de usuários da plataforma.

| _Story Points_ | _User Story_ | Descrição                                                                 |
|:--------------:|:------------:|---------------------------------------------------------------------------|
| 02             | US01.1       | Como administrador, desejo cadastrar um novo usuário para que ele tenha acesso à plataforma. |
| 02             | US01.2       | Como administrador, desejo visualizar a lista de usuários cadastrados para acompanhar quem usa o sistema. |
| 02             | US01.3       | Como administrador, desejo editar os dados de um usuário para manter o sistema atualizado. |
| 02             | US01.4       | Como administrador, desejo excluir usuários da plataforma quando necessário para ter melhor controle sobre testes e uso do sistema. |
| 03             | US01.5       | Como usuário, desejo realizar login com minhas credenciais para acessar funcionalidades personalizadas. |
| 01             | US01.6       | Como visitante, desejo visualizar rotas e pontos de interesse sem estar logado para rapidamente ter acesso às informações mais pertinentes da plataforma. |


### EP02 - Interações usuários-sistema
**Descrição**: Contribuições do usuário com o conteúdo da plataforma.

| _Story Points_ | _User Story_ | Descrição                                                                 |
|:--------------:|:------------:|---------------------------------------------------------------------------|
| 03             | US02.1       | Como administrador, desejo cadastrar, editar ou excluir rotas e pontos de interesse para manter o conteúdo da plataforma atualizado. |
| 05             | US02.2       | Como usuário autenticado, desejo adicionar rotas ou pontos de interesse para contribuir com o sistema. |
| 03             | US02.3       | Como usuário autenticado, desejo avaliar uma rota com estrelas e um comentário para ajudar outros usuários. |
| 03             | US02.4       | Como usuário autenticado, desejo recomendar rotas para outras pessoas por meio de um link ou sugestão no sistema para aumentar o conhecimento de rotas que acho interessante. |

### EP03 - Visualizações no sistema
**Descrição**: Visualização e classificação de rotas e pontos de interesse.

| _Story Points_ | _User Story_ | Descrição                                                                 |
|:--------------:|:------------:|---------------------------------------------------------------------------|
| 10             | US03.1       | Como usuário, desejo visualizar rotas no mapa com detalhes como origem, destino, pontos de interesse e duração. |
| 02             | US03.2       | Como usuário, desejo aplicar filtros nas rotas usando _tags_ para facilitar minhas buscas. |
| 04             | US03.3       | Como usuário, desejo ver avaliações e comentários de outros usuários sobre uma rota para considerar o que os outros dizem dela antes de usá-la. |

# Critérios de aceitação

Os critérios de aceitação dos épicos e _user stories_ foram feitos com base no método GWT (_given when then_, ou _dado quando então_) e estão a seguir:

### EP01 - Gerenciamento de acesso e de usuários
**Descrição**: Controle de permissões, autenticação e gestão de usuários da plataforma.
- **US01.1** - 100% dos dados dos usuários cadastrados pelo administrador aparecem no banco de dados. 
- **US01.2** – 100% dos dados dos usuários cadastrados retornados quando o administrador estiver visualizando a lista de usuários cadastrados.
- **US01.3** – 100% dos tipos de dados alterados sendo atualizados no banco de dados.
- **US01.4** – 100% dos dados de usuários excluídos sendo deletados do banco de dados.
- **US01.5** – 100% das funcionalidades de usuários autenticados disponíveis após login.
- **US01.6** – 100% das rotas e pontos de interesse acessíveis para visitantes.

### EP02 - Interações usuários-sistema
**Descrição**: Contribuições do usuário com o conteúdo da plataforma.
- **US02.1** – 100% dos dados afetados corretamente persistidos, atualizados ou removidos do banco de dados de acordo com a ação realizada, sem inconsistências ou perdas de integridade.
- **US02.2** – 100% dos dados inseridos corretamente salvos no banco de dados e acessíveis por buscas na plataforma.
- **US02.3** – 100% dos dados inseridos corretamente salvos no banco de dados, associados ao usuário avaliador e à rota de forma não ambígua e com edições sobrescrevendo dados anteriores.
- **US02.4** – 100% dos dados das recomendações chegando ao usuário destinatário e 80% dos testadores sabendo onde achar a recomendação em menos de 15 segundos depois dela chegar.

### EP03 - Visualizações no sistema
**Descrição**: Visualização e classificação de rotas e pontos de interesse.
- **US03.1**
	- Origem, destino, pontos de interesse e trajeto de qualquer rota selecionada em destaque sobre um mapa;
  - (No mínimo) Avaliação média e duração em uma aba fora do mapa;
  - 80% dos testadores sabendo reconhecer o que são todos os elementos da visualização.
- **US03.2**
	- 100% das rotas disponiveis que se adequam ao(s) filtro(s) selecionados aparecendo, inclusive quando há mais de um e quando há seleção de _tags_, se existir alguma rota que se enquadre no(s) filtro(s);
	- uma mensagem de aviso dizendo que nenhuma rota foi encontrada se não existir nenhuma rota que se enquadre no(s) filtro(s);
  - pelo menos 3 _tags_ de rotas adicionadas.
- **US03.3**
	- 100% das avaliações de uma rota selecionada aparecendo;
  - ao menos 2 filtros de visualização de avaliações implementados;
  - 100% dos filtros e suas combinações funcionando da maneira esperada, não omitindo nenhum dado.

A título de documentação, as frases criadas com base no método GWT foram:
- **US01.1** - Dado que sou administrador, quando eu cadastrar um novo usuário na plataforma, então o cadastro deve ocorrer com sucesso.
- **US01.2** – Dado que sou administrador, quando eu quiser visualizar a lista de usuários cadastrados, então todos devem aparecer na visualização.
- **US01.3** – Dado que sou administrador, quando eu editar um dado de um usuário, então a edição deve ser imediata e definitiva, não importanto o tipo de dado que eu alterei. 
- **US01.4** – Dado que sou administrador, quando eu excluir um usuário, então nenhum dado seu deve permanecer no banco de dados.
- **US01.5** – Quando eu realizar login com minhas credenciais, então consigo acessar todas as funcionalidades que um usuário autenticado consegue.
- **US01.6** – Dado que sou visitante, quando eu acessar a plataforma sem realizar login, então consigo visualizar todas as rotas e pontos de interesse disponíveis.
- **US02.1** – Dado que sou administrador, quando eu cadastrar, editar ou excluir rotas e pontos de interesse da plataforma, então essas ações devem ser refletidas integralmente no banco de dados. 
- **US02.2** – Dado que sou usuário autenticado, quando adiciono rotas ou pontos de interesse, então eles devem ficar salvos no sistema com tudo o que eu informei. 
- **US02.3** – Dado que sou usuário autenticado, quando avalio uma rota, então minha avaliação (estrelas e comentário) devem ser salvos e aparecer associados à rota e a mim na plataforma.
- **US02.4** – Dado que sou usuário autenticado, quando recomendo rotas para outras pessoas, então a recomendação deve chegar ao destinatário e para ele ser de fácil acesso.
- **US03.1** – Quando eu visualizo uma rota, então ela deve estar em um mapa, com origem, destino e jornada facilmente reconhecíveis, trajeto sinalizado e pontos de interesse destacados, além de ter informações secundárias, como avaliação média e duração, reunidas em local de menor destaque.
- **US03.2** – Quando eu aplico um filtro para visualizar apenas rotas que possuam certa(s) característica(s), então quero ver todas as rotas disponíveis na plataforma que se enquadram no meu filtro, sem exceções.
- **US03.3** – Quando seleciono as avaliações de uma rota, então quero ver sua avaliação média e as avaliações individuais de todas as pessoas que já avaliaram essa rota, podendo inclusive escolher filtros de visualizações delas. 

# Definition of Done (DoD) das _user stories_ (US)
Uma _user story_ do projeto está pronta quando
1. ao menos um membro da equipe responsável pela US abre um PR sinalizando que a funcionalidade está pronta para revisão;
2. o código passou por revisão de ao menos um (outro) membro da equipe, com sugestões ou correções aplicadas quando necessário;
3. nenhum bug crítico for encontrado;
4. a implementação da funcionalidade atender ao(s) critério(s) de aceitação da US;
5. a PO validar o que foi feito e confirmar que atende ao esperado; e
6. o PR é aprovado e finalizado por um gerente ou membro responsável pela integração do código.

# Rastreabilidade
Os requisitos e suas respectivas _user stories_ serão rastreados com uma matriz de rastreabilidade, criada e mantida no Notion do projeto. Quaisquer outras informações pertinentes serão documentadas lá.
