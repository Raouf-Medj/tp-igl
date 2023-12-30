from flask import Blueprint
from flask import  request, jsonify
from elasticsearch import Elasticsearch
from textExtractor import pdfToJson
import json, re

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
    index_name = "articles"
    try:
        listOfFieldsToMatch = []
        jsonRequestObject=request.get_json()
        if jsonRequestObject["query"]!="":
            listOfFieldsToMatch.append({ "match": { "text": jsonRequestObject["query"] }})
        if jsonRequestObject["authors"]!=[]:
            listOfFieldsToMatch.append({ "terms": { "authors.keyword": jsonRequestObject["authors"] }})
        if jsonRequestObject["institutions"]!=[]:
            listOfFieldsToMatch.append({ "terms": { "institutions.keyword": jsonRequestObject["institutions"] }})
        if jsonRequestObject["keywords"]!=[]:
            listOfFieldsToMatch.append({ "terms": { "keywords": jsonRequestObject["keywords"] }})
        if jsonRequestObject["date_debut"]!="" and jsonRequestObject["date_fin"]!="":
            listOfFieldsToMatch.append({ "range": { "publication_date": { "gte": jsonRequestObject["date_debut"],"lte":jsonRequestObject["date_fin"] }}})
        
        if listOfFieldsToMatch!=[]:
            search_query = {
                "query":{
                    "bool":{
                        "must" : listOfFieldsToMatch
                    }
                },
                "_source":["title","abstract","url","validated","publication_date"],
                "size":100
            }
        else:
            search_query ={
                "query":{
                    "match_all": {}
                },
                "_source":["title","abstract","url","validated","publication_date"],
                "size":100
            }
        print(search_query)
        response = es.search(index=index_name, body=search_query)
        listOfResults = response['hits']['hits']
        finalListOfResults = []
        for result in listOfResults:
            tmp = {}
            tmp["id"]= result["_id"]
            tmp["title"]= result["_source"]["title"]
            tmp["abstract"]= result["_source"]["abstract"]
            tmp["url"]= result["_source"]["url"]
            tmp["publication_date"]= result["_source"]["publication_date"]
            tmp["validated"]= result["_source"]["validated"]
            finalListOfResults.append(tmp)
        return jsonify({"articles":finalListOfResults})
    except Exception as e:
        print(str(e))
        return jsonify({"erreur":"echec dans la recherche"}),500

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