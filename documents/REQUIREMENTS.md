# Elicitação de requisitos
A elicitação de requisitos começou desde a primeira idealização do projeto em março, quando fizemos uma sessão de _brainstorming_ de ideias e definimos o MVP do projeto. Para validarmos nossas ideias, realizamos entrevistas com três estudantes da Unicamp. O roteiro de entrevistas e as respostas transcritas estão [aqui](https://docs.google.com/document/d/1jlGIR3KYCl7HlIZ5O9nZma3UJ8xCyHSlMV7LgNYG6Cw/edit?usp=sharing). Uma prototipação será feita e validada com pessoas do nosso público-alvo, inclusive pessoas entrevistadas, para novamente validarmos nossas ideias e termos uma ideia de como o sistema será de verdade. Um _link_ para a prototipação será adicionado neste arquivo futuramente. 

# Documento de requisitos
O documento de requisitos do projeto pode ser acessado [aqui](REQUIREMENTSDOC.md). Quaisquer adições a esse documento serão registradas neste arquivo `REQUIREMENTS.md`.

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
| 05             | US02.2       | Como usuário ~~autenticado~~<sup>1</sup>, desejo adicionar rotas ou pontos de interesse para contribuir com o sistema. |
| 03             | US02.3       | Como usuário autenticado, desejo avaliar uma rota com estrelas e um comentário para ajudar outros usuários. |
| 03             | US02.4       | Como usuário autenticado, desejo recomendar rotas para outras pessoas por meio de um link ou sugestão no sistema para aumentar o conhecimento de rotas que acho interessante. |

### EP03 - Visualizações no sistema
**Descrição**: Visualização e classificação de rotas e pontos de interesse.

| _Story Points_ | _User Story_ | Descrição                                                                 |
|:--------------:|:------------:|---------------------------------------------------------------------------|
| 10             | US03.1       | Como usuário, desejo visualizar rotas no mapa com detalhes como origem, destino, pontos de interesse e duração. |
| 02             | US03.2       | Como usuário, desejo aplicar filtros nas rotas usando _tags_ para facilitar minhas buscas. |
| 04             | US03.3       | Como usuário, desejo ver avaliações e comentários de outros usuários sobre uma rota para considerar o que os outros dizem dela antes de usá-la. |
| 03             | US03.4       | Como usuário autenticado, desejo ver meu histórico de rotas recém visualizadas para eu facilmente retornar ao que eu estava fazendo anteriormente plataforma. |

# Critérios de aceitação

Os critérios de aceitação dos épicos e _user stories_ foram feitos com base no método GWT (_given when then_, ou _dado quando então_) e estão a seguir:

### EP01 - Gerenciamento de acesso e de usuários
**Descrição**: Controle de permissões, autenticação e gestão de usuários da plataforma.
- **US01.1** – Como administrador, desejo cadastrar um novo usuário para que ele tenha acesso à plataforma.<sup>6</sup>
 	- Página de cadastro existente e acessível apenas a administradores.
  	- Campos obrigatórios para cadastro são validados antes do cadastro ser concluído (campos não vazios, e-mail válido e nome com caracteres do alfabeto latino).
  	- Dados válidos submetidos fazem o sistema gravar o novo usuário no banco de dados de forma persistente, i.e., o novo usuário aparece na lista dada pela US01.2.
  	- Uma mensagem "Usuário <nome> cadastrado com sucesso!" aparece na tela.
- **US01.2** – Como administrador, desejo visualizar a lista de usuários cadastrados para acompanhar quem usa o sistema.<sup>6</sup>
 	- Lista deve exibir, pelo menos, nome, e-mail e data de criação dos usuários.
  	- Usuários devem aparecer em tabelas paginadas, tendo 25 usuários por página no máximo.
  	- Apenas administradores podem acessar essa visualização.
- **US01.3** – Como administrador, desejo editar os dados de um usuário para manter o sistema atualizado.<sup>6</sup>
 	- Botão de edição ao lado de cada usuário na lista dada pela US01.2.
  	- Dados novos são validados antes da edição ser concluída (vide US01.1).
  	- Dados válidos submetidos fazem o sistema exibir uma mensagem "Dados atualizados com sucesso!" na tela e gravar os novos dados do usuário no banco de dados de forma persistente, i.e., os novos dados aparecem na lista dada pela US01.2.
  	- Dados inválidos submetidos não alteram nada e exibem uma mensagem de erro específico de acordo com o que está inválido.
- **US01.4** – Como administrador, desejo excluir usuários da plataforma quando necessário para ter melhor controle sobre testes e uso do sistema.<sup>6</sup>
 	- Botão de deleção ao lado de cada usuário na lista dada pela US01.2.
  	- Um clique no botão de deleção abre um _pop-up_ de alerta/confirmação.
  	- Deleção de usuário faz o sistema exibir uma mensagem "Usuário excluído com sucesso!" na tela e remove todos os dados do usuário do banco de dados de forma persistente, i.e., o usuário não aparece mais na lista dada pela US01.2.
- **US01.5** – Como usuário, desejo realizar login com minhas credenciais para acessar funcionalidades personalizadas.
 	- Página de login existente, acessível a todos e com campos de e-mail e senha.
  	- Campos vazios ou credenciais incorretas exibem aviso "Usuário ou senha inválidos" na tela.
  	- Campos preenchidos e corretos redirecionam o usuário para a página principal da plataforma com sessão autenticada.
  	- Opção de _logout_ desliga a sessão e redireciona o usuário para a tela inicial da plataforma.
- **US01.6** – Como visitante, desejo visualizar rotas e pontos de interesse sem estar logado para rapidamente ter acesso às informações mais pertinentes da plataforma.<sup>4</sup>
	- Visitantes não precisam de sessão autenticada para acessar rotas e pontos de interesse.
 	- Páginas de rotas e pontos de interesse exibem informações, mas impedem a edição, a avaliação e a recomendação, ações que, quando tentadas, fazem o sistema exibir um aviso "Faça login para (ação)".

### EP02 - Interações usuários-sistema
**Descrição**: Contribuições do usuário com o conteúdo da plataforma.
- **US02.1** – Como administrador, desejo cadastrar, editar ou excluir rotas e pontos de interesse para manter o conteúdo da plataforma atualizado.<sup>6</sup>
	- Painel de rotas e pontos de interesse existente e acessível apenas por administradores.
 	- Rotas e pontos de interesse possuem botões de criação, edição e deleção.
  	- Campos obrigatórios (nome, descrição, coordenadas geográficas etc.) validados (campos não vazios e tipo de dado).
  	- Todas as alterações são refletidas no banco de dados, no painel e na plataforma para usuários não-administradores.
  	- Mensagens de sucesso ou erro associadas a cada operação (criação, edição, deleção). 
- **US02.2** – Como usuário autenticado, desejo adicionar rotas ou pontos de interesse para contribuir com o sistema.
	- Formulário de adição ~~e aba "Minhas Contribuições" ambos disponíveis apenas para usuários logados~~<sup>1</sup>.
 	- Formulário contém, pelo menos, campos de nome, descrição, localização (selecionável do mapa) e tags (opcionais), todos validados para campos não vazios.
  	- Submissão com dados válidos exibe mensagem "(nome) agora está na plataforma!" ~~e adiciona a contribuição do usuário à aba "Minhas Contribuições".~~<sup>1</sup>
- **US02.3** – Como usuário autenticado, desejo avaliar uma rota ~~com estrelas e um comentário~~<sup>5</sup> para ajudar outros usuários.
  	- Pop-up de avaliação disponível com ~~estrelas, de 1 a 5, e um campo de comentário~~ um sistema de _upvotes_ e _downvotes_<sup>5</sup>.
  	- ~~Validação de um mínimo de 1 estrela e comentário não vazio.~~ <sup>5</sup>
   	- Avaliação submetida ~~com dados válidos faz com que o sistema exiba uma mensagem "Avaliação submetida!", atualize~~ atualiza imediatamente ~~a média de estrelas~~ o número de upvotes/downvotes do que foi avaliado e ~~vincule~~ vincula a avaliação ao que foi avaliado e ao usuário avaliador no banco de dados.<sup>5</sup>
- **US02.4** – Como usuário autenticado, desejo recomendar rotas para outras pessoas por meio de um link ou sugestão no sistema para aumentar o conhecimento de rotas que acho interessante.<sup>7</sup>
	- Botão de recomendação associado a rotas e pontos de interesse abre _pop-up_ de envio.
 	- _Pop-up_ de envio permite escolher dentre lista de amigos um destinatário.
  	- Envio de recomendação exibe mensagem "Você recomendou (nome_da_rota_ou_ponto) para (pessoa)!". 
  	- Envio de recomendação faz aparecer uma notificação para o destinatário, quando logado, com link para o que foi recomendado.

### EP03 - Visualizações no sistema
**Descrição**: Visualização e classificação de rotas e pontos de interesse.
- **US03.1** – Como usuário, desejo visualizar rotas no mapa com detalhes como origem, destino, pontos de interesse e duração.
	- Origem, destino, pontos de interesse e trajeto de qualquer rota selecionada em destaque sobre um mapa.
 	- ~~Pontos de interesse destacados na rota com ícones clicáveis que exibem seus detalhes quando clicados.~~<sup>2</sup>
  	- Pelo menos ~~avaliação média,~~<sup>3</sup> distância e duração em uma aba fora do mapa.
- **US03.2** – Como usuário, desejo aplicar filtros nas rotas usando _tags_ para facilitar minhas buscas.
	- Todas as rotas disponiveis que se adequam ao(s) filtro(s) selecionados aparecem como resultado, inclusive quando há mais de um e quando há seleção de _tags_, se existir alguma rota que se enquadre no(s) filtro(s), ou uma mensagem de aviso dizendo que nenhuma rota foi encontrada se não existir nenhuma rota que se enquadre no(s) filtro(s).
 	- Lista de rotas atualiza sem a necessidade de recarregar a página quando algo for marcado ou desmarcado.
  	- Pelo menos 3 _tags_ de rotas adicionadas.
- **US03.3** – Como usuário, desejo ver avaliações e comentários de outros usuários sobre uma rota para considerar o que os outros dizem dela antes de usá-la.<sup>5</sup>
	- Todas as avaliações de uma rota selecionada aparecem em uma lista de avaliações, que contêm usuário avaliador, estrelas, data e comentário.
  	- Ao menos 2 filtros de visualização de avaliações implementados (por número de estrelas e por data).
- **US03.4** – Como usuário autenticado, desejo ver meu histórico de rotas recém visualizadas para eu facilmente retornar ao que eu estava fazendo anteriormente plataforma.
	- Último acesso de cada rota por um usuário gravado.
 	- Histórico de rotas exibido em ordem crescente de tempo desde o último acesso, i.e., rotas visualizadas mais recentemente vêm primeiro.
  	- Cada rota no histórico mostra uma mensagem "visto em (data), (hora)".
  	- Histórico exibe 20 últimos registros, com um link "Ver mais" que leva a uma página com o histórico completo se houver mais que 20 registros ou uma mensagem "Nenhuma rota visualizada recentemente" se não houver nenhuma rota no histórico. 

A título de documentação, as frases criadas com base no método GWT foram:
- **US01.1** – Dado que sou administrador, quando eu cadastrar um novo usuário na plataforma, então o cadastro deve ocorrer com sucesso.
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
- **US03.4** – Dado que sou usuário autenticado, quando visualizo meu histórico de rotas recém visualizadas, então quero ver todas as rotas que eu visitei por último em ordem crescente de tempo desde minha última visualização e com o registro temporal de quando isso aconteceu.

# Definition of Done (DoD) das _user stories_ (US)
Uma _user story_ do projeto está pronta quando
1. ao menos um membro da equipe responsável pela US abre um PR sinalizando que a funcionalidade está pronta para revisão;
2. o código passar por revisão de ao menos um (outro) membro da equipe, com sugestões ou correções aplicadas quando necessário;
3. nenhum bug crítico for encontrado;
4. a implementação da funcionalidade atender ao(s) critério(s) de aceitação da US;
5. a PO validar o que foi feito e confirmar que atende ao esperado; e
6. o PR é aprovado e finalizado por um gerente ou membro responsável pela integração do código.

# Rastreabilidade
Os requisitos e suas respectivas _user stories_ serão rastreados com uma matriz de rastreabilidade, criada e mantida no Notion do projeto. Quaisquer outras informações pertinentes serão documentadas lá.

# Histórico de alterações
<sup>1</sup> 15/05 - Não requer mais autenticação.

<sup>2</sup> 22/05 - Fora do escopo do MVP.

<sup>3</sup> 22/05 - Com base na escolha de prioridades das user stories, a US de avaliações virá depois, então a avaliação como informação será adicionada depois.

<sup>4</sup> 22/05 - Dada a alteração do dia 15/05 (não requer mais autenticação), a user story terá os critérios de aceitação relaxados para apenas "Páginas de rotas e pontos de interesse exibem informações."

<sup>5</sup> 30/05 - Sistema de avaliação com 5 estrelas substituído por sistema com upvotes/downvotes. Anteriormente, uma avaliação implicitamente requeria um comentário do usuário avaliador para explicar o número de estrelas dado; agora, isso não é mais necessário, agilizando a sequência de ações na UX. Com isso, a US03.3 se tornou consequência direta da US02.3. Comentários de avaliações não farão mais parte do MVP.

<sup>6</sup> 30/05 - A implementação do backend em Python/Django já contempla a existência de um administrador pelo próprio Django com permissões de acesso ao banco de dados, atendendo às _user stories_ US01.1, US01.2, US01.3, US01.4 (CRUD de usuários pelo administrador) e US02.1 (CRUD de rotas pelo administrador).

<sup>7</sup> 21/06 - Recomendação de rotas agora é por meio de um botão que copia a URL da rota, tornando a ação mais fácil, direta e reconhecível. Com isso, os critérios de aceitação 2, 3 e 4 não são mais válidos.
