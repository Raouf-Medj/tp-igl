from flask import Blueprint
from flask import request, jsonify,send_from_directory
import os
fileController = Blueprint("fileController",__name__)




@fileController.route('/api/uploads', methods=['POST'])
def upload_file():
    import app
    """
    Upload a file.

    This endpoint allows users to upload a PDF file.

    :return: JSON response indicating success or an error message.
    :rtype: flask.Response
    """
    
    if 'file' not in request.files:
        return jsonify({'error': 'Pas de fichier'}), 404

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'Pas de fichier selectionné'}), 404

    if '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() == "pdf":
        upload_folder = os.path.join(app.app.root_path, 'uploads')  # Define the upload folder path
        if os.path.isfile(os.path.join(upload_folder, file.filename)):
            return jsonify({'error': 'Un fichier avec le même nom existe déjà'}), 409
        
        filename = os.path.join(upload_folder, file.filename)
        file.save(filename)

        return jsonify({'message': 'Succes'}), 200
    else:
        return jsonify({'error': 'Type de fichier invalide'}), 415


@fileController.route('/api/uploads/<filename>', methods=['GET'])
def download_file(filename):
    import app
    """
    Download a file.

    This endpoint allows users to download a previously uploaded file.

    :param filename: Name of the file to be downloaded.
    :type filename: str
    :return: The file to be downloaded.
    :rtype: flask.Response
    """
    
    upload_folder = os.path.join(app.app.root_path, 'uploads')  # Define the upload folder path
    return send_from_directory(upload_folder, filename)



@fileController.route('/api/uploads/<filename>', methods=['DELETE'])
def delete_file(filename):
    import app
    """
    Delete an uploaded file.

    This endpoint allows the deletion of an uploaded file by specifying its filename.

    :param filename: The name of the file to be deleted.
    :type filename: str
    :return: JSON response indicating success or an error message.
    :rtype: flask.Response
    """
    
    upload_folder = os.path.join(app.app.root_path, 'uploads')  # Define the upload folder path
    filepath = os.path.join(upload_folder, filename)
    
    if os.path.exists(filepath):
        os.remove(filepath)
        return jsonify({'message': f'Le fichier {filename} a été supprimé'}), 200
    else:
        return jsonify({'error': 'Fichier non trouvé'}), 404
