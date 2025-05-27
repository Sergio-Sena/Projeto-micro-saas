from fastapi import APIRouter, Depends, HTTPException, status
# Removido import desnecessário de app.auth.auth
from app.routes.auth import get_current_user # Importar da rota auth correta
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from dotenv import load_dotenv
import boto3
from botocore.exceptions import ClientError, NoCredentialsError

load_dotenv()

router = APIRouter()

# Modelos de dados para AWS
class AWSCredentials(BaseModel):
    accessKeyId: str = Field(..., alias="accessKeyId")
    secretAccessKey: str = Field(..., alias="secretAccessKey")
    # Adicionar região opcionalmente, se necessário para validação
    # region: Optional[str] = None

class AWSValidationResponse(BaseModel):
    message: str
    isValid: bool

# --- Modelos de dados para serviços AWS (mantidos como simulação por enquanto) ---
class LambdaFunction(BaseModel):
    name: str
    runtime: str
    memory: int
    lastModified: str

class EC2Instance(BaseModel):
    name: str
    id: str
    type: str
    state: str
    publicIp: Optional[str] = None

class S3Bucket(BaseModel):
    name: str
    creationDate: str
    region: str

class DynamoDBTable(BaseModel):
    name: str
    status: str
    itemCount: int
# --- Fim dos modelos de simulação ---

# Rota para validar credenciais AWS
@router.post("/credentials/validate", response_model=AWSValidationResponse)
async def validate_aws_credentials(credentials: AWSCredentials, current_user = Depends(get_current_user)):
    """Valida as credenciais AWS fornecidas usando STS GetCallerIdentity."""
    try:
        # Tenta criar um cliente STS com as credenciais fornecidas
        sts_client = boto3.client(
            'sts',
            aws_access_key_id=credentials.accessKeyId,
            aws_secret_access_key=credentials.secretAccessKey,
            # region_name=credentials.region # Descomentar se a região for necessária
        )
        # Chama GetCallerIdentity para validar as credenciais
        sts_client.get_caller_identity()
        # Se a chamada for bem-sucedida, as credenciais são válidas
        # Aqui você poderia salvar as credenciais associadas ao usuário no DB
        # Ex: db.users.update_one({"username": current_user["username"]}, {"$set": {"aws_credentials": credentials.dict()}})
        return {"message": "Credenciais AWS válidas!", "isValid": True}

    except (ClientError, NoCredentialsError) as e:
        # Erros comuns indicam credenciais inválidas
        error_message = f"Credenciais AWS inválidas: {e}"
        # Logar o erro real pode ser útil para depuração
        # print(f"AWS Validation Error: {e}")
        # Não lançar HTTPException aqui, retornar isValid: False para o frontend tratar
        return {"message": error_message, "isValid": False}
    except Exception as e:
        # Captura outros erros inesperados
        # print(f"Unexpected AWS Validation Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro inesperado ao validar credenciais AWS: {e}"
        )

# --- Rotas de simulação de serviços AWS (mantidas por enquanto) ---
@router.get("/lambda", response_model=List[LambdaFunction], dependencies=[Depends(get_current_user)])
async def get_lambda_functions():
    # Simulação
    lambda_functions = [
        {"name": "api-handler", "runtime": "nodejs14.x", "memory": 128, "lastModified": "2023-05-15"},
        {"name": "image-processor", "runtime": "python3.9", "memory": 256, "lastModified": "2023-05-10"},
    ]
    return lambda_functions

@router.get("/ec2", response_model=List[EC2Instance], dependencies=[Depends(get_current_user)])
async def get_ec2_instances():
    # Simulação
    ec2_instances = [
        {"name": "Web Server", "id": "i-1234567890abcdef0", "type": "t2.micro", "state": "running", "publicIp": "54.123.45.67"},
        {"name": "Database", "id": "i-0987654321fedcba0", "type": "t3.small", "state": "stopped", "publicIp": None},
    ]
    return ec2_instances

@router.get("/s3", response_model=List[S3Bucket], dependencies=[Depends(get_current_user)])
async def get_s3_buckets():
    # Simulação
    s3_buckets = [
        {"name": "my-website-bucket", "creationDate": "2023-01-15", "region": "us-east-1"},
        {"name": "data-backup-bucket", "creationDate": "2023-02-20", "region": "us-west-2"},
    ]
    return s3_buckets

@router.get("/dynamodb", response_model=List[DynamoDBTable], dependencies=[Depends(get_current_user)])
async def get_dynamodb_tables():
    # Simulação
    dynamodb_tables = [
        {"name": "Users", "status": "Active", "itemCount": 1250},
        {"name": "Products", "status": "Active", "itemCount": 5432},
    ]
    return dynamodb_tables
# --- Fim das rotas de simulação ---

