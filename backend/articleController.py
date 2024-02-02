from flask import Blueprint
from flask import  request, jsonify
from models import db,  UserArticle
from textExtractor import pdfToJson
import json, re
from datetime import datetime
import unicodedata
from elasticsearch.helpers import scan

articleController = Blueprint("articleController",__name__)




#Get an article by ID
@articleController.route('/api/articles/<string:article_id>', methods=['GET'])
def getArticleByID(article_id):
    import app
    """
    Get an article by ID

    This endpoint allows acessing a specefic article through its ID

    :param article_id: the ID of the article
    :type article_id: int
    :return: JSON structure containing detailed information about the article, or an error message if something went wrong
    :rtype: flask.Response
    """
    try:
        index_name = 'articles'  
        result = app.es.get(index=index_name, id=article_id)
        if(result["found"]):
            article = result['_source']
            return jsonify(article)
        else:
            return jsonify({'error':"auccun article avec id corespondant trouvé"}),404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@articleController.route('/api/articles/search',methods=['POST'])
def manageArticleSearch():
    import app
    """
    manage article search

    this endpoint allows the server to perform a search operation of articles through elastic search engine, the query is provided in the body of the request
    
    :return: a list of article headers "basic information" that are relevant to the query provided in the request body
    :rtype: flask.Response
    """
    words_to_search = [request.json["query"]]
    authors_to_search = request.json["authors"]
    institutions_to_search = request.json["institutions"]
    keywords_to_search = request.json["keywords"]
    date_debut = request.json["date_debut"]
    date_fin = request.json["date_fin"]

    articles_to_return = []

    fields_to_retrieve = ["_id", "title", "abstract", "authors", "institutions", "keywords", "url", "publication_date", "text", "validated"]

    scroll = scan(app.es, index='articles', query={"query": {"match_all": {}}}, _source=fields_to_retrieve)

    for document in scroll:

        doc_id = document['_id']
        title = document['_source']['title']
        abstract = document['_source']['abstract']
        authors = document['_source']['authors']
        institutions = document['_source']['institutions']
        keywords = document['_source']['keywords']
        url = document['_source']['url']
        publication_date = document['_source']['publication_date']
        text = document['_source']['text']
        validated = document['_source']['validated']

        if is_between_dates(initial_date_str=date_debut, final_date_str=date_fin, date_to_check_str=publication_date) and check_all_words_existence(words=words_to_search, text_content=text) and all_searched_words_exist(searched_words=keywords_to_search, strings_retrieved=keywords) and all_searched_words_exist(searched_words=authors_to_search, strings_retrieved=authors) and all_searched_words_exist(searched_words=institutions_to_search, strings_retrieved=institutions):
            articles_to_return.append({
                "id": doc_id,
                "title": title,
                "abstract": abstract,
                "url": url,
                "publication_date": publication_date,
                "validated": validated,
            })
    
    return jsonify({"articles":articles_to_return}), 200

@articleController.route('/api/articles',methods=['POST','PUT'])
def manageArticles():
    import app
    """
    manage articles

    This endpoint allows to either update an existing article by providing the exact information of the updated article in the request body, or upload a new article "that is converting the uploaded pdf to a json structure that will be indexed by elastic search", by provding the pdf file name in the request body

    :return: JSON response indicating success/failure of the upload/update operation
    :rtype: flask.Response
    """
    index_name = "articles"
    
    if request.method == 'POST':
        try:
            jsonRequestObject = request.get_json()
            
            if "pdf_name" in jsonRequestObject:
                #we suppose that the pdf exists in the docs folder in frontend/public/
                extractedJson = pdfToJson(jsonRequestObject["pdf_name"])
                response = app.es.index(index=index_name, body=extractedJson)
                
                return jsonify({"id":response['_id'],"title":extractedJson["title"]})
            else:
                return jsonify({'erreur': "nom de fichier incoherent"})

        except:
            return jsonify({'erreur': "echec d'ajout d'un article"}), 500  # Internal Server Error
    elif request.method == 'PUT':
        try:
            jsonRequestObject = request.get_json()
            if "id" in jsonRequestObject:
                id = jsonRequestObject["id"]
                jsonRequestObject.pop("id")
            else:
                return jsonify({'error': 'champ "id" abscent'}), 500  
            app.es.update(index=index_name, id=id, body={'doc':jsonRequestObject })

            return jsonify({"id": id,"title":jsonRequestObject["title"]})

        except Exception as e:
            print(e)
            return jsonify({'erreur': 'mise a jour echouee'}), 500  
    else:
        return jsonify({'error': 'methode de requete non supportee'}), 405  
    



