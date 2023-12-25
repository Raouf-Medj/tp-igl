from flask import Flask, request, jsonify
import json, re
from datetime import datetime, timedelta, timezone
from models import db, User, RoleEnum
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from flask_cors import CORS


# Flask instance
app = Flask(__name__)

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
    role = RoleEnum.MOD
    user_exists = User.query.filter_by(username=username).first()
    if user_exists:
        return jsonify({"Error": "User already exists"}), 409
    else:
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        new_user = User(username=username, password=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"id": new_user.id, "username": new_user.username}), 200
    

@app.route('/api/mods/<id>', methods=['DELETE'])
def delete_mod(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"Error": "User not found"}), 404
    else:
        if user.role == RoleEnum.MOD:
            db.session.delete(user)
            db.session.commit()
            return jsonify({"id":user.id,"username":user.username}), 200
        else:
            return jsonify({"Error": "User not found"}), 404

@app.route('/api/mods', methods = ['GET'])
def get_mods():
    users = User.query.filter_by(role = RoleEnum.MOD)
    usersToReturn = []
    for user in users:
        usersToReturn.append({
            "id": user.id,
            "username": user.username
        })
    return jsonify({"mods":usersToReturn}), 200

@app.route('/api/mods/<id>', methods = ['GET'])
def get_mod(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"Error": "User not found"}), 404
    else:
        if user.role == RoleEnum.MOD:
            return jsonify({"id":user.id,"username":user.username}), 200
        else:
            return jsonify({"Error": "User not found"}), 404
    

@app.route('/api/mods',methods = ['PUT'])
def modify_mod():
    id = request.json["id"]
    username = request.json["username"]
    password = request.json["password"]
    user = User.query.get(id)
    if not user:
        return jsonify({"Error": "User not found"}), 404
    else:
        user_exists = User.query.filter_by(username = username).first()
        if user_exists:
            return jsonify({"Error":"Username already taken"}), 409
        else:
            if user.role == RoleEnum.MOD:  
                user.username = username
                user.password = bcrypt.generate_password_hash(password).decode("utf-8")
                db.session.commit()
                return jsonify({"id":user.id,"username":user.username}), 200
            else:
                return jsonify({"Error": "User not found"}), 404




if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

