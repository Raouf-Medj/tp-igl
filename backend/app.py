from flask import Flask, request, jsonify, send_from_directory
import json, re
from datetime import datetime, timedelta, timezone
from models import db, User, RoleEnum, UserArticle
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from flask_cors import CORS
from articleController import articleController
import os

from elasticsearch import Elasticsearch
from elasticsearch.exceptions import NotFoundError


es = Elasticsearch([{'host': 'localhost', 'port': 9200}])


# Flask instance
app = Flask(__name__)
app.register_blueprint(articleController,url_prefix="")


app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:scifetch.23@db.bglmxtkawutiaiyihpij.supabase.co:5432/postgres"
app.config["SECRET_KEY"] = "zYpEicDyBgF704lYByrQVVDqDd3eRX0b"
app.config["JWT_SECRET_KEY"] = "zYpEicDyBgF704lYByrQVVDqDd3eRX0b"
# app.config["SQLALCHEMY_ECHO"] = True

CORS(app, supports_credentials=True)

jwt = JWTManager(app)

bcrypt = Bcrypt(app)

db.init_app(app)

with app.app_context():
    db.create_all()


# Handling requests
@app.route('/api/register', methods=['POST'])
def register():
    username = request.json["username"]
    password = request.json["password"]
    role = request.json["role"]

    user_exists = User.query.filter_by(username=username).first() is not None

    if user_exists:
        return jsonify({"error": "Nom d'utilisateur déjà existant"}), 409

    try:
        enum_role = RoleEnum.__members__[role]
    except KeyError:
        return jsonify({"error": "Invalid role"}), 400

    if not 6 <= len(username) <= 72:
        return jsonify({"error": "Longueur du nom d'utilisateur doit être supérieure à 6"}), 400

    pattern = re.compile("^[a-zA-Z0-9_.]+$")
    if not bool(re.match(pattern, username)):
        return jsonify({"error": "Nom utilisateur invalide"}), 400

    if not 8 <= len(password) <= 72:
        return jsonify({"error": "Longueur de mot passe doit être supérieure à 8"}), 400

    pattern = re.compile("^[a-zA-Z0-9_.@]+$")
    if not bool(re.match(pattern, password)):
        return jsonify({"error": "Mot de passe invalide"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(username=username, password=hashed_password, role=enum_role)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.username)

    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
        "access_token": access_token,
        "role": new_user.role.name
    })


@app.route('/api/login', methods=['POST'])
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = User.query.filter_by(username=username).first()

    if user is None:
        return jsonify({"error": "Nom d'utilisateur inexistant"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Mot de passe erroné"}), 401

    access_token = create_access_token(identity=user.username)

    return jsonify({
        "id": user.id,
        "username": user.username,
        "access_token": access_token,
        "role": user.role.name
    })


@app.route("/api/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)
    return response


@app.route('/api/uploads', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'Pas de fichier'}), 404

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'Pas de fichier selectionné'}), 404

    if '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() == "pdf":
        upload_folder = os.path.join(app.root_path, 'uploads')  # Define the upload folder path
        if os.path.isfile(os.path.join(upload_folder, file.filename)):
            return jsonify({'error': 'Un fichier avec le même nom existe déjà'}), 409
        
        filename = os.path.join(upload_folder, file.filename)
        file.save(filename)

        return jsonify({'message': 'Succes'}), 200
    else:
        return jsonify({'error': 'Type de fichier invalide'}), 415


@app.route('/api/uploads/<filename>', methods=['GET'])
def download_file(filename):
    upload_folder = os.path.join(app.root_path, 'uploads')  # Define the upload folder path
    return send_from_directory(upload_folder, filename)



@app.route('/api/uploads/<filename>', methods=['DELETE'])
def delete_file(filename):
    upload_folder = os.path.join(app.root_path, 'uploads')  # Define the upload folder path
    filepath = os.path.join(upload_folder, filename)
    
    if os.path.exists(filepath):
        os.remove(filepath)
        return jsonify({'message': f'Le fichier {filename} a été supprimé'}), 200
    else:
        return jsonify({'error': 'Fichier non trouvé'}), 404


@app.after_request
def refresh_expiring_jwts(response):
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
 

@app.route('/api/mods', methods=['POST'])
def add_mod():
    username = request.json["username"]
    password = request.json["password"]
    
    if not 6 <= len(username) <= 72:
        return jsonify({"error": "La longueur du nom d'utilisateur doit être supérieure à 6"}), 400

    pattern = re.compile("^[a-zA-Z0-9_.]+$")
    if not bool(re.match(pattern, username)):
        return jsonify({"error": "Nom d'utilisateur invalide"}), 400

    if not 8 <= len(password) <= 72:
        return jsonify({"error": "La longueur du mot passe doit être supérieure à 8"}), 400

    pattern = re.compile("^[a-zA-Z0-9_.@]+$")
    if not bool(re.match(pattern, password)):
        return jsonify({"error": "Mot de passe invalide"}), 400
    
    role = RoleEnum.MOD
    user_exists = User.query.filter_by(username=username).first()
    if user_exists:
        return jsonify({"error": "Nom d'utilisateur déjà existant"}), 409
    else:
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        new_user = User(username=username, password=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"id": new_user.id, "username": new_user.username}), 200
    

@app.route('/api/mods/<id>', methods=['DELETE'])
def delete_mod(id):
    user = User.query.filter_by(id = id).first()
    if not user:
        return jsonify({"error": "Utilisateur introuvable"}), 404
    else:
        if user.role == RoleEnum.MOD:
            db.session.delete(user)
            db.session.commit()
            return jsonify({"id":user.id,"username":user.username}), 200
        else:
            return jsonify({"error": "Utilisateur introuvable"}), 404