@articleController.route('/api/articles/<id>', methods=['DELETE'])
def delete_article(id):
    import app
    """
    Delete an article.

    This endpoint allows the deletion of an article by specifying its ID.

    :param id: The ID of the article to be deleted.
    :type id: int
    :return: JSON response indicating success or an error message.
    :rtype: flask.Response
    """
    
    article_exists = app.es.exists(index = "articles", id = id)
    if article_exists:
        article = app.es.get(index = "articles", id = id)
        article_title  = article['_source']['title']
        app.es.delete(index="articles", id = id)
        article_favoris = UserArticle.query.filter_by(article_id=id).all()
        if len(article_favoris) > 0:
            for favoris in article_favoris:
                db.session.delete(favoris)
                db.session.commit()
        return jsonify({"id":id, "title":article_title}), 200
    else:
        return jsonify({"error":"Article introuvable"}), 404    


def stringSpliterLower(string):
    """
    String splitter lower

    This method splites a string "more specefically a sentence" into an array of words, making sure they are in lowercase

    :param string: the sentence we want to split into words
    :type string: string
    :return: a list "an array" of lowercased words
    :rtype: list
    """
    tmpString = string.lower()
    return tmpString.split()


def normalize_string(s):
    """
    normalise string

    This method modifies a string, deletes non-Ascii characters, and makes sure it returns a valid Unicode string

    :param s: the string input "to normalize"
    :type s: string
    :return: a valid Unicode string
    :rtype: string
    """
    return unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode('utf-8')

def check_all_words_existence(words, text_content):
    """
    check all words existence

    this method checks wether at least one word "from the word list" exists in the text

    :param words: the list of words that we check the existence in the text
    :type words: list
    :param text_content: the full text in which we search the existence of the words
    :type text_content: string
    :return: Boolean saying wether one of the words exists in the text or not
    :rtype: bool
    """
    normalized_text = normalize_string(text_content.lower())

    normalized_words = []
    for word in words:
        if isinstance(word, str): 
            normalized_words.extend(normalize_string(word.lower()).split()) 
        else:
            normalized_words.append(normalize_string(word.lower())) 

    for word in normalized_words:
        found = False
        for text_word in normalized_text.split():
            if word in text_word:
                found = True
                break
        if not found:
            return False  

    return True 


def is_between_dates(initial_date_str, final_date_str, date_to_check_str):
    """
    is between dates

    this method makes a given date is in between two specified dates

    :param initial_date_str: initial date
    :type initial_date_str: string
    :param final_date_str: final date
    :type final_date_str: string
    :param date_to_check_str: the date to check wether it is between the initial and final date
    :type date_to_check_str: string
    :return: Boolean saying wether the provided date is included in the time interval or not
    :rtype: bool
    """
    initial_date = datetime.strptime(initial_date_str, '%Y-%m-%d') if initial_date_str else None
    final_date = datetime.strptime(final_date_str, '%Y-%m-%d') if final_date_str else None
    date_to_check = datetime.strptime(date_to_check_str, '%Y-%m-%d')

    if initial_date and final_date:
        return initial_date <= date_to_check <= final_date
    elif initial_date:
        return date_to_check >= initial_date
    elif final_date:
        return date_to_check <= final_date
    else:
        return True



def all_searched_words_exist(searched_words, strings_retrieved):
    """
    all searched words exist

    this method returns wether or not a word from the list of words exists in one of the strings provided

    :param searched_words: list of words that we want to check the existence of the strings
    :type searched_words: list
    :param strings_retrieved: list of strings in which we should check the existence of one of the words
    :type strings_retrieved: list
    :return: boolean saying wether on of the words exists in one of the strings provided
    :rtype: bool
    """
    concatenated_strings = ' '.join(strings_retrieved)
    return check_all_words_existence(searched_words, concatenated_strings)