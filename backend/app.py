from flask import Flask, jsonify
import json, re
from datetime import datetime, timedelta, timezone
from models import db
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from flask_cors import CORS
from articleController import articleController
from authController import authController
from modController import modController
from fileController import fileController
from favoriteController import favoriteController

from elasticsearch import Elasticsearch
from elasticsearch.exceptions import NotFoundError


es = Elasticsearch([{'host': 'localhost', 'port': 9200}])


# Flask instance
app = Flask(__name__)
app.register_blueprint(articleController,url_prefix="")
app.register_blueprint(modController,url_prefix="")
app.register_blueprint(authController,url_prefix="")
app.register_blueprint(fileController,url_prefix="")
app.register_blueprint(favoriteController,url_prefix="")
app.config.update(
   SQLALCHEMY_DATABASE_URI="postgresql://postgres.bglmxtkawutiaiyihpij:scifetch.23@aws-0-eu-central-1.pooler.supabase.com:5432/postgres",
   SECRET_KEY="zYpEicDyBgF704lYByrQVVDqDd3eRX0b",
   JWT_SECRET_KEY="zYpEicDyBgF704lYByrQVVDqDd3eRX0b",
)

#app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:scifetch.23@db.bglmxtkawutiaiyihpij.supabase.co:5432/postgres"
#app.config["SECRET_KEY"] = "zYpEicDyBgF704lYByrQVVDqDd3eRX0b"
#app.config["JWT_SECRET_KEY"] = "zYpEicDyBgF704lYByrQVVDqDd3eRX0b"
# app.config["SQLALCHEMY_ECHO"] = True

CORS(app, supports_credentials=True)

jwt = JWTManager(app)

bcrypt = Bcrypt(app)

db.init_app(app)

#with app.app_context():
   # db.create_all()



@app.after_request
def refresh_expiring_jwts(response):
    
    """
    Refresh expiring JWTs.

    This function intercepts responses and refreshes expiring JWTs by extending their validity.

    :param response: The Flask response object.
    :type response: flask.Response
    :return: The modified response.
    :rtype: flask.Response
    """
    
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response
 




if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0')


