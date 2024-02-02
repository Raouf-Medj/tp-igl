import os
from flask import Flask
from models import db
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from articleController import articleController
from authController import authController
from modController import modController
from fileController import fileController
from favoriteController import favoriteController
from elasticsearch import Elasticsearch
from dotenv import load_dotenv

es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

#read the .env variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Flask instance
app = Flask(__name__)
app.register_blueprint(articleController,url_prefix="")
app.register_blueprint(modController,url_prefix="")
app.register_blueprint(authController,url_prefix="")
app.register_blueprint(fileController,url_prefix="")
app.register_blueprint(favoriteController,url_prefix="")
app.config.update(
   SQLALCHEMY_DATABASE_URI=os.environ.get("SQLALCHEMY_DATABASE_URI"),
   SECRET_KEY=os.environ.get("SECRET_KEY"),
   JWT_SECRET_KEY=os.environ.get("JWT_SECRET_KEY"),
)

CORS(app, supports_credentials=True)

jwt = JWTManager(app)

bcrypt = Bcrypt(app)

db.init_app(app)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0')