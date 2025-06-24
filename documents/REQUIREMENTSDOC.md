# UniMaps - Documento de requisitos

## 1. Introdução
### 1.1. Objetivo
Este documento tem como objetivo especificar todas as regras de negócio do sistema de software UniMaps, com ênfase em requisitos funcionais e não funcionais. Os requisitos levantados por nós são fundamentais para que UniMaps atinja seus objetivos originais e consiga ser escalável para permitir melhorias contínuas a partir de seu produto mínimo viável. O documento e seus conteúdos serão usados como referência pela equipe do projeto e pelo time docente da disciplina MC426/MC656.

### 1.2. Escopo
O nome do software desenvolvido é UniMaps. Seu objetivo é promover a mobilidade ativa no campus Campinas da Universidade Estadual de Campinas (Unicamp) aos que frequentam esse espaço, em especial seus estudantes. Para isso, seu escopo inicial (produto mínimo viável, ou minimum viable product - MVP) envolve a disponibilização de rotas base entre locais do campus, todas seguindo caminhos mais rápidos entre eles e possuindo pontos de interesse, como bebedouros e banheiros funcionais. Após isso, será possível adicionar funcionalidades acessórias que melhorem a experiência do usuário a partir do que já for implementado.

Com o software, deseja-se ajudar o frequentador do campus, em especial o estudante calouro, a navegar o extenso espaço da universidade com opções, permitindo que se localize com facilidade e que possa usufruir das utilidades do campus enquanto se locomove nele de forma ativa.

### 1.3. Definições, acrônimos e abreviações
- **CRUD**: Acrônimo para Create (Criar), Read (Ler), Update (Atualizar) e Delete (Excluir), as operações básicas para manipulação de dados em sistemas. 
- **Ponto de interesse**: Local no mapa com certa característica pertinente, interessante ou chamativa.
- **Administrador**: Pessoa com poderes moderadores que pode acessar, alterar, incluir e excluir dados de rotas e pontos de interesse diretamente no sistema.
- **Usuário**: Pessoa que acessa o sistema, podendo ser um administrador, um usuário autenticado (que possui cadastro e realizou login) ou um visitante.

### 1.4. Visão geral
O restante do documento contém a especificação dos requisitos e será feita em duas frentes: requisitos funcionais (RF) e não funcionais (RNF). Associado a cada requisito estará sua descrição e sua classificação (obrigatório, desejável, opcional). Os itens a seguir foram estruturados seguindo o modelo de especificação de requisitos apresentado pela professora Cecília M. F. Rubira — vide referência ao fim do documento.

## 2. Descrição Geral
### 2.1. Requisitos funcionais
- RF01 - Níveis de Acesso
    - Descrição: O sistema deve estabelecer níveis de acesso a suas funcionalidades com base nos níveis de acesso: administrador, usuário autenticado, visitante.
    - Classificação: Obrigatório.

- RF02 - Acesso Total ao Administrador
    - Descrição: O sistema deve permitir que o administrador tenha acesso a todas as funcionalidades de usuários.
    - Classificação: Obrigatório.

- RF03 - CRUD de Usuários
    - Descrição: A plataforma deve permitir que o administrador cadastre, leia, edite e exclua usuários da plataforma.
    - Classificação: Obrigatório.

- RF04 - CRUD de rotas e pontos de interesse
    - Descrição: O sistema deve permitir que o administrador cadastre, leia, edite e exclua rotas e pontos de interesse.
    - Classificação: Obrigatório. 

- RF05 - Login e autenticação de usuário
    - Descrição: O sistema deve permitir que usuários realizem login com credenciais únicas para acessar recursos personalizados e funcionalidades de interação.
    - Classificação: Obrigatório.

- RF06 - Restrição a pessoas visitantes
    - Descrição: O sistema deve permitir a visitantes apenas a visualização de rotas e suas informações, impedindo a criação/inserção de quaisquer dados, incluindo avaliações, rotas e pontos de interesse.
    - Classificação: Obrigatório.

- RF07 - Rotas com pontos de interesse
    - Descrição: O sistema deve conter rotas entre dois locais do campus com pontos de interesse entre eles, de modo que todas essas informações sejam acessíveis ao usuário.
    - Classificação: Obrigatório.

- RF08 - Interações por feedbacks
    - Descrição: O sistema deve permitir a inserção de avaliações do usuário a rotas armazenadas dadas no formato de 5 estrelas mais um texto explicativo.
    - Classificação: Obrigatório.

- RF09 - Visualização em mapa
    - Descrição: O sistema deve apresentar as informações pertinentes — origem, destino, pontos de interesse, duração, avaliação, classificação etc. — de uma rota junto a um mapa que visualmente mostre os dados de localização.
    - Classificação: Obrigatório.

- RF10 - Classificação e filtros de rotas e pontos de interesse
    - Descrição: O sistema deve armazenar classificações de rotas e pontos de interesse com base em suas características (origem, destino, duração) e por meio de tags (e.g. “curta”, “sombra”, “cênica” etc.), permitindo uso de filtros dessas classificações em buscas conforme presença ou ausência de tags.
    - Classificação: Desejável.

- RF11 - Adição de rotas e pontos de interesse pelo usuário
    - Descrição: O sistema deve permitir adições de rotas e pontos de interesse por usuários autenticados.
    - Classificação: Desejável.

- RF12 - Interações entre usuários
    - Descrição: O sistema deve permitir que usuários autenticados recomendem rotas previamente cadastradas para outros usuários autenticados por meio de um link compartilhável ou sugestão direta.
    - Classificação: Desejável.
    - Comentário: Futuramente, esse requisito poderá ser estendido para suportar outras formas de interação entre usuários.

- RF13 - Histórico de navegação do usuário
    - Descrição: O sistema deve armazenar rotas recém consultadas pelo usuário autenticado em uma aba de histórico.
    - Classificação: Desejável.

### 2.2. Requisitos não funcionais
- RNF01 - Administrador único
    - Descrição: O sistema deve restringir o administrador a uma única sessão ativa por vez, impedindo múltiplos logins simultâneos com a mesma conta.
    - Classificação: Obrigatório. 

- RNF02 - Tempo de resposta
    - Descrição: O sistema deve responder às solicitações do usuário em até 5 segundos.
    - Classificação: Obrigatório.

- RNF03 – Interface amigável
    - Descrição: A interface do sistema deve ser intuitiva e acessível ao seguir as 10 heurísticas de usabilidade de Nielsen, priorizando consistência, prevenção de erros e controle pelo usuário, e será validada por meio de testes com usuários, exigindo uma taxa mínima de sucesso de 80% nas tarefas críticas.
    - Classificação: Obrigatório.

- RNF04 - Responsividade em dispositivos móveis
    - Descrição: O sistema deve apresentar responsividade funcional e visual em dispositivos móveis.
    - Classificação: Desejável.

### 2.3. Restrições
- O backend do projeto será em Python (Django).
- O frontend do projeto será em Javascript (React).
- O banco de dados do projeto será PostgreSQL.

### Matriz de Rastreabilidade
Uma matriz de rastreabilidade dee requisitos foi criada para facilitar no monitoramento dos requisitos ao longo do projeto e na criação das _user stories_. Ela pode ser encontrada [aqui](rtm.png).

## Referências
RUBIRA, Cecília M. F. **Modelo de Instruções para Documentos de Requisitos**. [S.l.]: UNESP, [s.d.]. Disponível em: https://moodle.unesp.br/pluginfile.php/25063/mod_resource/content/1/ModeloinstrucoesDocReq.pdf. Acesso em: 20 abr. 2025.
