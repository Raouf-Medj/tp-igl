from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from enum import Enum

db = SQLAlchemy()

def get_uuid():
    
    """
    Generate a random UUID and return its hexadecimal representation.

    :return: Hexadecimal representation of the generated UUID.
    :rtype: str
    """
    
    return uuid4().hex

class RoleEnum(Enum):
    
    """
    Enumeration representing user roles.

    Values:
    - CLIENT: Regular client user.
    - MOD: Moderator user.
    - ADMIN: Administrator user.
    """
    
    CLIENT = 'CLIENT'
    MOD = 'MOD'
    ADMIN = 'ADMIN'

class User(db.Model):
    
    """
    User model representing registered users.

    :param str id: The user's unique identifier (UUID).
    :param str username: The username chosen by the user.
    :param str password: The hashed password for the user.
    :param RoleEnum role: The role of the user (CLIENT, MOD, ADMIN).
    """
    
    __tablename__ = "db_users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    role = db.Column(db.Enum(RoleEnum), nullable=False)


class UserArticle(db.Model):
    
    """
    UserArticle model representing the relationship between users and favorited articles.

    :param str user_id: The user's unique identifier (UUID).
    :param str article_id: The article's unique identifier.
    """
    
    __tablename__ = "db_users_favoris"
    user_id = db.Column(db.String(32), db.ForeignKey('db_users.id'), primary_key=True)
    article_id = db.Column(db.String(30), primary_key=True)