## 👥 Equipe

| RM | Nome | Função Principal |
| :--- | :--- | :--- |
| **560179** | Lucas da Ressurreição Barbosa | Java Backend & IoT Integration |
| **559210** | Ranaldo José da Silva | DevOps, QA & Mobile |
| **560694** | Fabrício José da Silva | Oracle Database & .NET |

# 💙 Aura Monitor - Bem-Estar Corporativo & IoT

**Aura Monitor** é uma solução mobile para monitoramento de bem-estar em ambientes de trabalho híbridos. O aplicativo integra check-ins de humor dos colaboradores com dados ambientais (IoT) em tempo real, permitindo que o RH e Gestores tomem decisões baseadas em dados para melhorar a qualidade de vida da equipe.

---

## 📱 Telas da Aplicação

Abaixo estão as prévias das principais funcionalidades do aplicativo.

### 1. Tela Inicial & Login
> Escolha entre acesso de Colaborador ou Gestor (RH).
<img width="890" height="485" alt="image" src="https://github.com/user-attachments/assets/1e00a320-88c0-4514-aff0-5feaae71469e" />
<img width="890" height="433" alt="image" src="https://github.com/user-attachments/assets/294f83fd-264a-4cc1-be9b-9fb2feacf73d" />



### 2. Home do Colaborador
> Visualização de dados IoT (Temperatura/Local) e último registro de humor.
<img width="890" height="589" alt="image" src="https://github.com/user-attachments/assets/05f1eaa9-e9b7-4f08-bfa9-09206cd01da5" />


### 3. Registro de Check-in
> Interface intuitiva para registrar o nível de estresse/felicidade e comentários.
<img width="890" height="432" alt="image" src="https://github.com/user-attachments/assets/be3107e5-3271-4d48-beb2-22e2d3fa8d0e" />


### 4. Portal do Gestor (RH)
> Lista completa de colaboradores, gestão de usuários e histórico de sentimentos da equipe.
<img width="890" height="379" alt="image" src="https://github.com/user-attachments/assets/ee1d5f91-17f3-4d87-9253-f40b89efbf64" />


---

## 🛠 Tecnologias Utilizadas

### Frontend (Mobile)
- **Framework:** [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
- **Linguagem:** TypeScript
- **Gerenciamento de Estado/Cache:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Navegação:** Expo Router
- **Estilização:** StyleSheet (Nativo)
- **Ícones:** Lucide React Native

### Backend (API)
- **Linguagem:** Java
- **Framework:** Spring Boot
- **Hospedagem:** Railway
- **Documentação:** Swagger / OpenAPI

---

## 🏗 Arquitetura do Projeto

O projeto segue uma arquitetura modular baseada em serviços para separar a lógica de negócio da interface do usuário.

```text
App-Aura-Monitor/
├── 📂 app/                 # Rotas e Telas (Expo Router)
│   ├── index.tsx           # Tela de Boas-vindas
│   ├── login.tsx           # Tela de Autenticação
│   ├── home.tsx            # Dashboard do Colaborador
│   ├── rh.tsx              # Dashboard do Gestor
│   └── ...
├── 📂 components/          # Componentes Reutilizáveis (UI)
│   ├── Card.tsx            # Widget IoT com tratamento de erro
│   ├── Header.tsx          # Cabeçalho com saudação e logout
│   ├── MoodSelector.tsx    # Seletor de Emojis
│   └── ...
├── 📂 services/            # Camada de Comunicação com API
│   ├── api.ts              # Instância do Axios com Interceptors
│   ├── autenticacao.ts     # Lógica de Login (Gestor vs Colaborador)
│   ├── dataService.ts      # CRUD de Usuários, Check-ins e IoT



## 🔌 Endpoints da API

O aplicativo consome uma API REST hospedada na Railway. Abaixo estão os principais endpoints integrados:

### Autenticação
| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/usuarios/login` | Login de Colaborador |
| `POST` | `/api/gestores/login` | Login de Gestor (RH) |

### Usuários
| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/usuarios/all` | Lista todos os colaboradores |
| `POST` | `/api/usuarios` | Cria um novo usuário |
| `PUT` | `/api/usuarios/{id}` | Atualiza dados do usuário |
| `DELETE` | `/api/usuarios/{id}` | Remove um usuário |

### Check-ins & IoT
| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/checkins` | Registra novo humor |
| `GET` | `/api/checkins` | Lista histórico de humor |
| `GET` | `/api/dados-iot` | Busca dados dos sensores em tempo real |

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- **Node.js** instalado.
- Gerenciador de pacotes (**npm** ou **yarn**).
- Aplicativo **Expo Go** no celular (Android/iOS) ou Emulador configurado.

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone [https://github.com/ranaldo-silva/App-Aura-Monitor.git]
   cd App-Aura-Monitor


Instale as dependências

Bash

npm install
Execute o projeto

Bash

npx expo start
Teste no Dispositivo

Celular: Escaneie o QR Code exibido no terminal com o app Expo Go.

Emulador Android: Pressione a no terminal.

Navegador (Web): Pressione w (⚠️ Nota: Para testar na Web, é necessário uma extensão para habilitar CORS, pois a API é externa).

🧪 Credenciais de Teste
Para testar as diferentes visões do sistema, você pode utilizar os usuários abaixo (se ainda existirem no banco) ou criar novos:

Gestor (Acesso RH):

Email: gestor@empresa.com

Senha: 123456

Colaborador (Acesso Padrão):

Email: colaborador@empresa.com

Senha: 123456

📄 Licença
Este projeto foi desenvolvido como parte de uma avaliação acadêmica (FIAP).


