# AWS Services Dashboard - Projeto Integrado

Este projeto é um painel interativo para gerenciamento e visualização de serviços AWS, com integração real de banco de dados MongoDB e validação de credenciais AWS.

## Tecnologias Utilizadas

- **Backend**: FastAPI (Python)
- **Frontend**: HTML, CSS, JavaScript (TailwindCSS para estilos)
- **Banco de Dados**: MongoDB (conectado via `pymongo`)
- **Autenticação**: JWT (JSON Web Tokens) com `python-jose`
- **Segurança**: `passlib` com `bcrypt` para hashing de senhas
- **Integração AWS**: `boto3` para validação de credenciais
- **Ambiente**: Variáveis de ambiente gerenciadas com `python-dotenv`

## Estrutura do Projeto Atualizada

```
projeto_automação/
├── backend/
│   ├── app/
│   │   ├── models/       # Modelos Pydantic (user.py)
│   │   ├── routes/       # Rotas da API (auth.py, aws.py)
│   │   ├── database.py   # Configuração da conexão MongoDB
│   │   └── security.py   # Funções de segurança e JWT
│   ├── main.py         # Ponto de entrada da aplicação FastAPI
│   └── requirements.txt # Dependências Python
├── css/                  # Arquivos CSS (Tailwind)
├── js/                   # Arquivos JavaScript do frontend
├── index.html            # Página principal do frontend
├── Dockerfile            # Configuração para container Docker
├── Jenkinsfile           # Configuração para pipeline CI/CD Jenkins
├── docker-compose.yml    # Configuração para Docker Compose
├── nginx.conf            # Configuração do Nginx (se aplicável)
├── README.md             # Este arquivo
└── venv/                 # Ambiente virtual Python (criado localmente)
```

## Funcionalidades Implementadas

- **Autenticação de Usuários**: Registro (signup) e login com persistência no MongoDB.
- **Autenticação JWT**: Geração e validação de tokens JWT para proteger rotas.
- **Validação de Credenciais AWS**: Rota para validar Access Key ID e Secret Access Key usando `boto3` (`sts:GetCallerIdentity`).
- **Integração MongoDB**: Conexão com banco de dados MongoDB Atlas (URI configurável).
- **Frontend Interativo**: Interface para cadastro, login e (futuramente) interação com serviços AWS.
- **Simulação de Serviços AWS**: Rotas que simulam a listagem de serviços (Lambda, EC2, S3, DynamoDB) - *Nota: a listagem real não foi implementada nesta fase.*

## Configuração e Execução

### Pré-requisitos

- Python 3.11 ou superior
- Acesso a um cluster MongoDB (local ou Atlas)

### Backend

1.  **Clone o repositório** (se aplicável) ou descompacte o projeto.
2.  **Navegue até o diretório raiz** do projeto (`projeto_automação`).
3.  **Crie e ative um ambiente virtual**:
    ```bash
    python3.11 -m venv venv
    source venv/bin/activate  # Linux/Mac
    # venv\Scripts\activate    # Windows
    ```
4.  **Instale as dependências** (incluindo `boto3`):
    ```bash
    pip install -r backend/requirements.txt
    ```
5.  **Configure as variáveis de ambiente**: Crie um arquivo `.env` dentro do diretório `backend/` com o seguinte conteúdo, substituindo os valores conforme necessário:
    ```dotenv
    # MongoDB Connection
    MONGO_URI="mongodb+srv://Sergio-sena:Allsena161289@projeto-devops.0jpevmh.mongodb.net/"
    # O nome do banco de dados ('projeto_devops_db') está definido em backend/app/database.py

    # JWT Settings
    JWT_SECRET_KEY="minha_chave_secreta" # Chave secreta definida
    # ALGORITHM="HS256" (Padrão definido em security.py)
    # ACCESS_TOKEN_EXPIRE_MINUTES=30 (Padrão definido em security.py)
    ```
