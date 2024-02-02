from flask import Blueprint
from flask import request, jsonify
import re
from models import db,User,RoleEnum
modController = Blueprint("modController",__name__)




@modController.route('/api/mods', methods=['POST'])
def add_mod():
    import app
    """
    Add a new moderator.

    This endpoint allows the addition of a new moderator by providing a username and password.

    :return: JSON response containing moderator details or an error message.
    :rtype: flask.Response
    """
    
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
        hashed_password = app.bcrypt.generate_password_hash(password).decode("utf-8")
        new_user = User(username=username, password=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"id": new_user.id, "username": new_user.username}), 200
    

@modController.route('/api/mods/<id>', methods=['DELETE'])
def delete_mod(id):
    
    """
    Delete a moderator.

    This endpoint allows the deletion of a moderator by specifying their user ID.

    :param id: The ID of the moderator to be deleted.
    :type id: int
    :return: JSON response indicating success or an error message.
    :rtype: flask.Response
    """
    
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


@modController.route('/api/mods', methods = ['GET'])
def get_mods():
    
    """
    Get all moderators.

    This endpoint retrieves a list of all moderators.

    :return: JSON response containing a list of moderators or an error message.
    :rtype: flask.Response
    """
    
    users = User.query.filter_by(role = RoleEnum.MOD).all()
    usersToReturn = []
    for user in users:
        usersToReturn.append({
            "id": user.id,
            "username": user.username
        })
    return jsonify({"mods":usersToReturn}), 200


@modController.route('/api/mods/<id>', methods = ['GET'])
def get_mod(id):
    
    """
    Get a specific moderator.

    This endpoint retrieves details of a specific moderator by specifying their user ID.

    :param id: The ID of the moderator to be retrieved.
    :type id: int
    :return: JSON response containing moderator details or an error message.
    :rtype: flask.Response
    """
    
    user = User.query.filter_by(id = id).first()
    if not user:
        return jsonify({"error": "Utilisateur introuvable"}), 404
    else:
        if user.role == RoleEnum.MOD:
            return jsonify({"id":user.id,"username":user.username}), 200
        else:
            return jsonify({"error": "Utilisateur introuvable"}), 404
    

@modController.route('/api/mods',methods = ['PUT'])
def modify_mod():
    import app
    """
    Modify a moderator.

    This endpoint allows the modification of a moderator's details by specifying their user ID,
    and providing the updated username and/or password.

    :return: JSON response containing updated moderator details or an error message.
    :rtype: flask.Response
    """
    
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
                    user.password = app.bcrypt.generate_password_hash(password).decode("utf-8")
                db.session.commit()
                return jsonify({"id":user.id,"username":user.username}), 200
            else:
                return jsonify({"error": "Utilisateur introuvable"}), 404
