# Tech Challenge — Gerenciamento Financeiro

Aplicação móvel de gerenciamento financeiro desenvolvida em **React Native (Expo)**, com arquitetura refatorada seguindo os princípios de **Clean Architecture**, **SOLID**, **DRY**, **KISS** e **YAGNI**.

---

## 📱 Funcionalidades

- **Dashboard**: Saldo atual, total de receitas e despesas, gráfico de evolução do saldo e distribuição de gastos por categoria.
- **Extrato**: Listagem com scroll infinito, busca por texto e filtro por categoria.
- **Gestão**: Adicionar e editar transações com categorias padronizadas via Picker.
- **Comprovantes**: Upload de recibos integrado ao Firebase Storage.
- **Autenticação**: Login e Registro com validação de e-mail, senha e confirmação de senha.

---

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture**, com separação clara de responsabilidades em camadas:

```
src/
├── core/                    # Constantes, erros e utilitários globais
│   ├── constants/           # Paleta de cores centralizada, lista de categorias
│   ├── errors/              # Hierarquia de erros tipados (AppError, AuthError, etc.)
│   └── utils/               # Formatadores (moeda, data) e validadores de input
│
├── domain/                  # Lógica de negócio pura (sem dependências externas)
│   ├── entities/            # Entidade Transaction
│   ├── repositories/        # Interfaces/contratos (ITransactionRepository, IAuthRepository)
│   └── usecases/            # Casos de uso (AddTransaction, SignIn, GetDashboardData, etc.)
│
├── data/                    # Implementações concretas de acesso a dados
│   ├── datasources/         # FirebaseTransactionDataSource, FirebaseAuthDataSource
│   ├── models/              # TransactionModel (mapeamento Firestore ↔ Entidade)
│   └── repositories/        # TransactionRepositoryImpl, AuthRepositoryImpl
│
├── infrastructure/          # Serviços técnicos de infraestrutura
│   ├── cache/               # CacheService (AsyncStorage + TTL configurável)
│   └── security/            # EncryptionService (XOR cipher para dados em cache)
│
├── presentation/            # Camada de UI
│   ├── components/
│   │   ├── common/          # Button, Input, LoadingSpinner, EmptyState
│   │   └── business/        # TransactionCard, BalanceCard, CategoryChip
│   ├── contexts/            # AuthContext, TransactionContext (com DI manual)
│   ├── hooks/               # useAuth, useTransactions, useDashboard
│   └── screens/             # LoginScreen, DashboardScreen, TransactionsScreen, AddTransactionScreen
│
├── services/                # Serviços auxiliares (uploadService)
└── config/                  # Configuração do Firebase
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native (Expo) | ~50.0.14 | Framework mobile |
| Firebase Auth | ^10.10.0 | Autenticação de usuários |
| Firebase Firestore | ^10.10.0 | Banco de dados NoSQL |
| Firebase Storage | ^10.10.0 | Upload de comprovantes |
| React Navigation | ^6.x | Navegação Stack + Bottom Tabs |
| AsyncStorage | 1.21.0 | Cache local persistente |
| React Native Chart Kit | ^6.4.1 | Gráficos (Line + Pie) |
| expo-image-picker | ~14.7.1 | Seleção de imagens da galeria |
| @react-native-picker/picker | 2.6.1 | Seletor de categorias |

---

## ⚡ Performance e Otimização

- **Cache com TTL**: Dados do dashboard são cacheados por 5 minutos via `AsyncStorage`, evitando requisições desnecessárias ao Firestore.
- **Invalidação de cache**: Cache é automaticamente invalidado ao adicionar ou editar uma transação.
- **useMemo e useCallback**: Aplicados nos Contexts e Hooks para evitar re-renders desnecessários.
- **Filtros reativos**: Filtros de categoria e busca por texto são aplicados localmente (sem nova requisição ao servidor).
- **Scroll infinito**: Paginação por cursor no extrato de transações.

---

## 🔐 Segurança

- **Autenticação Firebase**: Gerenciada pelo Firebase Authentication com persistência de sessão via AsyncStorage.
- **Criptografia de cache**: Dados sensíveis armazenados localmente são criptografados com `EncryptionService` (cifra XOR com chave derivada) antes de serem gravados no AsyncStorage.
- **Erros tipados**: Mensagens de erro do Firebase são traduzidas para português e expostas de forma segura sem vazar informações internas.
- **Validação de inputs**: Todos os campos são validados antes de qualquer operação (e-mail, senha, valor, campos obrigatórios).
- **Variáveis de ambiente**: Credenciais do Firebase são lidas de variáveis de ambiente via arquivo `.env` (nunca hardcoded).

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [Expo CLI](https://docs.expo.dev/get-started/installation/) instalado globalmente
- Conta no [Firebase](https://console.firebase.google.com/) configurada

### Instalação

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>

# 2. Instale as dependências
npm install
```

### Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Habilite **Authentication** → E-mail/Senha.
3. Habilite **Firestore Database** e crie o índice composto:
   - Coleção: `transactions` | Campos: `userId (ASC)`, `createdAt (DESC)`
   - Coleção: `transactions` | Campos: `userId (ASC)`, `date (ASC)`
4. Habilite **Storage**.
5. Vá em **Configurações do Projeto** → **Geral** → **Adicionar app (Web)** e copie as credenciais.
6. Crie o arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

### Executando

```bash
npx expo start
```

- Pressione `a` para Android (emulador ou dispositivo físico)
- Pressione `i` para iOS (apenas macOS)
- Pressione `w` para Web
- Escaneie o QR Code com o app **Expo Go** no seu celular

---

## 📁 Observações

> **Firebase Storage no plano gratuito:** O upload de imagens pode falhar em algumas regiões. O app possui mecanismo de _fallback_ que salva um link placeholder caso o Storage negue a gravação, garantindo que o fluxo não seja interrompido.

> **Índices do Firestore:** Ao rodar pela primeira vez, o Firestore pode solicitar a criação de índices compostos. Os links para criação automática aparecerão no console do Metro Bundler.
