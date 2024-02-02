from flask import Blueprint
from flask import  request, jsonify
import json, re
from models import db, User, RoleEnum, UserArticle
authController = Blueprint("authController",__name__)
from flask_jwt_extended import create_access_token,unset_jwt_cookies


# Handling requests
@authController.route('/api/register', methods=['POST'])
def register():
    import app
    """
    Register a new user.

    This endpoint allows users to register by providing a username, password, and role.

    :return: JSON response containing user details or an error message.
    :rtype: flask.Response
    """
    
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

    hashed_password = app.bcrypt.generate_password_hash(password).decode("utf-8")
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


@authController.route('/api/login', methods=['POST'])
def login():
    import app
    """
    Authenticate and login a user.

    This endpoint allows users to login by providing a username and password.

    :return: JSON response containing user details or an error message.
    :rtype: flask.Response
    """
    
    username = request.json["username"]
    password = request.json["password"]

    user = User.query.filter_by(username=username).first()

    if user is None:
        return jsonify({"error": "Nom d'utilisateur inexistant"}), 401

    if not app.bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Mot de passe erroné"}), 401

    access_token = create_access_token(identity=user.username)

    return jsonify({
        "id": user.id,
        "username": user.username,
        "access_token": access_token,
        "role": user.role.name
    })


@authController.route("/api/logout", methods=["POST"])
def logout():
    
    """
    Logout the current user.

    This endpoint logs out the user by unsetting JWT cookies.

    :return: JSON response indicating successful logout.
    :rtype: flask.Response
    """
    
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)
    return response
