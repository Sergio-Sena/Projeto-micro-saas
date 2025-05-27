from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, aws
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# Inicializa a aplicação FastAPI
app = FastAPI(
    title="AWS Services Dashboard",
    description="API para gerenciamento de serviços AWS",
    version="1.0.0"
)

# Lista de origens permitidas (incluindo a URL pública do frontend)
origins = [
    "https://8080-i73u6u34plo4hby0xo8fx-bc096365.manusvm.computer",
    # Adicione outras origens se necessário (ex: http://localhost:8080 para teste local)
]

# Configuração CORS atualizada
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Usar a lista de origens específicas
    allow_credentials=True,
    allow_methods=["*"], # Permitir todos os métodos (GET, POST, etc.)
    allow_headers=["*"], # Permitir todos os cabeçalhos
)

# Inclusão de rotas
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(aws.router, prefix="/api/aws", tags=["aws"])

@app.get("/")
def read_root():
    return {"message": "AWS Services Dashboard API", "status": "online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

