# Vet_Clin - Sistema de Gestão para Clínicas Veterinárias

**Versão atual: 1.0.0**

Um sistema completo de gestão para clínicas veterinárias desenvolvido em React com TypeScript e integração com Firebase.

Acesse o repositório oficial em: [https://github.com/Masterluke99/Vet_clin](https://github.com/Masterluke99/Vet_clin)

## Sobre o Projeto

Vet_Clin é uma aplicação web que permite gerenciar todos os aspectos de uma clínica veterinária, incluindo:

- Cadastro de animais e seus tutores
- Agendamento e registro de atendimentos com seleção múltipla de serviços
- Histórico médico dos pacientes
- Controle de produtos e estoque
- Registro de vendas com cálculo automático de valores
- Cadastro de serviços
- Gestão de funcionários

Este projeto foi criado com [Create React App](https://github.com/facebook/create-react-app).

## Capturas de Tela

Abaixo estão capturas de tela das principais funcionalidades do sistema:

### Painel de Gestão

![Painel de Gestão](https://raw.githubusercontent.com/Masterluke99/Vet_clin/master/screenshots/painel%20de%20gestão.png)

### Cadastro de Animais

![Cadastro de Animais](https://raw.githubusercontent.com/Masterluke99/Vet_clin/master/screenshots/cadastro%20de%20animais.png)

### Cadastro de Tutores

![Cadastro de Tutores](https://raw.githubusercontent.com/Masterluke99/Vet_clin/master/screenshots/cadastro%20de%20tutores.png)

### Registro de Serviços

![Registro de Serviços](https://raw.githubusercontent.com/Masterluke99/Vet_clin/master/screenshots/registro%20de%20serviços.png)

### Atendimentos

![Atendimentos](https://raw.githubusercontent.com/Masterluke99/Vet_clin/master/screenshots/atendimentos.png)

## Melhorias Recentes

Na versão 1.0.0, foram implementadas as seguintes melhorias:

- **Seleção múltipla de serviços**: Agora é possível selecionar vários serviços em um único atendimento, facilitando o registro de procedimentos complexos.
- **Cálculo automático de valores**: O sistema calcula automaticamente o valor total com base nos serviços selecionados.
- **Melhor tratamento de valores numéricos**: Todos os campos numéricos e valores monetários são tratados com maior precisão.
- **Interface mais intuitiva**: Checkboxes para seleção de múltiplos serviços e melhor visualização dos itens selecionados.

## Configuração do Banco de Dados (Firebase)

O gerenciamento dos dados é feito pelo Firebase. Para configurar o projeto, siga os passos abaixo:

1. Crie uma conta no [Firebase](https://firebase.google.com/) se ainda não tiver
2. Acesse o [Console do Firebase](https://console.firebase.google.com/) e crie um novo projeto
3. No projeto criado, ative o serviço Firestore Database em "Build > Firestore Database"
4. Ative também o serviço Authentication em "Build > Authentication" se necessário
5. Vá para "Project Settings" (configurações do projeto) clicando na engrenagem
6. Em "Your apps", adicione um aplicativo da web (</> Web)
7. Registre seu aplicativo com um nome e copie as credenciais fornecidas
8. No projeto Vet_Clin, atualize o arquivo `src/firebaseConfig.ts` com as credenciais copiadas:

```typescript
// Substitua pelos dados do seu projeto Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX" // opcional
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const db = getFirestore(app);

export { db, database };
```

Após a configuração, o aplicativo criará e gerenciará os dados automaticamente, sem necessidade de criar tabelas manualmente.

Certifique-se de que as dependências do Firebase estão instaladas executando:

```bash
npm install firebase
```

## Tecnologias Utilizadas

- **Frontend**: 
  - React 18.2.0
  - TypeScript 4.9.5
  - Chakra UI 2.8.0 (componentes e estilização)
  - Material-UI 5.14.18 (componentes adicionais)
  - React Router Dom 6.18.0 (navegação)
  
- **Backend e Banco de Dados**:
  - Firebase 10.5.2
  - Firestore (banco de dados NoSQL)
  - Firebase Authentication (autenticação de usuários)
  
- **Ferramentas de Desenvolvimento**:
  - Create React App
  - ESLint (linting de código)
  - Git e GitHub (controle de versão)

## Instalação e Execução

Para começar a usar o Vet_Clin em seu ambiente de desenvolvimento, siga estas etapas:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/Masterluke99/Vet_clin.git
   cd Vet_clin
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure o Firebase**:
   - Crie um projeto no Firebase conforme descrito na seção "Configuração do Banco de Dados"
   - Adicione suas credenciais no arquivo `src/firebaseConfig.ts`

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm start
   ```

5. **Acesse a aplicação**:
   Abra seu navegador em [http://localhost:3000](http://localhost:3000)

## Comandos Disponíveis

Na pasta do projeto você pode executar:

### `npm start`

Executa o aplicativo no modo de desenvolvimento.\
Abra [http://localhost:3000](http://localhost:3000) no navegador.

### `npm test`

Inicia o executor de testes no modo de observação interativa.

### `npm run build`

Compila o aplicativo para produção na pasta `build`.\
O aplicativo estará otimizado para melhor desempenho.

## Como Contribuir

Contribuições são sempre bem-vindas! Se você quiser contribuir com este projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua funcionalidade (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

---

Desenvolvido por [Masterluke99](https://github.com/Masterluke99) - 2025
