from flask import Blueprint
from flask import request, jsonify
from models import db,User,RoleEnum,UserArticle

favoriteController = Blueprint("favoriteController",__name__)





@favoriteController.route("/api/favoris/<id>", methods = ['GET'])
def get_favoris_user(id):
    
    
    """
    Get favorited articles for a user.

    This endpoint retrieves the list of articles favorited by a user by specifying their user ID.

    :param id: The ID of the user.
    :type id: int
    :return: JSON response containing a list of favorited articles or an error message.
    :rtype: flask.Response
    """
    import app
    
    user = User.query.filter_by(id = id).first()
    articles = []
    if not user:
        return jsonify({"error":"Utilisateur introuvable"}), 404
    else:
        user_favoris = UserArticle.query.filter_by(user_id = id).all()
        for favoris in user_favoris:
            article_exists = app.es.exists(index = "articles", id = favoris.article_id)
            if article_exists:
                article = app.es.get(index = "articles", id = favoris.article_id)
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


@favoriteController.route('/api/favoris', methods=['POST'])
def like_article():
    
    
    """
    Like an article.

    This endpoint allows a user to like an article by providing their user ID and the article ID.

    :return: JSON response indicating success or an error message.
    :rtype: flask.Response
    """
    import app
    
    req_json = request.json
    user_id = req_json["user_id"]
    article_id = req_json["article_id"]
    user_exists = User.query.filter_by(id = user_id).first()
    article_exists = app.es.exists(index = "articles", id = article_id)
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


@favoriteController.route('/api/favoris/<user_id>/<article_id>', methods=['DELETE'])
def unlike_article(user_id, article_id):
    
    """
    Unlike an article.

    This endpoint allows a user to unlike an article by specifying their user ID and the article ID.

    :param user_id: The ID of the user.
    :type user_id: int
    :param article_id: The ID of the article.
    :type article_id: int
    :return: JSON response indicating success or an error message.
    :rtype: flask.Response
    """
    
    article_favori = UserArticle.query.filter_by(user_id=user_id, article_id=article_id).first()
    if article_favori:
        db.session.delete(article_favori)
        db.session.commit()
        return jsonify({'user_id': user_id, 'article_id': article_id}), 200
    else:
        return jsonify({"error": "Article introuvable dans la liste des favoris de l'utilisateur"}), 404
