from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional

# Importações centralizadas
from app.database import get_database
from app.security import (create_access_token, verify_password, 
                          get_password_hash, verify_token, TokenData, 
                          ACCESS_TOKEN_EXPIRE_MINUTES)
from app.models.user import UserCreate, UserInDB, UserResponse
from datetime import timedelta
from bson import ObjectId # Para converter ObjectId do MongoDB

router = APIRouter()

# Configuração do OAuth2 - Aponta para a rota de login correta
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class Token(BaseModel):
    access_token: str
    token_type: str

# Função auxiliar para buscar usuário no DB
def get_user_by_username_from_db(username: str):
    db = get_database()
    user = db.users.find_one({"username": username})
    return user

# Função auxiliar para buscar usuário por email no DB
def get_user_by_email_from_db(email: str):
    db = get_database()
    user = db.users.find_one({"email": email})
    return user

# Função auxiliar para criar usuário no DB
def create_user_in_db(user_data: UserInDB):
    db = get_database()
    user_dict = user_data.model_dump() # Usar model_dump() em Pydantic V2
    result = db.users.insert_one(user_dict)
    created_user = db.users.find_one({"_id": result.inserted_id})
    return created_user

# Função para autenticar usuário (verifica username e senha)
def authenticate_user(username: str, password: str):
    user = get_user_by_username_from_db(username)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

# Dependência para obter o usuário atual a partir do token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token_data = verify_token(token, credentials_exception)
    except Exception as e: # Captura exceções mais genéricas se necessário
         raise credentials_exception

    user = get_user_by_username_from_db(token_data.username)
    if user is None:
        raise credentials_exception
    # Converte ObjectId para string antes de retornar
    user["_id"] = str(user["_id"])
    return user

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nome de usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    # Verifica se o usuário já existe
    db_user_by_username = get_user_by_username_from_db(user.username)
    if db_user_by_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nome de usuário já registrado")

    db_user_by_email = get_user_by_email_from_db(user.email)
    if db_user_by_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email já registrado")

    # Cria o hash da senha
    hashed_password = get_password_hash(user.password)

    # Cria o usuário no banco
    user_in_db = UserInDB(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )

    created_user = create_user_in_db(user_in_db)

    # Retorna os dados do usuário criado (sem o token aqui, o login é separado)
    return {
        "id": str(created_user["_id"]),
        "username": created_user["username"],
        "email": created_user["email"]
        # "token": access_token # Token é obtido na rota /login
    }

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user = Depends(get_current_user)):
    # current_user já vem com _id como string da dependência
    return {
        "id": current_user["_id"],
        "username": current_user["username"],
        "email": current_user["email"]
    }

