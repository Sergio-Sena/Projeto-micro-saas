from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://Sergio-sena:Allsena161289@projeto-devops.0jpevmh.mongodb.net/")
DB_NAME = "projeto_devops_db" # Nome sugerido para o banco de dados, pode ser ajustado

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_database():
    return db

# Função para testar a conexão (opcional, mas útil)
def test_connection():
    try:
        client.admin.command('ping')
        print("Conexão com MongoDB estabelecida com sucesso!")
        return True
    except Exception as e:
        print(f"Erro ao conectar ao MongoDB: {e}")
        return False

# Testa a conexão ao iniciar o módulo
# test_connection()

