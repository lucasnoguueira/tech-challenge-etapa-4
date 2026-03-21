# Tech Challenge - Gerenciamento Financeiro

Este projeto é uma aplicação móvel de gerenciamento financeiro desenvolvida em **React Native (Expo)** como parte da avaliação da fase.

## 📱 Funcionalidades

- **Dashboard**: Visualização de gráficos de receitas/despesas e saldo atual.
- **Transações**: Listagem com scroll infinito, filtros por data/categoria.
- **Gestão**: Adicionar e editar transações.
- **Comprovantes**: Upload de recibos/imagens integrado ao Firebase Storage.
- **Autenticação**: Login e Registro de usuários.

## 🛠 Tecnologias Utilizadas

- **React Native** (via Expo Framework)
- **Firebase** (Authentication, Firestore Database, Storage)
  > **Nota sobre o Storage:** Devido a restrições de plano gratuito em algumas regiões do Google Cloud, o upload de imagens pode falhar. O projeto possui um mecanismo de _fallback_ que salva um link de imagem temporário caso o serviço de Storage negue a gravação, garantindo que o fluxo da aplicação não seja interrompido.
- **Context API** (Gerenciamento de Estado)
- **React Navigation** (Navegação Stack e Tabs)
- **React Native Chart Kit** (Gráficos)
- **Animated API** (Animações)

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js instalado.
- Conta no Firebase configurada.

### Instalação

1. Clone o repositório ou baixe o código fonte.
2. Instale as dependências:
   ```bash
   npm install
   ```

### Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Habilite o **Authentication** (Email/Password).
3. Habilite o **Firestore Database** (crie as regras de segurança apropriadas).
4. Habilite o **Storage** (para upload de imagens).
5. Vá em "Configurações do Projeto" -> "Geral" -> "Adicionar app" (Web).
6. Copie as configurações do SDK.
7. Crie um arquivo `src/config/firebaseConfig.js` (ou use o existente) e cole suas chaves:

```javascript
// src/config/firebaseConfig.js
export const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
};
```

### Executando

Inicie o servidor de desenvolvimento:

```bash
npx expo start
```

- Pressione `a` para abrir no emulador Android.
- Pressione `i` para abrir no simulador iOS (apenas macOS).
- Pressione `w` para abrir no navegador.
- Ou leia o QR Code com o aplicativo **Expo Go** no seu celular físico.
