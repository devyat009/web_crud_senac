# AppCrud

## Requisitos

- Node.js (recomendado versão 18 ou superior)
- npm (gerenciador de pacotes do Node.js)
- Angular CLI (instale globalmente com `npm install -g @angular/cli`)

## Como instalar e rodar o frontend

### 0. Clone o repositório
```bash
git clone <url-do-repositorio>
cd web_crud_senac
```

### 1. Instale as dependências do projeto:
   ```sh
   npm install
   ```

### 2. Inicie o servidor de desenvolvimento:
   ```sh
   npm start
   ```

### 3. Acesse o sistema no navegador:
   ```
   http://localhost:4200
   ```

## Rodando com SSR (Server Side Rendering)

Se desejar rodar o projeto com SSR (Angular Universal):

### 1. Gere o build SSR:
   ```sh
   npm run build
   ```

### 2. Inicie o servidor SSR:
   ```sh
   npm run serve:ssr:app-crud
   ```

### 3. Acesse no navegador:
   ```
   http://localhost:4000
   ```

---

> Projeto desenvolvido para fins de estudo e demonstração de CRUD com Angular.
