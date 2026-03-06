# Order API

API REST desenvolvida em **Node.js** com **JavaScript**, **Express**, **PostgreSQL**, **JWT** e **Swagger** para gerenciamento de pedidos.

Este projeto foi construído para atender aos requisitos de um desafio técnico que solicita uma API capaz de:

- criar pedidos
- buscar um pedido pelo número informado na URL
- listar todos os pedidos
- atualizar pedidos
- deletar pedidos
- persistir os dados em banco de dados
- transformar os campos recebidos no body antes de salvar
- tratar erros corretamente
- retornar respostas HTTP adequadas
- implementar autenticação com JWT
- documentar a API com Swagger

---

# Sumário

- [Visão geral](#visão-geral)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Arquitetura do projeto](#arquitetura-do-projeto)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Requisitos](#requisitos)
- [Como criar o projeto do zero](#como-criar-o-projeto-do-zero)
- [Como iniciar o repositório Git](#como-iniciar-o-repositório-git)
- [Instalação das dependências](#instalação-das-dependências)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Configuração do banco de dados](#configuração-do-banco-de-dados)
- [Modelagem do banco](#modelagem-do-banco)
- [Mapeamento dos campos](#mapeamento-dos-campos)
- [Como executar o projeto](#como-executar-o-projeto)
- [Autenticação](#autenticação)
- [Documentação Swagger](#documentação-swagger)
- [Endpoints da API](#endpoints-da-api)
- [Exemplos de uso com curl](#exemplos-de-uso-com-curl)
- [Testando no Postman](#testando-no-postman)
- [Regras e validações implementadas](#regras-e-validações-implementadas)
- [Tratamento de erros](#tratamento-de-erros)
- [Respostas HTTP utilizadas](#respostas-http-utilizadas)
- [Fluxo interno da aplicação](#fluxo-interno-da-aplicação)
- [Sugestão de commits](#sugestão-de-commits)
- [Como subir para o GitHub](#como-subir-para-o-github)
- [Melhorias futuras](#melhorias-futuras)

---

# Visão geral

A **Order API** é uma API REST para gerenciamento de pedidos.

Ela recebe um JSON com os dados do pedido no formato exigido pelo desafio, transforma esses dados para um formato interno padronizado e salva no banco PostgreSQL.

Além disso, a aplicação conta com:

- autenticação via JWT
- documentação interativa com Swagger
- arquitetura em camadas
- tratamento global de erros
- validações de entrada
- transações no banco para garantir consistência dos dados

---

# Tecnologias utilizadas

As principais tecnologias usadas no projeto foram:

- **Node.js**: ambiente de execução JavaScript no servidor
- **Express**: framework para criação da API
- **PostgreSQL**: banco de dados relacional
- **pg**: driver para conexão com PostgreSQL
- **dotenv**: leitura de variáveis de ambiente
- **jsonwebtoken**: geração e validação de token JWT
- **swagger-ui-express**: interface visual do Swagger
- **swagger-jsdoc**: geração da documentação OpenAPI
- **nodemon**: reinício automático do servidor em ambiente de desenvolvimento

---

# Arquitetura do projeto

O projeto foi organizado em camadas para melhorar a separação de responsabilidades.

## Controller
Responsável por:
- receber a requisição HTTP
- extrair dados de `req.body`, `req.params` e `req.headers`
- chamar a camada de service
- devolver a resposta HTTP

## Service
Responsável por:
- aplicar as regras de negócio
- validar dados
- transformar dados recebidos
- controlar transações
- decidir quando lançar erros

## Repository
Responsável por:
- executar queries SQL
- salvar, consultar, atualizar e deletar dados no banco

## Middleware
Responsável por:
- autenticação JWT
- tratamento de erros
- interceptação de rotas inexistentes

## Utils
Responsável por:
- funções auxiliares
- normalização do número do pedido
- mapeamento de campos
- definição de erros customizados

---

# Estrutura de pastas

```text
order-api/
├─ src/
│  ├─ config/
│  │  ├─ db.js
│  │  └─ swagger.js
│  ├─ controllers/
│  │  ├─ auth.controller.js
│  │  └─ order.controller.js
│  ├─ docs/
│  │  └─ openapi.js
│  ├─ middlewares/
│  │  ├─ auth.middleware.js
│  │  ├─ error.middleware.js
│  │  └─ notFound.middleware.js
│  ├─ repositories/
│  │  └─ order.repository.js
│  ├─ routes/
│  │  ├─ auth.routes.js
│  │  └─ order.routes.js
│  ├─ services/
│  │  ├─ auth.service.js
│  │  └─ order.service.js
│  ├─ utils/
│  │  ├─ appError.js
│  │  ├─ mapper.js
│  │  └─ orderId.js
│  ├─ app.js
│  └─ server.js
├─ sql/
│  └─ init.sql
├─ .env
├─ .gitignore
├─ package.json
└─ README.md
```

---

# Requisitos

Antes de executar o projeto, você precisa ter instalado:

- Node.js
- npm
- PostgreSQL
- Git
- Postman ou Insomnia
- VS Code ou outro editor

Para verificar se está tudo instalado corretamente:

```bash
node -v
npm -v
git --version
psql --version
```

---

# Como criar o projeto do zero

## 1. Criar a pasta do projeto

```bash
mkdir order-api
cd order-api
```

## 2. Inicializar o projeto Node.js

```bash
npm init -y
```

Esse comando cria o arquivo `package.json`.

---

# Como iniciar o repositório Git

Para iniciar o versionamento do projeto:

```bash
git init
```

Criar o arquivo `.gitignore`:

```gitignore
node_modules
.env
```

Fazer o primeiro commit:

```bash
git add .
git commit -m "chore: initialize project"
```

---

# Instalação das dependências

## Dependências principais

```bash
npm install express pg dotenv jsonwebtoken swagger-ui-express swagger-jsdoc
```

## Dependência de desenvolvimento

```bash
npm install -D nodemon
```

---

# Configuração do ambiente

Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=orderdb
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1h
```

Ajuste os valores de `DB_USER` e `DB_PASSWORD` conforme a configuração do seu PostgreSQL.

---

# Configuração do banco de dados

## 1. Entrar no PostgreSQL

```bash
psql -U postgres
```

## 2. Criar o banco

```sql
CREATE DATABASE orderdb;
```

## 3. Sair do terminal do PostgreSQL

```sql
\q
```

## 4. Executar o script SQL

```bash
psql -U postgres -d orderdb -f sql/init.sql
```

---

# Modelagem do banco

O projeto usa duas tabelas:

## Tabela `orders`

Armazena os dados principais do pedido:

- `order_id`
- `value`
- `creation_date`

## Tabela `items`

Armazena os itens do pedido:

- `id`
- `order_id`
- `product_id`
- `quantity`
- `price`

## Script SQL

```sql
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(100) PRIMARY KEY,
    value NUMERIC(12, 2) NOT NULL,
    creation_date TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(100) NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    CONSTRAINT fk_order
      FOREIGN KEY(order_id)
      REFERENCES orders(order_id)
      ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_items_order_id ON items(order_id);
```

---

# Mapeamento dos campos

O desafio exige que o JSON recebido seja transformado antes de ser salvo no banco.

## JSON recebido na requisição

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

## JSON transformado internamente

```json
{
  "orderId": "v10089015vdb",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

## Regras do mapeamento

- `numeroPedido` → `orderId`
- `valorTotal` → `value`
- `dataCriacao` → `creationDate`
- `idItem` → `productId`
- `quantidadeItem` → `quantity`
- `valorItem` → `price`
- o sufixo final do número do pedido, como `-01`, é removido antes de salvar

---

# Como executar o projeto

Depois de instalar as dependências, configurar o `.env` e criar o banco, execute:

```bash
npm run dev
```

Se tudo estiver correto, o terminal mostrará algo parecido com:

```bash
Servidor rodando na porta 3000
Swagger disponível em http://localhost:3000/api-docs
```

Para rodar sem nodemon:

```bash
npm start
```

---

# Autenticação

A API possui autenticação com JWT para atender ao requisito opcional do desafio.

Antes de acessar as rotas protegidas, é necessário fazer login.

## Credenciais padrão

```json
{
  "username": "admin",
  "password": "123456"
}
```

## Fluxo de autenticação

1. o cliente envia usuário e senha para `/auth/login`
2. a API valida as credenciais
3. a API devolve um token JWT
4. esse token deve ser enviado no header `Authorization`

Exemplo de header:

```text
Authorization: Bearer SEU_TOKEN
```

---

# Documentação Swagger

A documentação da API fica disponível em:

```text
http://localhost:3000/api-docs
```

Nessa interface você poderá:

- visualizar todas as rotas
- testar chamadas diretamente pelo navegador
- ver exemplos de request e response
- configurar o token JWT para testar rotas protegidas

---

# Endpoints da API

## 1. Login

### `POST /auth/login`

Realiza autenticação e retorna um token JWT.

### Request

```json
{
  "username": "admin",
  "password": "123456"
}
```

### Response

```json
{
  "token": "jwt_gerado_aqui"
}
```

---

## 2. Criar pedido

### `POST /order`

Cria um novo pedido.

### Headers

```text
Content-Type: application/json
Authorization: Bearer SEU_TOKEN
```

### Request

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

### Response esperada

```json
{
  "orderId": "v10089015vdb",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

---

## 3. Buscar pedido por ID

### `GET /order/:orderId`

Busca um pedido pelo identificador informado na URL.

### Exemplo

```text
GET /order/v10089015vdb
```

---

## 4. Listar todos os pedidos

### `GET /order/list`

Retorna todos os pedidos cadastrados.

---

## 5. Atualizar pedido

### `PUT /order/:orderId`

Atualiza um pedido existente com base no ID passado na URL.

### Exemplo

```text
PUT /order/v10089015vdb
```

### Request

```json
{
  "numeroPedido": "v10089015vdb-99",
  "valorTotal": 15000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "9999",
      "quantidadeItem": 2,
      "valorItem": 500
    }
  ]
}
```

Observação: o ID usado para atualização é sempre o da URL.

---

## 6. Deletar pedido

### `DELETE /order/:orderId`

Remove um pedido do banco.

### Exemplo

```text
DELETE /order/v10089015vdb
```

---

# Exemplos de uso com curl

## Login

```bash
curl --location 'http://localhost:3000/auth/login' \
--header 'Content-Type: application/json' \
--data '{
  "username": "admin",
  "password": "123456"
}'
```

## Criar pedido

```bash
curl --location 'http://localhost:3000/order' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer SEU_TOKEN' \
--data '{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}'
```

## Buscar pedido

```bash
curl --location 'http://localhost:3000/order/v10089015vdb' \
--header 'Authorization: Bearer SEU_TOKEN'
```

## Listar pedidos

```bash
curl --location 'http://localhost:3000/order/list' \
--header 'Authorization: Bearer SEU_TOKEN'
```

## Atualizar pedido

```bash
curl --location --request PUT 'http://localhost:3000/order/v10089015vdb' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer SEU_TOKEN' \
--data '{
  "numeroPedido": "v10089015vdb-99",
  "valorTotal": 15000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "9999",
      "quantidadeItem": 2,
      "valorItem": 500
    }
  ]
}'
```

## Deletar pedido

```bash
curl --location --request DELETE 'http://localhost:3000/order/v10089015vdb' \
--header 'Authorization: Bearer SEU_TOKEN'
```

---

# Testando no Postman

## 1. Criar uma coleção
Sugestão de nome:

```text
Order API
```

## 2. Criar a requisição de login
- método: `POST`
- URL: `http://localhost:3000/auth/login`
- body: raw JSON

## 3. Enviar a requisição e copiar o token

## 4. Configurar o token nas rotas protegidas
Em cada rota protegida, adicione o header:

```text
Authorization: Bearer SEU_TOKEN
```

## 5. Criar as demais requisições
- `POST /order`
- `GET /order/list`
- `GET /order/:orderId`
- `PUT /order/:orderId`
- `DELETE /order/:orderId`

---

# Regras e validações implementadas

A aplicação possui as seguintes validações:

- o body da requisição é obrigatório
- `numeroPedido` é obrigatório
- `valorTotal` é obrigatório
- `dataCriacao` é obrigatória
- `items` deve ser um array com pelo menos um item
- cada item deve conter `idItem`, `quantidadeItem` e `valorItem`
- `valorTotal` deve ser numérico
- `dataCriacao` deve ser uma data válida
- não é permitido criar pedido duplicado
- não é permitido atualizar ou deletar pedido inexistente
- não é permitido acessar rotas protegidas sem token

---

# Tratamento de erros

A aplicação possui tratamento global de erros com middleware.

Erros conhecidos retornam mensagens claras para facilitar uso e depuração.

Exemplos:

## Body inválido
```json
{
  "message": "Body da requisição é obrigatório"
}
```

## Campo obrigatório ausente
```json
{
  "message": "numeroPedido é obrigatório"
}
```

## Token não informado
```json
{
  "message": "Token não informado"
}
```

## Pedido não encontrado
```json
{
  "message": "Pedido não encontrado"
}
```

## Pedido duplicado
```json
{
  "message": "Pedido já existe"
}
```

---

# Respostas HTTP utilizadas

A API utiliza os seguintes status codes:

- `200 OK` → consultas, login e atualização bem-sucedidos
- `201 Created` → criação de pedido
- `204 No Content` → exclusão bem-sucedida
- `400 Bad Request` → requisição inválida
- `401 Unauthorized` → autenticação inválida ou ausente
- `404 Not Found` → recurso não encontrado
- `409 Conflict` → tentativa de criar recurso duplicado
- `500 Internal Server Error` → erro inesperado

---

# Fluxo interno da aplicação

## Criação de pedido

1. a requisição chega na rota `POST /order`
2. o middleware JWT valida o token
3. o controller recebe o body
4. o service valida os dados
5. o mapper transforma os campos
6. o repository salva pedido e itens no banco usando transação
7. a API devolve o pedido salvo já transformado

## Consulta de pedido

1. a requisição chega na rota `GET /order/:orderId`
2. o middleware JWT valida o token
3. o service normaliza o ID
4. o repository busca os dados no banco
5. a API devolve o pedido com seus itens

---



# Como subir para o GitHub

## 1. Criar um repositório no GitHub
Sugestão de nome:

```text
order-api
```

## 2. Conectar o projeto local ao remoto

```bash
git remote add origin https://github.com/SEU_USUARIO/order-api.git
```

## 3. Definir branch principal

```bash
git branch -M main
```

## 4. Enviar para o GitHub

```bash
git push -u origin main
```

---

# Melhorias futuras

Algumas melhorias que podem ser feitas em versões futuras:

- adicionar testes automatizados
- usar Docker para facilitar execução do ambiente
- separar autenticação em banco de dados
- adicionar paginação na listagem de pedidos
- adicionar logs estruturados
- adicionar validação com biblioteca específica, como Joi ou Zod
- criar pipeline CI/CD
- implementar refresh token
- adicionar observabilidade e métricas

---

Projeto pronto para servir como base de estudo, entrega acadêmica e evolução para um cenário mais profissional.
