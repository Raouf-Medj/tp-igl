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
from elasticsearch.exceptions import RequestError
from dotenv import load_dotenv

# es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
es = Elasticsearch(hosts=["http://elasticsearch:9200"], scheme="http", retry_on_timeout=True)

# Specify the index name
index_name = 'articles'

# Check if the index exists
index_exists = es.indices.exists(index=index_name)

if not index_exists:
    try:
        # Create the index without specifying a mapping
        es.indices.create(index=index_name)
        print(f"Index '{index_name}' created successfully.")
    except RequestError as e:
        print(f"Failed to create index '{index_name}': {e}")

# Specify the index name
index_name = 'articles'

# Check if the index exists
index_exists = es.indices.exists(index=index_name)

if not index_exists:
    try:
        # Create the index without specifying a mapping
        es.indices.create(index=index_name)
        print(f"Index '{index_name}' created successfully.")
    except RequestError as e:
        print(f"Failed to create index '{index_name}': {e}")

#read the .env variables
load_dotenv()

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

@app.after_request
def after_request(response):
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

jwt = JWTManager(app)

bcrypt = Bcrypt(app)

db.init_app(app)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0')