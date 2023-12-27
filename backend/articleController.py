from flask import Blueprint
from flask import  request, jsonify
from elasticsearch import Elasticsearch
import json, re

articleController = Blueprint("articleController",__name__)
es = Elasticsearch(['http://localhost:9200']) 


#Get an article by ID
@articleController.route('/api/article/<string:article_id>', methods=['GET'])
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