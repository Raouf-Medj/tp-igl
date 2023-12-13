from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from enum import Enum

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class RoleEnum(Enum):
    CLIENT = 'CLIENT'
    MOD = 'MOD'
    ADMIN = 'ADMIN'

class User(db.Model):
    __tablename__ = "db_users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    role = db.Column(db.Enum(RoleEnum), nullable=False)