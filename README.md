# 🚀 Projeto Fullstack

## 📋 Sobre

Projeto fullstack desenvolvido com **ASP.NET Core 8** e **React**, orquestrado com **Docker Compose** para facilitar o desenvolvimento e deploy.

## 🛠️ Stack Tecnológica

### Backend
- **ASP.NET Core 8** - Web API
- **PostgreSQL** - Banco de dados

### Frontend
- **React** - Interface do usuário
- **Vite** - Build tool

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração

## ⚡ Como Executar

### Pré-requisitos
- Docker Desktop
- Git

### Passos
1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/meu-projeto.git
   cd meu-projeto
   ```

2. **Execute com Docker Compose**
   ```bash
   docker-compose up --build
   ```

## 🌐 Acessos

Após a execução, acesse:

- **Frontend**: http://localhost:3000
- **Backend (Swagger)**: http://localhost:5000/swagger
- **PostgreSQL**: localhost:5432

## 📁 Estrutura do Projeto

```
projeto-senac-csharp/
├── backend/                 # API ASP.NET Core 8
│   ├── Controllers/
│   ├── MinhaApi.csproj
│   └── Dockerfile
├── frontend/                # App React + Vite
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml       # Orquestração Docker
└── README.md
```

## 🔧 Configuração Docker

- **`docker-compose.yml`** - Orquestra todos os serviços
- **`backend/Dockerfile`** - Build da API
- **`frontend/Dockerfile`** - Build do React