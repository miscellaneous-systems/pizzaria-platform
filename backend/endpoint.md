# 📡 Documentação Completa de Endpoints - Sistema de Pizzaria

## 📖 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Endpoints de Usuários](#endpoints-de-usuários)
4. [Endpoints de Categorias](#endpoints-de-categorias)
5. [Endpoints de Produtos](#endpoints-de-produtos)
6. [Endpoints de Pedidos](#endpoints-de-pedidos)
7. [Endpoints de Itens](#endpoints-de-itens)
8. [Códigos de Status HTTP](#códigos-de-status-http)
9. [Tratamento de Erros](#tratamento-de-erros)

---

## 🎯 Visão Geral

Esta API REST foi desenvolvida para gerenciar operações de uma pizzaria, incluindo gerenciamento de usuários, categorias, produtos, pedidos e itens.

**Base URL**: `http://localhost:3333`

**Formato de dados**: JSON

**Autenticação**: JWT (JSON Web Token)

---

## 🔐 Autenticação

A maioria dos endpoints requer autenticação via token JWT.

**Header de Autenticação**:

```
Authorization: Bearer <seu_token_jwt>
```

O token é obtido através do endpoint `/session` após login bem-sucedido.

---

## 👤 Endpoints de Usuários

### 1. Criar Usuário

Cria um novo usuário no sistema.

**Endpoint**: `POST /users`

**Autenticação**: Não requerida

**Middlewares**: `validateSchema(createUserSchema)`

**Body**:

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Validações**:

- `name`: String, mínimo 3 caracteres (obrigatório)
- `email`: Email válido (obrigatório)
- `password`: String, mínimo 6 caracteres (obrigatório)

**Resposta de Sucesso** (200):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

**Possíveis Erros**:

- `400`: Erro de validação (nome, email ou senha inválidos)
- `400`: "Usuário já existente!" (email já cadastrado)

**Observações**:

- A senha é criptografada com bcrypt (salt: 8)
- Role padrão é `STAFF`
- A senha não é retornada na resposta

---

### 2. Autenticar Usuário (Login)

Autentica um usuário e retorna um token JWT.

**Endpoint**: `POST /session`

**Autenticação**: Não requerida

**Middlewares**: `validateSchema(authUserSchema)`

**Body**:

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Validações**:

- `email`: Email válido (obrigatório)
- `password`: String (obrigatório)

**Resposta de Sucesso** (200):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE2MzQwMjk4MDAsImV4cCI6MTYzNDAzMzQwMH0..."
}
```

**Possíveis Erros**:

- `400`: Erro de validação
- `400`: "Email/Password incorrect" (credenciais inválidas)

**Observações**:

- O token JWT contém o `user_id` no campo `sub`
- O token deve ser usado para autenticar requisições subsequentes

---

### 3. Obter Detalhes do Usuário Autenticado

Retorna informações do usuário atualmente autenticado.

**Endpoint**: `GET /me`

**Autenticação**: Requerida

**Middlewares**: `isAuthenticated`

**Headers**:

```
Authorization: Bearer <token>
```

**Resposta de Sucesso** (200):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF"
}
```

**Possíveis Erros**:

- `401`: Token não fornecido ou inválido

---

## 📂 Endpoints de Categorias

### 4. Criar Categoria

Cria uma nova categoria de produtos.

**Endpoint**: `POST /category`

**Autenticação**: Requerida (ADMIN)

**Middlewares**: `isAuthenticated`, `isAdmin`, `validateSchema(createCategorySchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Body**:

```json
{
  "name": "Pizzas Doces"
}
```

**Validações**:

- `name`: String, mínimo 2 caracteres (obrigatório)

**Resposta de Sucesso** (201):

```json
{
  "id": "650e8400-e29b-41d4-a716-446655440001",
  "name": "Pizzas Doces",
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

**Possíveis Erros**:

- `400`: Erro de validação
- `401`: Token inválido ou usuário sem permissão de ADMIN

**Observações**:

- Apenas usuários com role `ADMIN` podem criar categorias

---

### 5. Listar Categorias

Lista todas as categorias cadastradas.

**Endpoint**: `GET /category`

**Autenticação**: Requerida

**Middlewares**: `isAuthenticated`

**Headers**:

```
Authorization: Bearer <token>
```

**Resposta de Sucesso** (200):

```json
[
  {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "name": "Pizzas Salgadas",
    "createdAt": "2025-11-10T10:30:00.000Z",
    "updatedAt": "2025-11-10T10:30:00.000Z"
  },
  {
    "id": "650e8400-e29b-41d4-a716-446655440002",
    "name": "Pizzas Doces",
    "createdAt": "2025-11-11T15:20:00.000Z",
    "updatedAt": "2025-11-11T15:20:00.000Z"
  }
]
```

**Possíveis Erros**:

- `401`: Token não fornecido ou inválido

**Observações**:

- Categorias são ordenadas por data de criação (mais recentes primeiro)
- Retorna array vazio se não houver categorias cadastradas

---

## 🍕 Endpoints de Produtos

### 6. Criar Produto

Cria um novo produto com upload de imagem.

**Endpoint**: `POST /product`

**Autenticação**: Requerida (ADMIN)

**Middlewares**: `isAuthenticated`, `isAdmin`, `multer.single('file')`, `validateSchema(createProductSchema)`

**Headers**:

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body** (multipart/form-data):

```
name: "Pizza Margherita"
price: "3500"
description: "Pizza tradicional com molho de tomate, mussarela e manjericão"
category_id: "650e8400-e29b-41d4-a716-446655440001"
file: [arquivo de imagem]
```

**Validações**:

- `name`: String (obrigatório)
- `price`: String contendo apenas números (obrigatório)
- `description`: String (obrigatório)
- `category_id`: UUID válido (obrigatório)
- `file`: Arquivo de imagem (obrigatório)
  - Formatos aceitos: JPEG, PNG, JPG
  - Tamanho máximo: 5MB

**Resposta de Sucesso** (200):

```json
{
  "id": "750e8400-e29b-41d4-a716-446655440003",
  "name": "Pizza Margherita",
  "price": 3500,
  "description": "Pizza tradicional com molho de tomate, mussarela e manjericão",
  "banner": "https://res.cloudinary.com/sua-conta/image/upload/v1234567890/products/1234567890-margherita.jpg",
  "disabled": false,
  "category_id": "650e8400-e29b-41d4-a716-446655440001",
  "createdAt": "2025-11-11T16:45:00.000Z",
  "updatedAt": "2025-11-11T16:45:00.000Z"
}
```

**Possíveis Erros**:

- `400`: "Image is required" (arquivo não enviado)
- `400`: "Invalid file type, use jpeg, png or jpg"
- `400`: "Category not found" (categoria não existe)
- `401`: Token inválido ou usuário sem permissão de ADMIN
- `500`: "Error sending image to cloudinary"

**Observações**:

- O preço é enviado como string mas armazenado como número inteiro (centavos)
- A imagem é enviada para o Cloudinary
- Produto é criado com `disabled: false` por padrão

---

### 7. Listar Produtos

Lista todos os produtos cadastrados com filtro por status.

**Endpoint**: `GET /products`

**Autenticação**: Requerida

**Middlewares**: `isAuthenticated`, `validateSchema(listProductSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Parameters**:

- `disabled` (opcional): "true" ou "false"
  - Padrão: "false"
  - Filtra produtos pelo status disabled

**Exemplos de Requisição**:

```
GET /products
GET /products?disabled=false
GET /products?disabled=true
```

**Resposta de Sucesso** (200):

```json
[
  {
    "id": "750e8400-e29b-41d4-a716-446655440003",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Pizza tradicional com molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../margherita.jpg",
    "disabled": false,
    "category_id": "650e8400-e29b-41d4-a716-446655440001",
    "category": {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "name": "Pizzas Salgadas"
    },
    "createdAt": "2025-11-11T16:45:00.000Z",
    "updatedAt": "2025-11-11T16:45:00.000Z"
  },
  {
    "id": "750e8400-e29b-41d4-a716-446655440004",
    "name": "Pizza Calabresa",
    "price": 4000,
    "description": "Pizza com calabresa, cebola e azeitonas",
    "banner": "https://res.cloudinary.com/.../calabresa.jpg",
    "disabled": false,
    "category_id": "650e8400-e29b-41d4-a716-446655440001",
    "category": {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "name": "Pizzas Salgadas"
    },
    "createdAt": "2025-11-11T17:30:00.000Z",
    "updatedAt": "2025-11-11T17:30:00.000Z"
  }
]
```

**Possíveis Erros**:

- `401`: Token não fornecido ou inválido

**Observações**:

- Produtos são ordenados por data de criação (mais recentes primeiro)
- Retorna informações da categoria relacionada
- Preços são retornados em centavos
- Por padrão, lista apenas produtos ativos (disabled=false)

---

### 8. Listar Produtos por Categoria

Lista todos os produtos de uma categoria específica.

**Endpoint**: `GET /category/product`

**Autenticação**: Requerida

**Middlewares**: `isAuthenticated`, `validateSchema(listProductByCategorySchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Parameters**:

- `category_id` (obrigatório): UUID da categoria

**Exemplo de Requisição**:

```
GET /category/product?category_id=650e8400-e29b-41d4-a716-446655440001
```

**Resposta de Sucesso** (200):

```json
[
  {
    "id": "750e8400-e29b-41d4-a716-446655440003",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Pizza tradicional com molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../margherita.jpg",
    "disabled": false,
    "category_id": "650e8400-e29b-41d4-a716-446655440001",
    "createdAt": "2025-11-11T16:45:00.000Z",
    "updatedAt": "2025-11-11T16:45:00.000Z"
  }
]
```

**Possíveis Erros**:

- `400`: "Category ID is required"
- `400`: "Category not found"
- `401`: Token não fornecido ou inválido

**Observações**:

- Retorna apenas produtos ativos (disabled=false)
- Produtos são ordenados por data de criação (mais recentes primeiro)
- Retorna array vazio se a categoria não tiver produtos

---

### 9. Deletar/Desabilitar Produto

Desabilita um produto (soft delete).

**Endpoint**: `DELETE /product`

**Autenticação**: Requerida (ADMIN)

**Middlewares**: `isAuthenticated`, `isAdmin`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Parameters**:

- `product_id` (obrigatório): UUID do produto

**Exemplo de Requisição**:

```
DELETE /product?product_id=750e8400-e29b-41d4-a716-446655440003
```

**Resposta de Sucesso** (200):

```json
{
  "message": "Product deleted successfully"
}
```

**Possíveis Erros**:

- `400`: "Error deleting product" (produto não encontrado)
- `401`: Token inválido ou usuário sem permissão de ADMIN

**Observações**:

- O produto não é removido do banco, apenas marcado como `disabled: true`
- Produtos desabilitados não aparecem nas listagens padrão

---

## 📝 Endpoints de Pedidos

### 10. Criar Pedido

Cria um novo pedido (order).

**Endpoint**: `POST /order`

**Autenticação**: Requerida

**Middlewares**: `isAuthenticated`, `validateSchema(createOrderSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Body**:

```json
{
  "table": 5,
  "name": "João Silva"
}
```

**Validações**:

- `table`: Número inteiro, mínimo 1 (obrigatório)
- `name`: String (opcional)

**Resposta de Sucesso** (200):

```json
{
  "id": "850e8400-e29b-41d4-a716-446655440005",
  "table": 5,
  "name": "João Silva",
  "status": false,
  "draft": true,
  "createdAt": "2025-11-11T18:00:00.000Z"
}
```

**Possíveis Erros**:

- `400`: Erro de validação
- `401`: Token não fornecido ou inválido

**Observações**:

- Pedido é criado com `status: false` (pendente) e `draft: true` (rascunho)
- `status: false` = pedido pendente, `status: true` = pedido finalizado
- `draft: true` = rascunho, `draft: false` = enviado para cozinha

---

### 11. Listar Pedidos

Lista todos os pedidos com filtro por status de rascunho.

**Endpoint**: `GET /orders`

**Autenticação**: Requerida

**Middlewares**: `isAuthenticated`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Parameters**:

- `draft` (opcional): "true" ou "false"
  - Padrão: lista todos os pedidos

**Exemplos de Requisição**:

```
GET /orders
GET /orders?draft=true
GET /orders?draft=false
```

**Resposta de Sucesso** (200):

```json
[
  {
    "id": "850e8400-e29b-41d4-a716-446655440005",
    "table": 5,
    "name": "João Silva",
    "status": false,
    "draft": false,
    "createdAt": "2025-11-11T18:00:00.000Z",
    "items": [
      {
        "id": "950e8400-e29b-41d4-a716-446655440006",
        "amount": 2,
        "product": {
          "id": "750e8400-e29b-41d4-a716-446655440003",
          "name": "Pizza Margherita",
          "price": 3500,
          "description": "Pizza tradicional com molho de tomate, mussarela e manjericão",
          "banner": "https://res.cloudinary.com/.../margherita.jpg"
        }
      }
    ]
  }
]
```

**Possíveis Erros**:

- `401`: Token não fornecido ou inválido

**Observações**:

- Retorna pedidos com seus itens e produtos relacionados
- Útil para listar rascunhos separadamente dos pedidos confirmados

---

### 12. Obter Detalhes do Pedido

Retorna informações detalhadas de um pedido específico.

**Endpoint**: `GET /order/detail`

**Autenticação**: Requerida

**Middlewares**: `isAuthenticated`, `validateSchema(detailOrderSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Parameters**:

- `order_id` (obrigatório): UUID do pedido

**Exemplo de Requisição**:

```
GET /order/detail?order_id=850e8400-e29b-41d4-a716-446655440005
```

**Resposta de Sucesso** (200):

```json
{
  "id": "850e8400-e29b-41d4-a716-446655440005",
  "table": 5,
  "name": "João Silva",
  "status": false,
  "draft": false,
  "createdAt": "2025-11-11T18:00:00.000Z",
  "updatedAt": "2025-11-11T18:30:00.000Z",
  "items": [
    {
      "id": "950e8400-e29b-41d4-a716-446655440006",
      "amount": 2,
      "createdAt": "2025-11-11T18:05:00.000Z",
      "product": {
        "id": "750e8400-e29b-41d4-a716-446655440003",
        "name": "Pizza Margherita",
        "price": 3500,
        "description": "Pizza tradicional com molho de tomate, mussarela e manjericão",
        "banner": "https://res.cloudinary.com/.../margherita.jpg"
      }
    },
    {
      "id": "950e8400-e29b-41d4-a716-446655440007",
      "amount": 1,
      "createdAt": "2025-11-11T18:10:00.000Z",
      "product": {
        "id": "750e8400-e29b-41d4-a716-446655440004",
        "name": "Pizza Calabresa",
        "price": 4000,
        "description": "Pizza com calabresa, cebola e azeitonas",
        "banner": "https://res.cloudinary.com/.../calabresa.jpg"
      }
    }
  ]
}
```

**Possíveis Erros**:

- `400`: "Order ID is required"
- `400`: "Order not found"
- `401`: Token não fornecido ou inválido

**Observações**:

- Retorna o pedido completo com todos os itens e detalhes dos produtos

---

### 13. Enviar Pedido para Cozinha

Envia um pedido rascunho para a cozinha (altera draft de true para false).

**Endpoint**: `PUT /order/send`

**Autenticação**: Requerida

**Middlewares**: `isAuthenticated`, `validateSchema(sendOrderSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Body**:

```json
{
  "order_id": "850e8400-e29b-41d4-a716-446655440005",
  "name": "João Silva"
}
```

**Validações**:

- `order_id`: String (obrigatório)
- `name`: String, mínimo 1 caractere (obrigatório)

**Resposta de Sucesso** (200):

```json
{
  "id": "850e8400-e29b-41d4-a716-446655440005",
  "table": 5,
  "name": "João Silva",
  "draft": false,
  "status": false,
  "createdAt": "2025-11-11T18:00:00.000Z"
}
```

**Possíveis Erros**:

- `400`: Erro de validação
- `400`: "Order not found"
- `401`: Token não fornecido ou inválido

**Observações**:

- Altera `draft` de `true` para `false`
- Atualiza o nome do pedido caso fornecido
- Após enviar, o pedido aparece para a cozinha

---

### 14. Finalizar Pedido

Marca um pedido como finalizado (altera status de false para true).

**Endpoint**: `PUT /order/finish`

**Autenticação**: Requerida

**Middlewares**: `isAuthenticated`, `validateSchema(finishOrderSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Body**:

```json
{
  "order_id": "850e8400-e29b-41d4-a716-446655440005"
}
```

**Validações**:

- `order_id`: String, mínimo 1 caractere (obrigatório)

**Resposta de Sucesso** (200):

```json
{
  "id": "850e8400-e29b-41d4-a716-446655440005",
  "table": 5,
  "name": "João Silva",
  "draft": false,
  "status": true,
  "createdAt": "2025-11-11T18:00:00.000Z"
}
```

**Possíveis Erros**:

- `400`: Erro de validação
- `400`: "Order not found"
- `401`: Token não fornecido ou inválido

**Observações**:

- Altera `status` de `false` para `true`
- Indica que o pedido foi concluído/entregue

---

### 15. Deletar Pedido

Deleta um pedido e todos os seus itens.

**Endpoint**: `DELETE /order`

**Autenticação**: Requerida

**Middlewares**: `isAuthenticated`, `validateSchema(deleteOrderSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Parameters**:

- `order_id` (obrigatório): UUID do pedido

**Exemplo de Requisição**:

```
DELETE /order?order_id=850e8400-e29b-41d4-a716-446655440005
```

**Resposta de Sucesso** (200):

```json
{
  "message": "Order deleted successfully"
}
```

**Possíveis Erros**:

- `400`: "Order ID is required"
- `400`: "Order not found"
- `401`: Token não fornecido ou inválido

**Observações**:

- Deleta permanentemente o pedido
- Todos os itens do pedido são deletados em cascata

---

## 🛒 Endpoints de Itens

### 16. Adicionar Item ao Pedido

Adiciona um novo item (produto) a um pedido existente.

**Endpoint**: `POST /order/add`

**Autenticação**: Requerida

**Middlewares**: `isAuthenticated`, `validateSchema(addItemOrderSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Body**:

```json
{
  "order_id": "850e8400-e29b-41d4-a716-446655440005",
  "product_id": "750e8400-e29b-41d4-a716-446655440003",
  "amount": 2
}
```

**Validações**:

- `order_id`: String (obrigatório)
- `product_id`: String (obrigatório)
- `amount`: Número inteiro positivo (obrigatório)

**Resposta de Sucesso** (200):

```json
{
  "id": "950e8400-e29b-41d4-a716-446655440006",
  "amount": 2,
  "order_id": "850e8400-e29b-41d4-a716-446655440005",
  "product_id": "750e8400-e29b-41d4-a716-446655440003",
  "createdAt": "2025-11-11T18:05:00.000Z",
  "product": {
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Pizza tradicional com molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../margherita.jpg"
  }
}
```

**Possíveis Erros**:

- `400`: Erro de validação
- `400`: "Order not found"
- `400`: "Product not found"
- `401`: Token não fornecido ou inválido

**Observações**:

- Apenas produtos ativos (disabled=false) podem ser adicionados
- Retorna o item criado com informações do produto

---

### 17. Remover Item do Pedido

Remove um item específico de um pedido.

**Endpoint**: `DELETE /order/remove`

**Autenticação**: Requerida

**Middlewares**: `isAuthenticated`, `validateSchema(removeItemSchema)`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Parameters**:

- `item_id` (obrigatório): UUID do item

**Exemplo de Requisição**:

```
DELETE /order/remove?item_id=950e8400-e29b-41d4-a716-446655440006
```

**Resposta de Sucesso** (200):

```json
{
  "message": "Item removed from order successfully"
}
```

**Possíveis Erros**:

- `400`: "Item ID is required"
- `400`: "Item not found"
- `401`: Token não fornecido ou inválido

**Observações**:

- Deleta permanentemente o item do pedido
- O pedido continua existindo mesmo sem itens

---

## 📊 Códigos de Status HTTP

| Código | Significado          | Uso                                                |
| ------ | -------------------- | -------------------------------------------------- |
| 200    | OK                   | Requisição bem-sucedida                            |
| 201    | Created              | Recurso criado com sucesso (ex: categoria)         |
| 400    | Bad Request          | Erro de validação ou lógica de negócio             |
| 401    | Unauthorized         | Token inválido ou ausente, ou permissão insuficiente |
| 500    | Internal Server Error | Erro interno do servidor                           |

---

## ⚠️ Tratamento de Erros

### Formato Padrão de Erro

Todos os erros seguem o formato:

```json
{
  "error": "Mensagem de erro"
}
```

### Erros de Validação (Schema)

Quando a validação do schema falha:

```json
{
  "error": "Erro validação",
  "details": [
    { "message": "O nome precisa ter no minimo 3 letras" },
    { "message": "Precisa ser um email valido" }
  ]
}
```

### Exemplos de Mensagens de Erro Comuns

**Autenticação**:

- "Token não fornecido" / "Token inválido"
- "Usuário sem permissão"
- "Email/Password incorrect"

**Recursos não encontrados**:

- "Order not found"
- "Product not found"
- "Category not found"
- "Item not found"

**Validação**:

- "Image is required"
- "Invalid file type, use jpeg, png or jpg"
- "Name must be at least 2 characters"

**Lógica de negócio**:

- "Usuário já existente!"
- "Error adding item to order"
- "Error deleting product"

---

## 📝 Notas Importantes

1. **Preços**: Todos os preços são representados em centavos (inteiros) para evitar problemas com ponto flutuante.
   - Exemplo: R$ 35,00 = 3500

2. **UUIDs**: Todos os IDs são UUIDs v4 gerados automaticamente.

3. **Timestamps**: `createdAt` e `updatedAt` são gerenciados automaticamente pelo Prisma.

4. **Soft Delete**: Produtos usam soft delete (campo `disabled`), não são removidos do banco.

5. **Cascade Delete**: 
   - Deletar Category → Deleta todos os Products relacionados
   - Deletar Product → Deleta todos os Items relacionados
   - Deletar Order → Deleta todos os Items relacionados

6. **Roles**:
   - `STAFF`: Funcionário padrão (acesso básico)
   - `ADMIN`: Administrador (acesso total, pode criar categorias e produtos)

7. **Status de Pedidos**:
   - `draft: true` = Rascunho (não enviado para cozinha)
   - `draft: false` = Enviado para cozinha
   - `status: false` = Pendente/Em preparo
   - `status: true` = Finalizado/Entregue

---

**Documento criado em**: 12/02/2026  
**Versão**: 2.0.0  
**Última atualização**: 12/02/2026

