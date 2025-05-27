from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserInDBBase(UserBase):
    id: Optional[str] = None

    class Config:
        from_attributes = True # Alterado de orm_mode para from_attributes (Pydantic V2)

class UserInDB(UserInDBBase):
    hashed_password: str

class UserResponse(UserInDBBase):
    token: Optional[str] = None # Adicionado para retornar token no signup

