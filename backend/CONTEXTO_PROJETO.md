# 📋 Documentação de Contexto do Projeto - Sistema de Pizzaria

## 📖 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias e Versões](#tecnologias-e-versões)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Modelagem do Banco de Dados](#modelagem-do-banco-de-dados)
6. [Middlewares](#middlewares)
7. [Validação com Schemas](#validação-com-schemas)
8. [Endpoints](#endpoints)
9. [Fluxo de Requisição](#fluxo-de-requisição)
10. [Configurações do Projeto](#configurações-do-projeto)
11. [Resumo de Controllers e Services](#resumo-de-controllers-e-services)
12. [Mapa Completo de Rotas](#mapa-completo-de-rotas)
13. [Como Iniciar o Projeto](#como-iniciar-o-projeto)
14. [Segurança](#segurança)
15. [Observações Importantes](#observações-importantes)

---

## 🎯 Visão Geral

Sistema backend de gerenciamento de pizzaria desenvolvido em Node.js com TypeScript, utilizando Express como framework web, Prisma ORM para comunicação com banco de dados PostgreSQL, e Zod para validação de dados.

---

## 🏗️ Arquitetura

O projeto segue o padrão **Arquitetura em camadas**, com a seguinte estrutura:

```
Requisição HTTP → Rotas → Middlewares → Controller → Service → Banco de Dados → Service → Controller → Resposta HTTP
```

### Camadas da Arquitetura:

1. **Rotas (`routes.ts`)**: Define os endpoints e aplica os middlewares
2. **Middlewares**: Validação de schema, autenticação e autorização
3. **Controllers**: Recebem a requisição, extraem dados e delegam para o Service
4. **Services**: Contêm toda a lógica de negócio e comunicação com o banco de dados
5. **Prisma Client**: ORM que gerencia a comunicação com PostgreSQL

### Princípios Seguidos:

- **Separação de Responsabilidades**: Cada camada tem uma responsabilidade específica
- **Single Responsibility Principle**: Um controller/service para cada operação
- **Reutilização**: Middlewares compartilhados entre rotas
- **Validação Centralizada**: Schemas Zod validam dados antes de chegarem ao controller
- **Tratamento de Erros nos Services**: Services utilizam `try/catch` para capturar erros e lançar exceções com mensagens descritivas
- **Status HTTP nos Controllers**: Controllers utilizam `res.status()` para definir o código HTTP adequado quando necessário (ex: `res.status(201)` para criação)

---

## 🚀 Tecnologias e Versões

### Dependências de Produção

| Tecnologia         | Versão  | Finalidade                                   |
| ------------------ | ------- | -------------------------------------------- |
| **express**        | ^5.1.0  | Framework web para criação de APIs REST      |
| **@prisma/client** | ^6.19.0 | ORM para comunicação com banco de dados      |
| **typescript**     | ^5.9.3  | Superset JavaScript com tipagem estática     |
| **zod**            | ^4.1.12 | Biblioteca de validação de schemas e tipagem |
| **bcryptjs**       | ^3.0.3  | Criptografia de senhas                       |
| **jsonwebtoken**   | ^9.0.2  | Geração e validação de tokens JWT            |
| **cors**           | ^2.8.5  | Middleware para habilitar CORS               |
| **dotenv**         | ^17.2.3 | Carregamento de variáveis de ambiente        |
| **tsx**            | ^4.20.6 | Executor TypeScript para desenvolvimento     |
| **multer**         | ^1.4.5  | Middleware para upload de arquivos           |
| **cloudinary**     | ^2.9.0  | Serviço de armazenamento de imagens na nuvem |

### Dependências de Desenvolvimento

| Tecnologia              | Versão   | Finalidade                    |
| ----------------------- | -------- | ----------------------------- |
| **@types/express**      | ^5.0.5   | Tipos TypeScript para Express |
| **@types/cors**         | ^2.8.19  | Tipos TypeScript para CORS    |
| **@types/jsonwebtoken** | ^9.0.10  | Tipos TypeScript para JWT     |
| **@types/multer**       | ^2.0.2  | Tipos TypeScript para Multer  |
| **@types/node**         | ^24.10.0 | Tipos TypeScript para Node.js |
| **prisma**              | ^6.19.0  | CLI do Prisma ORM             |

### Banco de Dados

- **PostgreSQL** (gerenciado via Prisma ORM)

---

## 📁 Estrutura de Pastas

```
backend/
├── prisma/
│   ├── migrations/           # Histórico de migrações do banco
│   │   └── 20251110200355_create_tables/
│   │       └── migration.sql
│   ├── migration_lock.toml   # Lock de migrações
│   └── schema.prisma         # Schema do banco de dados
├── src/
│   ├── @types/               # Definições de tipos TypeScript customizados
│   │   └── express/
│   │       └── index.d.ts    # Extensão de tipos do Express
│   ├── config/               # Configurações da aplicação
│   │   ├── cloudinary.ts     # Configuração do Cloudinary
│   │   └── multer.ts         # Configuração do Multer para upload
│   ├── controllers/          # Controllers (recebem requisições)
│   │   ├── category/
│   │   │   ├── CreateCategoryController.ts
│   │   │   └── ListCategoryController.ts
│   │   ├── product/
│   │   │   ├── CreateProductController.ts
│   │   │   ├── DeleteProductController.ts
│   │   │   ├── ListProductByCategoryController.ts
│   │   │   └── ListProductController.ts
│   │   ├── order/
│   │   │   ├── AddItemController.ts
│   │   │   ├── CreateOrderController.ts
│   │   │   ├── DeleteOrderController.ts
│   │   │   ├── DetailOrderController.ts
│   │   │   ├── FinishOrderController.ts
│   │   │   ├── ListOrdersController.ts
│   │   │   ├── RemoveItemController.ts
│   │   │   └── SendOrderController.ts
│   │   └── user/
│   │       ├── AuthUserController.ts
│   │       ├── CreateUserController.ts
│   │       └── DetailUserController.ts
│   ├── generated/            # Código gerado pelo Prisma
│   │   └── prisma/
│   │       └── client.ts
│   ├── middlewares/          # Middlewares customizados
│   │   ├── isAdmin.ts        # Verifica se usuário é admin
│   │   ├── isAuthenticated.ts # Valida JWT token
│   │   └── validateSchema.ts  # Valida requisições com Zod
│   ├── prisma/               # Configuração do Prisma Client
│   │   └── index.ts
│   ├── schemas/              # Schemas de validação Zod
│   │   ├── categorySchema.ts
│   │   ├── orderSchema.ts
│   │   ├── productSchema.ts
│   │   └── userSchema.ts
│   ├── services/             # Services (lógica de negócio)
│   │   ├── category/
│   │   │   ├── CreateCategoryService.ts
│   │   │   └── ListCategoryService.ts
│   │   ├── product/
│   │   │   ├── CreateProductService.ts
│   │   │   ├── DeleteProductService.ts
│   │   │   ├── ListProductByCategoryService.ts
│   │   │   └── ListProductService.ts
│   │   ├── order/
│   │   │   ├── AddItemOrderService.ts
│   │   │   ├── CreateOrderService.ts
│   │   │   ├── DeleteOrderService.ts
│   │   │   ├── DetailOrderService.ts
│   │   │   ├── FinishOrderService.ts
│   │   │   ├── ListOrdersService.ts
│   │   │   ├── RemoveItemService.ts
│   │   │   └── SendOrderService.ts
│   │   └── user/
│   │       ├── AuthUserService.ts
│   │       ├── CreateUserService.ts
│   │       └── DetailUserService.ts
│   ├── routes.ts             # Definição de todas as rotas
│   └── server.ts             # Configuração e inicialização do servidor
├── .env                      # Variáveis de ambiente
├── endpoint.md               # Documentação completa de todos os endpoints
├── package.json              # Dependências e scripts
├── prisma.config.ts          # Configurações adicionais do Prisma
└── tsconfig.json             # Configurações do TypeScript

```

### Convenções de Nomenclatura:

- **Controllers**: `<Action><Entity>Controller.ts` (ex: `CreateUserController.ts`)
- **Services**: `<Action><Entity>Service.ts` (ex: `CreateUserService.ts`)
- **Schemas**: `<entity>Schema.ts` (ex: `userSchema.ts`)
- **Middlewares**: `<description>.ts` (ex: `isAuthenticated.ts`)

---

## 🗄️ Modelagem do Banco de Dados

### Diagrama de Relacionamentos

```
User (1)
  └─ role: STAFF | ADMIN

Category (1) ─────< (N) Product
                         │
                         └─< (N) Item >─┐
                                        │
Order (1) ─────────────────────────────┘
  └─ items: Item[]
```

### Entidades e Atributos

#### **User** (Usuários do Sistema)

```typescript
{
  id: string(UUID); // Identificador único
  name: string; // Nome completo
  email: string(unique); // Email (único)
  password: string; // Senha criptografada (bcrypt)
  role: Role; // STAFF ou ADMIN
  createdAt: DateTime; // Data de criação
  updatedAt: DateTime; // Data de atualização
}
```

**Enum Role:**

- `STAFF` - Funcionário padrão
- `ADMIN` - Administrador (acesso total)

#### **Category** (Categorias de Produtos)

```typescript
{
  id: string (UUID)          // Identificador único
  name: string               // Nome da categoria
  createdAt: DateTime        // Data de criação
  updatedAt: DateTime        // Data de atualização
  products: Product[]        // Produtos desta categoria
}
```

#### **Product** (Produtos/Pizzas)

```typescript
{
  id: string (UUID)          // Identificador único
  name: string               // Nome do produto
  price: number (int)        // Preço em centavos
  description: string        // Descrição do produto
  banner: string             // URL da imagem
  disabled: boolean          // Produto ativo/inativo
  category_id: string        // FK para Category
  category: Category         // Relação com categoria
  items: Item[]              // Itens de pedidos deste produto
  createdAt: DateTime        // Data de criação
  updatedAt: DateTime        // Data de atualização
}
```

**Observação sobre preço**: O preço é armazenado em **centavos** (inteiro) para evitar problemas com aritmética de ponto flutuante.

#### **Order** (Pedidos)

```typescript
{
  id: string (UUID)          // Identificador único
  table: number (int)        // Número da mesa
  status: boolean            // false = pendente, true = finalizado
  draft: boolean             // true = rascunho, false = enviado para cozinha
  name: string?              // Nome opcional para o pedido
  items: Item[]              // Itens do pedido
  createdAt: DateTime        // Data de criação
  updatedAt: DateTime        // Data de atualização
}
```

**Fluxo de Status do Pedido**:

1. **Criação**: `draft: true`, `status: false` (Rascunho - Ainda montando o pedido)
2. **Enviado para Cozinha**: `draft: false`, `status: false` (Pedido confirmado e em preparo)
3. **Finalizado**: `draft: false`, `status: true` (Pedido pronto/entregue)

**Campos de Status**:

- `draft: true` → Pedido em rascunho (ainda pode adicionar/remover itens livremente)
- `draft: false` → Pedido enviado para cozinha (confirmado)
- `status: false` → Pedido pendente/em preparo
- `status: true` → Pedido finalizado/entregue

#### **Item** (Itens dos Pedidos)

```typescript
{
  id: string(UUID); // Identificador único
  amount: number(int); // Quantidade
  order_id: string; // FK para Order
  order: Order; // Relação com pedido
  product_id: string; // FK para Product
  product: Product; // Relação com produto
  createdAt: DateTime; // Data de criação
  updatedAt: DateTime; // Data de atualização
}
```

### Regras de Deleção (Cascade)

- **Product** deletado → Deleta todos os **Items** relacionados
- **Order** deletado → Deleta todos os **Items** relacionados
- **Category** deletada → Deleta todos os **Products** relacionados

---

## 🛡️ Middlewares

### 1. **isAuthenticated** (`middlewares/isAuthenticated.ts`)

**Função**: Valida se o usuário está autenticado verificando o token JWT.

**Fluxo**:

1. Extrai o token do header `Authorization: Bearer <token>`
2. Verifica a validade do token usando `jsonwebtoken`
3. Extrai o `user_id` do payload do token
4. Adiciona `user_id` ao objeto `req` para uso nos próximos middlewares/controllers
5. Chama `next()` se válido, ou retorna erro 401 se inválido

**Uso**:

```typescript
router.get("/me", isAuthenticated, new DetailUserController().handle);
```

**Respostas de Erro**:

- `401`: Token não fornecido ou inválido

---

### 2. **isAdmin** (`middlewares/isAdmin.ts`)

**Função**: Verifica se o usuário autenticado tem permissão de ADMIN.

**Pré-requisito**: Deve ser usado **após** o middleware `isAuthenticated`.

**Fluxo**:

1. Obtém `user_id` do `req` (adicionado pelo `isAuthenticated`)
2. Busca o usuário no banco de dados
3. Verifica se o campo `role` é igual a `"ADMIN"`
4. Chama `next()` se for admin, ou retorna erro 401 se não for

**Uso**:

```typescript
router.post(
  "/category",
  isAuthenticated,
  isAdmin,
  new CreateCategoryController().handle
);
```

**Respostas de Erro**:

- `401`: Usuário sem permissão

---

### 3. **validateSchema** (`middlewares/validateSchema.ts`)

**Função**: Valida dados da requisição (body, query, params) usando schemas Zod.

**Fluxo**:

1. Recebe um schema Zod como parâmetro
2. Valida `req.body`, `req.query` e `req.params` contra o schema
3. Chama `next()` se válido
4. Retorna erro 400 com detalhes da validação se inválido

**Uso**:

```typescript
router.post(
  "/users",
  validateSchema(createUserSchema),
  new CreateUserController().handle
);
```

**Respostas de Erro**:

- `400`: Erro de validação com detalhes dos campos inválidos
- `500`: Erro interno do servidor

**Exemplo de resposta de erro**:

```json
{
  "error": "Erro validação",
  "details": [
    { "message": "O nome precisa ter no minimo 3 letras" },
    { "message": "Precisa ser um email valido" }
  ]
}
```

---

## ✅ Validação com Schemas

Utilizamos **Zod** para validação de dados de entrada. Os schemas ficam organizados na pasta `src/schemas/`.

### User Schemas (`schemas/userSchema.ts`)

#### **createUserSchema**

Valida criação de novos usuários:

```typescript
{
  body: {
    name: string (min: 3 caracteres),
    email: email válido,
    password: string (min: 6 caracteres)
  }
}
```

**Mensagens de erro customizadas**:

- Nome inválido: "O nome precisa ter no minimo 3 letras"
- Email inválido: "Precisa ser um email valido"
- Senha inválida: "A senha deve ter no minimo 6 caracteres"

#### **authUserSchema**

Valida autenticação de usuários:

```typescript
{
  body: {
    email: email válido,
    password: string (obrigatório)
  }
}
```

### Category Schemas (`schemas/categorySchema.ts`)

#### **createCategorySchema**

Valida criação de categorias:

```typescript
{
  body: {
    name: string (min: 2 caracteres)
  }
}
```

**Mensagens de erro**:

- Nome inválido: "Name must be at least 2 characters"

---

### Product Schemas (`schemas/productSchema.ts`)

#### **createProductSchema**

Valida criação de produtos:

```typescript
{
  body: {
    name: string (obrigatório),
    price: string (obrigatório, somente números),
    description: string (obrigatório),
    category_id: string (obrigatório)
  }
}
```

**Validações**:

- **name**: Campo obrigatório
- **price**: Campo obrigatório, deve conter apenas dígitos
- **description**: Campo obrigatório
- **category_id**: UUID da categoria (obrigatório)

**Observações**:

- O arquivo de imagem é obrigatório mas validado no controller
- O preço é enviado como string e convertido para número inteiro no controller

---

#### **listProductSchema**

Valida listagem de produtos com filtro:

```typescript
{
  query: {
    disabled: string (opcional, "true" ou "false")
  }
}
```

**Validações**:

- **disabled**: Query param opcional que aceita "true" ou "false"
- **Valor padrão**: "false" (quando não informado)
- **Transformação**: String é convertida para boolean

**Mensagens de erro**:

- Valor inválido: "Disabled must be 'true' or 'false'"

---

#### **listProductByCategorySchema**

Valida listagem de produtos por categoria:

```typescript
{
  query: {
    category_id: string (obrigatório)
  }
}
```

**Validações**:

- **category_id**: Query param obrigatório

**Mensagens de erro**:

- Valor ausente: "Category ID is required"

---

### Order Schemas (`schemas/orderSchema.ts`)

#### **createOrderSchema**

Valida criação de pedidos:

```typescript
{
  body: {
    table: number (inteiro, positivo),
    name: string (opcional)
  }
}
```

**Validações**:

- **table**: Número inteiro obrigatório, positivo
- **name**: Nome do cliente (opcional)

**Mensagens de erro**:

- Table inválido: "Table must be a number" / "Table must be an integer" / "Table must be positive"

---

#### **addItemOrderSchema**

Valida adição de item ao pedido:

```typescript
{
  body: {
    order_id: string (obrigatório),
    product_id: string (obrigatório),
    amount: number (inteiro, positivo)
  }
}
```

**Validações**:

- **order_id**: UUID do pedido (obrigatório)
- **product_id**: UUID do produto (obrigatório)
- **amount**: Quantidade, número inteiro positivo (obrigatório)

**Mensagens de erro**:

- "Order ID is required"
- "Product ID is required"
- "Amount is required" / "Amount must be an integer" / "Amount must be positive"

---

#### **removeItemSchema**

Valida remoção de item do pedido:

```typescript
{
  query: {
    item_id: string (obrigatório, mínimo 1)
  }
}
```

**Validações**:

- **item_id**: UUID do item (obrigatório)

**Mensagens de erro**:

- "Item ID is required"

---

#### **detailOrderSchema**

Valida busca de detalhes do pedido:

```typescript
{
  query: {
    order_id: string (obrigatório, mínimo 1)
  }
}
```

**Validações**:

- **order_id**: UUID do pedido (obrigatório)

**Mensagens de erro**:

- "Order ID is required"

---

#### **sendOrderSchema**

Valida envio do pedido para cozinha:

```typescript
{
  body: {
    order_id: string (obrigatório, mínimo 1),
    name: string (obrigatório, mínimo 1)
  }
}
```

**Validações**:

- **order_id**: UUID do pedido (obrigatório)
- **name**: Nome do cliente (obrigatório)

**Mensagens de erro**:

- "Order ID is required"
- "Name is required"

---

#### **finishOrderSchema**

Valida finalização do pedido:

```typescript
{
  body: {
    order_id: string (obrigatório, mínimo 1)
  }
}
```

**Validações**:

- **order_id**: UUID do pedido (obrigatório)

**Mensagens de erro**:

- "Order ID is required"

---

#### **deleteOrderSchema**

Valida deleção do pedido:

```typescript
{
  query: {
    order_id: string (obrigatório, mínimo 1)
  }
}
```

**Validações**:

- **order_id**: UUID do pedido (obrigatório)

**Mensagens de erro**:

- "Order ID is required"

---

## 🌐 Endpoints

### **Usuários**

#### **POST /users**

Cria um novo usuário no sistema.

**Middlewares**: `validateSchema(createUserSchema)`

**Body**:

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-gerado",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

**Observações**:

- Senha é criptografada com bcrypt (salt: 8)
- Role padrão é STAFF
- Senha não é retornada na resposta

---

#### **POST /session**

Autentica um usuário e retorna token JWT.

**Middlewares**: `validateSchema(authUserSchema)`

**Body**:

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-do-usuario",
  "name": "João Silva",
  "email": "joao@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Observações**:

- Token JWT com expiração configurada em variável de ambiente
- Token contém o `user_id` no campo `sub`

---

#### **GET /me**

Retorna informações do usuário autenticado.

**Middlewares**: `isAuthenticated`

**Headers**:

```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-do-usuario",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF"
}
```

---

### **Categorias**

#### **POST /category**

Cria uma nova categoria de produtos.

**Middlewares**: `isAuthenticated`, `isAdmin`, `validateSchema(createCategorySchema)`

**Permissão**: Apenas usuários com role ADMIN

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

**Resposta de Sucesso (201)**:

```json
{
  "id": "uuid-gerado",
  "name": "Pizzas Doces",
  "createdAt": "2025-11-11T10:30:00.000Z"
}
```

---

#### **GET /category**

Lista todas as categorias cadastradas.

**Middlewares**: `isAuthenticated`

**Permissão**: Usuários autenticados (STAFF ou ADMIN)

**Headers**:

```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200)**:

```json
[
  {
    "id": "uuid-categoria-1",
    "name": "Pizzas Salgadas",
    "createdAt": "2025-11-10T10:30:00.000Z",
    "updatedAt": "2025-11-10T10:30:00.000Z"
  },
  {
    "id": "uuid-categoria-2",
    "name": "Pizzas Doces",
    "createdAt": "2025-11-11T15:20:00.000Z",
    "updatedAt": "2025-11-11T15:20:00.000Z"
  }
]
```

**Observações**:

- Categorias são ordenadas por data de criação (mais recentes primeiro)
- Retorna array vazio se não houver categorias cadastradas

---

### **Produtos**

#### **POST /product**

Cria um novo produto com upload de imagem.

**Middlewares**: `isAuthenticated`, `isAdmin`, `multer.single('file')`, `validateSchema(createProductSchema)`

**Permissão**: Apenas usuários com role ADMIN

**Headers**:

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (multipart/form-data)**:

```
name: "Pizza Margherita"
price: "3500"  (valor em centavos)
description: "Pizza tradicional com molho de tomate, mussarela e manjericão"
category_id: "uuid-da-categoria"
file: [arquivo de imagem]
```

**Validações de Upload**:

- **Tamanho máximo**: 5MB
- **Formatos aceitos**: JPEG, PNG, JPG
- **Campo obrigatório**: `file`

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-gerado",
  "name": "Pizza Margherita",
  "price": 3500,
  "description": "Pizza tradicional com molho de tomate, mussarela e manjericão",
  "banner": "https://res.cloudinary.com/.../image.jpg",
  "category_id": "uuid-da-categoria",
  "createdAt": "2025-11-11T16:45:00.000Z"
}
```

**Erros Específicos**:

- `400`: "Image is required" - Quando o arquivo não é enviado
- `400`: "Invalid file type, use jpeg, png or jpg" - Formato inválido
- `400`: "Category not found" - Categoria não existe
- `500`: "Error sending image to cloudinary" - Falha no upload da imagem

**Observações**:

- A imagem é enviada para o Cloudinary e armazenada na pasta `products`
- O preço é convertido de string para número inteiro (centavos)
- O produto é criado com `disabled: false` por padrão
- A URL da imagem (banner) é retornada no campo `banner`

---

#### **GET /products**

Lista todos os produtos cadastrados com filtro por status.

**Middlewares**: `isAuthenticated`, `validateSchema(listProductSchema)`

**Permissão**: Usuários autenticados (STAFF ou ADMIN)

**Headers**:

```
Authorization: Bearer <token>
```

**Query Params**:

- `disabled` (opcional): "true" ou "false"
  - Padrão: "false"
  - Filtra produtos pela propriedade `disabled`

**Exemplos de Requisição**:

```
GET /products                     # Lista produtos com disabled=false (padrão)
GET /products?disabled=false      # Lista produtos ativos
GET /products?disabled=true       # Lista produtos desabilitados
```

**Resposta de Sucesso (200)**:

```json
[
  {
    "id": "uuid-produto-1",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Pizza tradicional com molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../image.jpg",
    "disabled": false,
    "category_id": "uuid-categoria",
    "category": {
      "id": "uuid-categoria",
      "name": "Pizzas Salgadas"
    },
    "createdAt": "2025-11-11T16:45:00.000Z",
    "updatedAt": "2025-11-11T16:45:00.000Z"
  },
  {
    "id": "uuid-produto-2",
    "name": "Pizza Calabresa",
    "price": 4000,
    "description": "Pizza com calabresa, cebola e azeitonas",
    "banner": "https://res.cloudinary.com/.../image2.jpg",
    "disabled": false,
    "category_id": "uuid-categoria",
    "category": {
      "id": "uuid-categoria",
      "name": "Pizzas Salgadas"
    },
    "createdAt": "2025-11-11T17:30:00.000Z",
    "updatedAt": "2025-11-11T17:30:00.000Z"
  }
]
```

**Observações**:

- Produtos são ordenados por data de criação (mais recentes primeiro)
- Retorna informações da categoria relacionada (id e name)
- Retorna array vazio se não houver produtos com o filtro especificado
- Preços são retornados em centavos
- Por padrão, lista apenas produtos ativos (disabled=false)

---

#### **GET /category/product**

Lista todos os produtos de uma categoria específica.

**Middlewares**: `isAuthenticated`, `validateSchema(listProductByCategorySchema)`

**Permissão**: Usuários autenticados (STAFF ou ADMIN)

**Headers**:

```
Authorization: Bearer <token>
```

**Query Params**:

- `category_id` (obrigatório): UUID da categoria

**Exemplo de Requisição**:

```
GET /category/product?category_id=uuid-da-categoria
```

**Resposta de Sucesso (200)**:

```json
[
  {
    "id": "uuid-produto-1",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Pizza tradicional com molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../image.jpg",
    "disabled": false,
    "category_id": "uuid-categoria",
    "createdAt": "2025-11-11T16:45:00.000Z",
    "updatedAt": "2025-11-11T16:45:00.000Z"
  }
]
```

**Erros Específicos**:

- `400`: "Category not found" - Categoria não existe
- `400`: "Category ID is required" - Query param não informado

**Observações**:

- Retorna apenas produtos ativos (disabled=false)
- Produtos são ordenados por data de criação (mais recentes primeiro)
- Retorna array vazio se a categoria não tiver produtos

---

#### **DELETE /product**

Desabilita um produto (soft delete).

**Middlewares**: `isAuthenticated`, `isAdmin`

**Permissão**: Apenas usuários com role ADMIN

**Headers**:

```
Authorization: Bearer <token>
```

**Query Params**:

- `product_id` (obrigatório): UUID do produto

**Exemplo de Requisição**:

```
DELETE /product?product_id=uuid-do-produto
```

**Resposta de Sucesso (200)**:

```json
{
  "message": "Product deleted successfully"
}
```

**Erros Específicos**:

- `400`: "Error deleting product" - Produto não encontrado
- `401`: Token inválido ou usuário sem permissão de ADMIN

**Observações**:

- O produto não é removido do banco de dados
- O produto é apenas marcado como `disabled: true` (soft delete)
- Produtos desabilitados não aparecem nas listagens padrão
- Permite manter histórico de produtos vendidos

---

### **Pedidos**

#### **POST /order**

Cria um novo pedido (order).

**Middlewares**: `isAuthenticated`, `validateSchema(createOrderSchema)`

**Permissão**: Usuários autenticados (STAFF ou ADMIN)

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

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-gerado",
  "table": 5,
  "name": "João Silva",
  "status": false,
  "draft": true,
  "createdAt": "2025-11-11T18:00:00.000Z"
}
```

**Observações**:

- O pedido é criado com `status: false` (aberto) e `draft: true` (rascunho) por padrão
- O campo `name` se refere ao nome do cliente (opcional)
- O campo `table` se refere ao número da mesa

---

#### **GET /orders**

Lista todos os pedidos com filtro por status de rascunho.

**Middlewares**: `isAuthenticated`

**Permissão**: Usuários autenticados (STAFF ou ADMIN)

**Headers**:

```
Authorization: Bearer <token>
```

**Query Params**:

- `draft` (opcional): "true" ou "false"
  - Filtra pedidos pelo status draft

**Exemplos de Requisição**:

```
GET /orders?draft=true    # Lista pedidos em rascunho
GET /orders?draft=false   # Lista pedidos enviados para cozinha
```

**Resposta de Sucesso (200)**:

```json
[
  {
    "id": "uuid-pedido-1",
    "table": 5,
    "name": "João Silva",
    "status": false,
    "draft": false,
    "createdAt": "2025-11-11T18:00:00.000Z",
    "items": [
      {
        "id": "uuid-item-1",
        "amount": 2,
        "product": {
          "id": "uuid-produto-1",
          "name": "Pizza Margherita",
          "price": 3500,
          "description": "Pizza tradicional com molho de tomate, mussarela e manjericão",
          "banner": "https://res.cloudinary.com/.../image.jpg"
        }
      }
    ]
  }
]
```

**Observações**:

- Retorna pedidos com seus itens e produtos relacionados
- Útil para separar rascunhos dos pedidos confirmados

---

#### **GET /order/detail**

Retorna informações detalhadas de um pedido específico.

**Middlewares**: `isAuthenticated`, `validateSchema(detailOrderSchema)`

**Permissão**: Usuários autenticados (STAFF ou ADMIN)

**Headers**:

```
Authorization: Bearer <token>
```

**Query Params**:

- `order_id` (obrigatório): UUID do pedido

**Exemplo de Requisição**:

```
GET /order/detail?order_id=uuid-do-pedido
```

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-pedido",
  "table": 5,
  "name": "João Silva",
  "status": false,
  "draft": false,
  "createdAt": "2025-11-11T18:00:00.000Z",
  "updatedAt": "2025-11-11T18:30:00.000Z",
  "items": [
    {
      "id": "uuid-item-1",
      "amount": 2,
      "createdAt": "2025-11-11T18:05:00.000Z",
      "product": {
        "id": "uuid-produto-1",
        "name": "Pizza Margherita",
        "price": 3500,
        "description": "Pizza tradicional com molho de tomate, mussarela e manjericão",
        "banner": "https://res.cloudinary.com/.../image.jpg"
      }
    }
  ]
}
```

**Erros Específicos**:

- `400`: "Order not found" - Pedido não existe
- `400`: "Order ID is required" - Query param não informado

**Observações**:

- Retorna o pedido completo com todos os itens e detalhes dos produtos

---

#### **PUT /order/send**

Envia um pedido rascunho para a cozinha (altera draft de true para false).

**Middlewares**: `isAuthenticated`, `validateSchema(sendOrderSchema)`

**Permissão**: Usuários autenticados (STAFF ou ADMIN)

**Headers**:

```
Authorization: Bearer <token>
```

**Body**:

```json
{
  "order_id": "uuid-do-pedido",
  "name": "João Silva"
}
```

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-pedido",
  "table": 5,
  "name": "João Silva",
  "draft": false,
  "status": false,
  "createdAt": "2025-11-11T18:00:00.000Z"
}
```

**Erros Específicos**:

- `400`: "Order not found" - Pedido não existe

**Observações**:

- Altera `draft` de `true` para `false`
- Atualiza o nome do pedido
- Após enviar, o pedido aparece para a cozinha

---

#### **PUT /order/finish**

Marca um pedido como finalizado (altera status de false para true).

**Middlewares**: `isAuthenticated`, `validateSchema(finishOrderSchema)`

**Permissão**: Usuários autenticados (STAFF ou ADMIN)

**Headers**:

```
Authorization: Bearer <token>
```

**Body**:

```json
{
  "order_id": "uuid-do-pedido"
}
```

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-pedido",
  "table": 5,
  "name": "João Silva",
  "draft": false,
  "status": true,
  "createdAt": "2025-11-11T18:00:00.000Z"
}
```

**Erros Específicos**:

- `400`: "Order not found" - Pedido não existe

**Observações**:

- Altera `status` de `false` para `true`
- Indica que o pedido foi concluído/entregue

---

#### **DELETE /order**

Deleta um pedido e todos os seus itens.

**Middlewares**: `isAuthenticated`, `validateSchema(deleteOrderSchema)`

**Permissão**: Usuários autenticados (STAFF ou ADMIN)

**Headers**:

```
Authorization: Bearer <token>
```

**Query Params**:

- `order_id` (obrigatório): UUID do pedido

**Exemplo de Requisição**:

```
DELETE /order?order_id=uuid-do-pedido
```

**Resposta de Sucesso (200)**:

```json
{
  "message": "Order deleted successfully"
}
```

**Erros Específicos**:

- `400`: "Order not found" - Pedido não existe

**Observações**:

- Deleta permanentemente o pedido
- Todos os itens do pedido são deletados em cascata

---

### **Itens**

#### **POST /order/add**

Adiciona um novo item (produto) a um pedido existente.

**Middlewares**: `isAuthenticated`, `validateSchema(addItemOrderSchema)`

**Permissão**: Usuários autenticados (STAFF ou ADMIN)

**Headers**:

```
Authorization: Bearer <token>
```

**Body**:

```json
{
  "order_id": "uuid-do-pedido",
  "product_id": "uuid-do-produto",
  "amount": 2
}
```

**Resposta de Sucesso (200)**:

```json
{
  "id": "uuid-item-gerado",
  "amount": 2,
  "order_id": "uuid-do-pedido",
  "product_id": "uuid-do-produto",
  "createdAt": "2025-11-11T18:05:00.000Z",
  "product": {
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Pizza tradicional com molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../image.jpg"
  }
}
```

**Erros Específicos**:

- `400`: "Order not found" - Pedido não existe
- `400`: "Product not found" - Produto não existe ou está desabilitado

**Observações**:

- Apenas produtos ativos (disabled=false) podem ser adicionados
- Retorna o item criado com informações do produto

---

#### **DELETE /order/remove**

Remove um item específico de um pedido.

**Middlewares**: `isAuthenticated`, `validateSchema(removeItemSchema)`

**Permissão**: Usuários autenticados (STAFF ou ADMIN)

**Headers**:

```
Authorization: Bearer <token>
```

**Query Params**:

- `item_id` (obrigatório): UUID do item

**Exemplo de Requisição**:

```
DELETE /order/remove?item_id=uuid-do-item
```

**Resposta de Sucesso (200)**:

```json
{
  "message": "Item removed from order successfully"
}
```

**Erros Específicos**:

- `400`: "Item not found" - Item não existe

**Observações**:

- Deleta permanentemente o item do pedido
- O pedido continua existindo mesmo sem itens

---

## 🔄 Fluxo de Requisição

### Exemplo Completo: Criação de Usuário

```
1. POST /users
   ↓
2. Middleware: validateSchema(createUserSchema)
   - Valida name, email, password
   - Se inválido → 400 com erros
   ↓
3. CreateUserController.handle()
   - Extrai dados do req.body
   - Instancia CreateUserService
   - Chama service.execute()
   ↓
4. CreateUserService.execute()
   - Verifica se email já existe
   - Se existe → throw Error("Usuário já existente!")
   - Criptografa senha com bcrypt
   - Cria usuário no banco via Prisma
   - Retorna dados do usuário (sem senha)
   ↓
5. CreateUserController.handle()
   - Recebe dados do service
   - Retorna res.json(user)
   ↓
6. Resposta HTTP 200 com dados do usuário
```

### Fluxo com Autenticação e Autorização

```
1. POST /category
   ↓
2. Middleware: isAuthenticated
   - Valida token JWT
   - Adiciona user_id ao req
   - Se inválido → 401
   ↓
3. Middleware: isAdmin
   - Busca usuário no banco
   - Verifica role === "ADMIN"
   - Se não for admin → 401
   ↓
4. Middleware: validateSchema(createCategorySchema)
   - Valida dados
   - Se inválido → 400
   ↓
5. CreateCategoryController → CreateCategoryService
   - Lógica de negócio
   - Criação no banco
   ↓
6. Resposta HTTP 201
```

---

## ⚙️ Configurações do Projeto

### Multer (`config/multer.ts`)

Configuração para upload de arquivos:

**Storage**: `memoryStorage()` - Armazena arquivos em memória (Buffer) para envio direto ao Cloudinary

**Limites**:

- Tamanho máximo: 5MB por arquivo

**Filtro de Tipos**:

- Formatos aceitos: `image/jpeg`, `image/png`, `image/jpg`
- Rejeita outros formatos com erro: "Invalid file type, use jpeg, png or jpg"

**Fluxo de Upload**:

1. Multer recebe o arquivo e armazena em memória (Buffer)
2. Controller valida se o arquivo foi enviado
3. Service converte Buffer em Stream
4. Stream é enviado diretamente ao Cloudinary
5. URL da imagem é retornada e salva no banco

---

### Cloudinary (`config/cloudinary.ts`)

Serviço de armazenamento de imagens na nuvem.

**Configuração**:

```typescript
{
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
}
```

**Upload de Produtos**:

- **Pasta**: `products/`
- **Tipo**: `image`
- **Public ID**: `{timestamp}-{nome-original-sem-extensao}`
- **Retorno**: URL segura (HTTPS) da imagem

**Variáveis de Ambiente Necessárias**:

- `CLOUDINARY_NAME`: Nome do cloud Cloudinary
- `CLOUDINARY_API_KEY`: Chave da API
- `CLOUDINARY_API_SECRET`: Secret da API

---

### TypeScript (`tsconfig.json`)

**Configurações Principais**:

- **Target**: ES2020
- **Module**: CommonJS (compatível com Node.js)
- **Strict Mode**: Ativado (todas verificações rigorosas)
- **Output**: `./dist`
- **Root**: `./src`
- **Source Maps**: Habilitado

**Verificações Estritas Ativas**:

- `noImplicitAny`: Proíbe tipos `any` implícitos
- `strictNullChecks`: Tratamento rigoroso de null/undefined
- `noUnusedLocals`: Erro para variáveis não usadas
- `noUnusedParameters`: Erro para parâmetros não usados
- `noImplicitReturns`: Todos os caminhos devem retornar valor

---

### Prisma (`prisma/schema.prisma`)

**Generator**:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

Cliente Prisma é gerado em `src/generated/prisma/`.

**Datasource**:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Convenções**:

- Nomes de models em PascalCase (ex: `User`)
- Nomes de tabelas em snake_case (ex: `users`)
- IDs: UUID gerado automaticamente
- Timestamps automáticos: `createdAt`, `updatedAt`

---

### Express Server (`server.ts`)

**Middlewares Globais**:

1. `express.json()` - Parse de requisições JSON
2. `cors()` - Habilita CORS para todas as origens
3. `router` - Rotas da aplicação

**Error Handler Global**:

```typescript
app.use((error: Error, _, res: Response, next: NextFunction) => {
  if (error instanceof Error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: "Internal server error!" });
});
```

**Porta**:

- Padrão: `3333`
- Configurável via variável de ambiente `PORT`

---

### Variáveis de Ambiente (`.env`)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pizzaria?schema=public"

# JWT
JWT_SECRET="sua-chave-secreta-aqui"

# Server
PORT=3333

# Cloudinary
CLOUDINARY_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"
```

**Variáveis Obrigatórias**:

- `DATABASE_URL`: String de conexão PostgreSQL
- `JWT_SECRET`: Chave secreta para assinar tokens JWT
- `CLOUDINARY_NAME`: Nome do cloud Cloudinary
- `CLOUDINARY_API_KEY`: Chave da API Cloudinary
- `CLOUDINARY_API_SECRET`: Secret da API Cloudinary

---

### Scripts NPM (`package.json`)

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

**Comando de Desenvolvimento**:

```bash
npm run dev
```

- Executa servidor com hot-reload
- Usa `tsx` para executar TypeScript diretamente

**Comandos Prisma**:

```bash
# Criar migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações
npx prisma migrate deploy

# Abrir Prisma Studio
npx prisma studio

# Gerar Prisma Client
npx prisma generate
```

---

## 🔐 Segurança

### Autenticação

- **JWT (JSON Web Tokens)** para autenticação stateless
- Tokens devem ser enviados no header: `Authorization: Bearer <token>`
- Token contém `user_id` no campo `sub`

### Autorização

- Sistema de roles: `STAFF` e `ADMIN`
- Rotas protegidas por middlewares `isAuthenticated` e `isAdmin`

### Criptografia

- **bcryptjs** com salt de 8 rounds para senhas
- Senhas nunca são retornadas nas respostas da API

### Validação

- **Zod** valida todos os inputs antes de chegarem à lógica de negócio
- Mensagens de erro customizadas e amigáveis

---

## 📝 Observações Importantes

1. **Preços em Centavos**: Todos os preços são armazenados como inteiros em centavos para evitar problemas com ponto flutuante.
   - Exemplo: R$ 35,00 = 3500

2. **UUIDs**: Todos os IDs são UUIDs v4 gerados automaticamente pelo Prisma.

3. **Timestamps Automáticos**: `createdAt` e `updatedAt` são gerenciados automaticamente pelo Prisma.

4. **Cascade Delete**: Deleções em cascata estão configuradas para manter integridade referencial.
   - Deletar Category → Deleta todos os Products relacionados
   - Deletar Product → Deleta todos os Items relacionados
   - Deletar Order → Deleta todos os Items relacionados

5. **Soft Delete em Produtos**: Produtos não são deletados fisicamente, apenas marcados como `disabled: true`.

6. **Fluxo de Pedidos**: 
   - Pedido criado → `draft: true`, `status: false` (Rascunho)
   - Pedido enviado → `draft: false`, `status: false` (Na cozinha)
   - Pedido finalizado → `draft: false`, `status: true` (Entregue)

7. **Error Handling**: Todos os erros são capturados pelo error handler global do Express.

8. **Type Safety**: TypeScript configurado no modo strict garante segurança de tipos em todo o código.

9. **Prisma Client Customizado**: Cliente gerado em `src/generated/prisma` para melhor organização.

10. **Autenticação JWT**: Tokens contêm `user_id` no campo `sub` e devem ser enviados no header `Authorization: Bearer <token>`.

11. **Roles de Usuário**:
    - `STAFF`: Acesso básico (gerenciar pedidos)
    - `ADMIN`: Acesso total (criar categorias e produtos)

12. **Upload de Imagens**: Imagens são armazenadas no Cloudinary, não localmente.

---

## 📦 Resumo de Controllers e Services

### Controllers

Controllers são responsáveis por receber requisições HTTP, extrair dados e delegar para os Services. Todos seguem o padrão:

```typescript
async handle(req: Request, res: Response) {
  // 1. Extrair dados de req.body, req.query ou req.params
  // 2. Instanciar o Service correspondente
  // 3. Chamar service.execute() com os dados
  // 4. Retornar resposta HTTP com res.json()
}
```

#### **User Controllers**

| Controller | Rota | Método | Descrição |
|------------|------|--------|-----------|
| CreateUserController | `/users` | POST | Cria novo usuário |
| AuthUserController | `/session` | POST | Autentica usuário e retorna token |
| DetailUserController | `/me` | GET | Retorna dados do usuário autenticado |

#### **Category Controllers**

| Controller | Rota | Método | Descrição |
|------------|------|--------|-----------|
| CreateCategoryController | `/category` | POST | Cria nova categoria (ADMIN) |
| ListCategoryController | `/category` | GET | Lista todas as categorias |

#### **Product Controllers**

| Controller | Rota | Método | Descrição |
|------------|------|--------|-----------|
| CreateProductController | `/product` | POST | Cria novo produto com imagem (ADMIN) |
| ListProductController | `/products` | GET | Lista produtos com filtro disabled |
| ListProductByCategoryController | `/category/product` | GET | Lista produtos de uma categoria |
| DeleteProductController | `/product` | DELETE | Desabilita um produto (ADMIN) |

#### **Order Controllers**

| Controller | Rota | Método | Descrição |
|------------|------|--------|-----------|
| CreateOrderController | `/order` | POST | Cria novo pedido |
| ListOrdersController | `/orders` | GET | Lista pedidos com filtro draft |
| DetailOrderController | `/order/detail` | GET | Retorna detalhes de um pedido |
| SendOrderController | `/order/send` | PUT | Envia pedido para cozinha |
| FinishOrderController | `/order/finish` | PUT | Finaliza um pedido |
| DeleteOrderController | `/order` | DELETE | Deleta um pedido |

#### **Item Controllers**

| Controller | Rota | Método | Descrição |
|------------|------|--------|-----------|
| AddItemController | `/order/add` | POST | Adiciona item ao pedido |
| RemoveItemController | `/order/remove` | DELETE | Remove item do pedido |

---

### Services

Services contêm toda a lógica de negócio e comunicação com o banco de dados. Todos seguem o padrão:

```typescript
async execute({ param1, param2 }: InterfaceProps) {
  try {
    // 1. Validar dados e regras de negócio
    // 2. Comunicar com banco via Prisma
    // 3. Retornar dados processados
  } catch (error) {
    // Tratamento de erro
    throw new Error("Mensagem descritiva");
  }
}
```

#### **User Services**

| Service | Responsabilidade |
|---------|------------------|
| CreateUserService | Valida email único, criptografa senha, cria usuário |
| AuthUserService | Valida credenciais, gera token JWT |
| DetailUserService | Busca dados do usuário por ID |

#### **Category Services**

| Service | Responsabilidade |
|---------|------------------|
| CreateCategoryService | Cria nova categoria no banco |
| ListCategoryService | Lista todas as categorias ordenadas |

#### **Product Services**

| Service | Responsabilidade |
|---------|------------------|
| CreateProductService | Valida categoria, faz upload da imagem, cria produto |
| ListProductService | Lista produtos com filtro disabled |
| ListProductByCategoryService | Valida categoria, lista produtos da categoria |
| DeleteProductService | Marca produto como disabled (soft delete) |

#### **Order Services**

| Service | Responsabilidade |
|---------|------------------|
| CreateOrderService | Cria novo pedido com status inicial |
| ListOrdersService | Lista pedidos com filtro draft |
| DetailOrderService | Busca pedido completo com itens e produtos |
| SendOrderService | Valida pedido, altera draft para false |
| FinishOrderService | Valida pedido, altera status para true |
| DeleteOrderService | Valida e deleta pedido (hard delete) |

#### **Item Services**

| Service | Responsabilidade |
|---------|------------------|
| AddItemOrderService | Valida pedido e produto, cria item |
| RemoveItemService | Valida e deleta item do pedido |

---

## 🗺️ Mapa Completo de Rotas

### Rotas Públicas (Sem Autenticação)

```
POST   /users     - Criar usuário
POST   /session   - Autenticar usuário
```

### Rotas Autenticadas (Requerem Token)

```
GET    /me                 - Detalhes do usuário autenticado
GET    /category           - Listar categorias
GET    /products           - Listar produtos
GET    /category/product   - Listar produtos por categoria
POST   /order              - Criar pedido
GET    /orders             - Listar pedidos
GET    /order/detail       - Detalhes do pedido
PUT    /order/send         - Enviar pedido para cozinha
PUT    /order/finish       - Finalizar pedido
DELETE /order              - Deletar pedido
POST   /order/add          - Adicionar item ao pedido
DELETE /order/remove       - Remover item do pedido
```

### Rotas Restritas (Requerem ADMIN)

```
POST   /category  - Criar categoria
POST   /product   - Criar produto
DELETE /product   - Deletar produto
```

---

## 🚀 Como Iniciar o Projeto

1. **Instalar dependências**:

```bash
npm install
```

2. **Configurar variáveis de ambiente**:

```bash
cp .env.example .env
# Editar .env com suas configurações
```

3. **Executar migrações**:

```bash
npx prisma migrate dev
```

4. **Iniciar servidor**:

```bash
npm run dev
```

5. **Servidor rodando em**: `http://localhost:3333`

---

**Documento gerado em**: 11/11/2025  
**Última atualização**: 12/02/2026  
**Versão do Projeto**: 1.0.0  

---

## 📚 Documentação Adicional

Para informações detalhadas sobre todos os endpoints, incluindo exemplos completos de requisições e respostas, consulte o arquivo **[endpoint.md](endpoint.md)**.