@app.route('/api/mods', methods = ['GET'])
def get_mods():
    users = User.query.filter_by(role = RoleEnum.MOD).all()
    usersToReturn = []
    for user in users:
        usersToReturn.append({
            "id": user.id,
            "username": user.username
        })
    return jsonify({"mods":usersToReturn}), 200


@app.route('/api/mods/<id>', methods = ['GET'])
def get_mod(id):
    user = User.query.filter_by(id = id).first()
    if not user:
        return jsonify({"error": "Utilisateur introuvable"}), 404
    else:
        if user.role == RoleEnum.MOD:
            return jsonify({"id":user.id,"username":user.username}), 200
        else:
            return jsonify({"error": "Utilisateur introuvable"}), 404
    

@app.route('/api/mods',methods = ['PUT'])
def modify_mod():
    id = request.json["id"]
    username = request.json["username"]
    password = request.json["password"]
    user = User.query.filter_by(id = id).first()
    if not user:
        return jsonify({"error": "Utilisateur introuvable"}), 404
    else:
        user_exists = User.query.filter_by(username = username).first()
        if user_exists and user_exists.id != user.id:
            return jsonify({"error": "Nom d'utilisateur déjà existant"}), 409
        else:
            if user.role == RoleEnum.MOD:
                if username.strip(): #it contains caracters and its not empty and it doesnt contain only spaces
                    if not 6 <= len(username) <= 72:
                        return jsonify({"error": "La longueur du nom d'utilisateur doit être supérieure à 6"}), 400
                    pattern = re.compile("^[a-zA-Z0-9_.]+$")
                    if not bool(re.match(pattern, username)):
                        return jsonify({"error": "Nom d'utilisateur invalide"}), 400
                    user.username = username
                if password.strip(): #the field is not empty and it doesnt contain only spaces
                    if not 8 <= len(password) <= 72:
                        return jsonify({"error": "La longueur du mot passe doit être supérieure à 8"}), 400
                    pattern = re.compile("^[a-zA-Z0-9_.@]+$")
                    if not bool(re.match(pattern, password)):
                        return jsonify({"error": "Mot de passe invalide"}), 400
                    user.password = bcrypt.generate_password_hash(password).decode("utf-8")
                db.session.commit()
                return jsonify({"id":user.id,"username":user.username}), 200
            else:
                return jsonify({"error": "Utilisateur introuvable"}), 404


@app.route("/api/favoris/<id>", methods = ['GET'])
def get_favoris_user(id):
    user = User.query.filter_by(id = id).first()
    articles = []
    if not user:
        return jsonify({"error":"Utilisateur introuvable"}), 404
    else:
        user_favoris = UserArticle.query.filter_by(user_id = id).all()
        for favoris in user_favoris:
            article_exists = es.exists(index = "articles", id = favoris.article_id)
            if article_exists:
                article = es.get(index = "articles", id = favoris.article_id)
                retrieved_article = article['_source']
                articles.append({
                    "id": favoris.article_id,
                    "title": retrieved_article.get('title',''),
                    "abstract": retrieved_article.get('abstract',''),
                    "url": retrieved_article.get('url',''),
                    "validated": retrieved_article.get('validated','')
                })
            else:
                db.session.delete(favoris)
                db.session.commit()
        return jsonify({"articles":articles}), 200


@app.route('/api/favoris', methods=['POST'])
def like_article():
    req_json = request.json
    user_id = req_json["user_id"]
    article_id = req_json["article_id"]
    user_exists = User.query.filter_by(id = user_id).first()
    article_exists = es.exists(index = "articles", id = article_id)
    if article_exists and user_exists and user_exists.role == RoleEnum.CLIENT:
        article_favori_existant = UserArticle.query.filter_by(user_id = user_id, article_id = article_id).first()
        if not article_favori_existant:
            article_favori = UserArticle(user_id=user_id, article_id=article_id)
            db.session.add(article_favori)
            db.session.commit()
            return jsonify({'user_id': user_id, 'article_id': article_id}), 200
        else:
            return jsonify({"error":"Article existant dans la liste des favoris de l'utilisateur"}), 409
    elif not user_exists or not user_exists.role == RoleEnum.CLIENT:
        return jsonify({"error":"Utilisateur introuvable"}), 404
    else:
        return jsonify({"error":"Article introuvable"}), 404


@app.route('/api/favoris/<user_id>/<article_id>', methods=['DELETE'])
def unlike_article(user_id, article_id):
    article_favori = UserArticle.query.filter_by(user_id=user_id, article_id=article_id).first()
    if article_favori:
        db.session.delete(article_favori)
        db.session.commit()
        return jsonify({'user_id': user_id, 'article_id': article_id}), 200
    else:
        return jsonify({"error": "Article introuvable dans la liste des favoris de l'utilisateur"}), 404


@app.route('/api/articles/<id>', methods=['DELETE'])
def delete_article(id):
    article_exists = es.exists(index = "articles", id = id)
    if article_exists:
        article = es.get(index = "articles", id = id)
        article_title  = article['_source']['title']
        es.delete(index="articles", id = id)
        article_favoris = UserArticle.query.filter_by(article_id=id).all()
        if len(article_favoris) > 0:
            for favoris in article_favoris:
                db.session.delete(favoris)
                db.session.commit()
        return jsonify({"id":id, "title":article_title}), 200
    else:
        return jsonify({"error":"Article introuvable"}), 404    


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')


