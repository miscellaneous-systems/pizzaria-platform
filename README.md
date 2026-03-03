# Pizzaria

Sistema completo para gestão de uma pizzaria: pedidos por mesa, cardápio com categorias e produtos, controle de usuários (admin e staff) e autenticação. Projeto em monorepo com **frontend web** (Next.js), **backend** (Express + Prisma) e **app mobile** (Expo / React Native).

---

## Estrutura do projeto

```
Pizzaria/
├── frontend/     # Aplicação web (Next.js)
├── backend/      # API REST (Express + Prisma)
├── mobile/       # App mobile (Expo / React Native)
└── README.md
```

---

## Funcionalidades

### Backend (API)
- **Usuários:** registro, login (JWT), perfil; roles `ADMIN` e `STAFF`
- **Categorias:** listagem e criação (admin)
- **Produtos:** listagem, listagem por categoria, criação com upload de imagem (Cloudinary), exclusão (admin)
- **Pedidos:** criar pedido, adicionar/remover itens, detalhe do pedido, enviar para cozinha, finalizar pedido, listar e excluir pedidos
- Autenticação via JWT, validação com Zod, upload de imagens com Multer + Cloudinary
- Banco de dados PostgreSQL com Prisma ORM

### Frontend web
- Login e registro
- Dashboard com gestão de **categorias** e **produtos**
- Controle de **pedidos** (mesas, itens, status)
- Interface com Next.js 16, React 19, Tailwind CSS e componentes (shadcn/Radix UI)
- Acesso restrito por role (ex.: acesso negado para não-admin onde aplicável)

### Mobile
- Login e fluxo autenticado (Expo Router)
- Dashboard, tela de pedido e finalização
- Navegação com Expo Router; consumo da mesma API do backend
- React Native + Expo, suporte a Android, iOS e web

---

## Tecnologias

| Parte     | Stack principal |
|----------|------------------|
| Frontend | Next.js 16, React 19, Tailwind CSS, shadcn/Radix UI, Lucide Icons |
| Backend  | Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT (jsonwebtoken), bcryptjs, Zod, Multer, Cloudinary |
| Mobile   | Expo (SDK 54), React Native, Expo Router, React Navigation, Axios |

---

## Pré-requisitos

- Node.js (recomendado LTS)
- PostgreSQL (para o backend)
- Conta no [Cloudinary](https://cloudinary.com) (upload de imagens dos produtos)
- Para mobile: Android Studio e/ou Xcode (emuladores) ou Expo Go no celular

---

## Como rodar

### 1. Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend` com as variáveis necessárias (ex.: `DATABASE_URL`, segredo JWT, configurações Cloudinary). Exemplo:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/pizzaria"
JWT_SECRET="seu-segredo-jwt"
# Variáveis do Cloudinary (cloud_name, api_key, api_secret)
```

Gere o cliente Prisma e aplique as migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Inicie o servidor:

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3001` (ou na porta configurada no `server.ts`).

### 2. Frontend

```bash
cd frontend
npm install
```

Crie/ajuste o `.env` (ou `.env.local`) com a URL da API:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
API_URL=http://localhost:3001
```

Inicie o projeto:

```bash
npm run dev
```

Acesse no navegador em `http://localhost:3000`.

### 3. Mobile

```bash
cd mobile
npm install
```

Configure a URL da API no código (ou via variável de ambiente) apontando para o backend (em desenvolvimento use o IP da máquina na rede para dispositivo físico, ex.: `http://192.168.x.x:3001`).

Inicie o Expo:

```bash
npm start
```

Use as opções no terminal para abrir em Android, iOS ou web.


## Licença

ISC (conforme definido no projeto).
