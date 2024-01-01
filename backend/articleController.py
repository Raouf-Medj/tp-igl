from flask import Blueprint
from flask import  request, jsonify
from elasticsearch import Elasticsearch
from textExtractor import pdfToJson
import json, re
from datetime import datetime
import unicodedata
from elasticsearch.helpers import scan

articleController = Blueprint("articleController",__name__)
es = Elasticsearch(['http://localhost:9200']) 


#Get an article by ID
@articleController.route('/api/articles/<string:article_id>', methods=['GET'])
def getArticleByID(article_id):
    try:
        index_name = 'articles'  # Replace with your index name
        # REMEMBER TO GET THIS VARIABLE -index_name- OUT "REFACTORED" EXTERNAL TO ALL METHODS
        result = es.get(index=index_name, id=article_id)
        # Extract the source document from the result
        if(result["found"]):
            article = result['_source']
            return jsonify(article)
        else:
            return jsonify({'error':"auccun article avec id corespondant trouvé"}),404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@articleController.route('/api/articles/search',methods=['POST'])
def manageArticleSearch():

    words_to_search = [request.json["query"]]
    authors_to_search = request.json["authors"]
    institutions_to_search = request.json["institutions"]
    keywords_to_search = request.json["keywords"]
    date_debut = request.json["date_debut"]
    date_fin = request.json["date_fin"]

    articles_to_return = []

    fields_to_retrieve = ["_id", "title", "abstract", "authors", "institutions", "keywords", "url", "publication_date", "text", "validated"]

    scroll = scan(es, index='articles', query={"query": {"match_all": {}}}, _source=fields_to_retrieve)

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
    index_name = "articles"
    
    if request.method == 'POST':
        try:
            jsonRequestObject = request.get_json()
            
            if "pdf_name" in jsonRequestObject:
                #we suppose that the pdf exists in the docs folder in frontend/public/
                extractedJson = pdfToJson(jsonRequestObject["pdf_name"])
                response = es.index(index=index_name, body=extractedJson)
                
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
            es.update(index=index_name, id=id, body={'doc':jsonRequestObject })

            return jsonify({"id": id,"title":jsonRequestObject["title"]})

        except Exception as e:
            print(e)
            return jsonify({'erreur': 'mise a jour echouee'}), 500  
    else:
        return jsonify({'error': 'methode de requete non supportee'}), 405  
    


def stringSpliterLower(string):
    tmpString = string.lower()
    return tmpString.split()


def normalize_string(s):
    return unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode('utf-8')

def check_all_words_existence(words, text_content):

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
    concatenated_strings = ' '.join(strings_retrieved)
    return check_all_words_existence(searched_words, concatenated_strings)