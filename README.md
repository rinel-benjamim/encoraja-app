# Encoraja - Um Abraço que se Espalha

Uma plataforma web acolhedora para criar e compartilhar cartões digitais motivacionais. Espalhe esperança e encorajamento com mensagens personalizadas.

## Funcionalidades

- **Criação de Cartões:** Editor intuitivo com escolha de fundo, fontes e cores.
- **Upload de Imagens:** Personalize seus cartões com suas próprias fotos.
- **Galeria de Inspiração:** Frases e imagens pré-selecionadas para facilitar a criação.
- **Compartilhamento:** Links públicos para compartilhar seus cartões via WhatsApp ou redes sociais.
- **Dashboard:** Gerencie seus cartões criados.
- **Autenticação:** Login seguro e persistente.

## Configuração do Projeto

### Pré-requisitos

- Node.js 18+
- Conta no Firebase (Gratuita)

### Configuração do Firebase

1. Crie um projeto no [Console do Firebase](https://console.firebase.google.com/).
2. Ative o **Authentication** (Email/Senha).
3. Crie um banco de dados no **Firestore** (modo produção).
   - Regras de segurança básicas para começar:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /cards/{card} {
           allow read: if true;
           allow create: if request.auth != null;
           allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
         }
       }
     }
     ```
4. Ative o **Storage**.
   - Regras de segurança básicas:
     ```
     rules_version = '2';
     service firebase.storage {
       match /b/{bucket}/o {
         match /{allPaths=**} {
           allow read: if true;
           allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024 && request.resource.contentType.matches('image/.*');
         }
       }
     }
     ```
5. Copie as credenciais do seu app Web e adicione ao arquivo `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=seu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### Instalação e Execução

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Deploy na Vercel

Este projeto é otimizado para deploy na Vercel.

1. Faça o push do código para um repositório Git (GitHub, GitLab, etc).
2. Importe o projeto na Vercel.
3. Adicione as variáveis de ambiente do Firebase nas configurações do projeto na Vercel.
4. O deploy será automático.

## Notas sobre Storage

O projeto utiliza **Firebase Storage** para persistência de imagens. Embora o armazenamento local seja possível em desenvolvimento, ele não persiste em ambientes serverless como a Vercel. O Firebase Storage garante que suas imagens fiquem seguras e acessíveis permanentemente.