6.  **Inicie o servidor FastAPI/Uvicorn** a partir do diretório `backend/`:
    ```bash
    cd backend
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
    O backend estará acessível em `http://localhost:8000`.

### Frontend

1.  O frontend é composto por arquivos estáticos (HTML, CSS, JS).
2.  Para testar localmente, você pode usar um servidor HTTP simples a partir do diretório raiz (`projeto_automação`):
    ```bash
    python3.11 -m http.server 8080
    ```
3.  Acesse o frontend em `http://localhost:8080` no seu navegador.
    *Nota: Certifique-se de que o backend esteja rodando na porta 8000, pois o frontend fará requisições para essa porta.*.

## Endpoints da API Atualizados

| Rota                               | Método | Descrição                                                                 | Autenticação Requerida |
|------------------------------------|--------|---------------------------------------------------------------------------|------------------------|
| `/`                                | GET    | Rota raiz, verifica se a API está online                                  | Não                    |
| `/api/signup`                      | POST   | Registrar novo usuário no MongoDB                                         | Não                    |
| `/api/login`                       | POST   | Autenticar usuário e obter token JWT                                      | Não                    |
| `/api/me`                          | GET    | Obter dados do usuário autenticado                                        | Sim (JWT Bearer)       |
| `/api/aws/credentials/validate`    | POST   | Validar credenciais AWS (Access Key ID, Secret Access Key) usando `boto3` | Sim (JWT Bearer)       |
| `/api/aws/lambda`                  | GET    | **Simulação**: Listar funções Lambda                                      | Sim (JWT Bearer)       |
| `/api/aws/ec2`                     | GET    | **Simulação**: Listar instâncias EC2                                      | Sim (JWT Bearer)       |
| `/api/aws/s3`                      | GET    | **Simulação**: Listar buckets S3                                          | Sim (JWT Bearer)       |
| `/api/aws/dynamodb`                | GET    | **Simulação**: Listar tabelas DynamoDB                                    | Sim (JWT Bearer)       |

### Exemplo de Validação de Credenciais AWS

**Requisição:**
```bash
curl -X POST http://localhost:8000/api/aws/credentials/validate \
-H "Authorization: Bearer SEU_TOKEN_JWT" \
-H "Content-Type: application/json" \
-d 
  "accessKeyId": "SUA_ACCESS_KEY_ID",
  "secretAccessKey": "SUA_SECRET_ACCESS_KEY"
}
```

**Resposta (Sucesso):**
```json
{
  "message": "Credenciais AWS válidas!",
  "isValid": true
}
```

**Resposta (Falha):**
```json
{
  "message": "Credenciais AWS inválidas: An error occurred (...): The security token included in the request is invalid.",
  "isValid": false
}
```

## Segurança

- **Hashing de Senhas**: Utiliza `bcrypt` através da biblioteca `passlib`.
- **Autenticação JWT**: Tokens assinados com HS256 e chave secreta configurável.
- **Proteção de Rotas**: Rotas sensíveis são protegidas e requerem um token JWT válido.
- **CORS**: Configurado para permitir requisições de qualquer origem (`*`) para desenvolvimento. **Em produção, restrinja as origens permitidas.**
- **Variáveis de Ambiente**: Dados sensíveis (URI do MongoDB, chave secreta JWT) são carregados de um arquivo `.env`.

## Próximos Passos e Melhorias

- Implementar a listagem real dos serviços AWS (Lambda, EC2, S3, DynamoDB) usando `boto3` após a validação das credenciais.
- Armazenar as credenciais AWS validadas de forma segura associadas ao usuário (ex: no MongoDB, criptografadas).
- Implementar refresh tokens para uma sessão mais longa e segura.
- Adicionar testes automatizados (unitários e de integração).
- Melhorar o tratamento de erros e feedback no frontend.
- Refinar a interface do usuário e a experiência.

