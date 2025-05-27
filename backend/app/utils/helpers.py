from fastapi import HTTPException
import logging

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def handle_error(error_message: str, status_code: int = 500):
    """
    Função utilitária para tratamento padronizado de erros
    """
    logger.error(f"Erro: {error_message}")
    raise HTTPException(status_code=status_code, detail=error_message)

def validate_aws_credentials(access_key: str, secret_key: str) -> bool:
    """
    Função para validar credenciais AWS
    Em uma implementação real, usaria boto3 para validar as credenciais
    """
    # Validação básica de formato
    if not access_key.startswith("AKIA"):
        return False
    
    if len(secret_key) < 20:
        return False
    
    # Em uma implementação real, tentaria uma operação simples com boto3
    # para verificar se as credenciais são válidas
    
    return True
