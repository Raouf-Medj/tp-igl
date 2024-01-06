from importlib.machinery import SourceFileLoader
import fitz
import re
import os
from openai import OpenAI
import json
#import os
#import dotenv
#dotenv.load_dotenv('.env')
#print(os.environ['OPENAI_API_KEY'])
# set the openAI api Key
client = OpenAI(api_key="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")


def remove_non_ascii(text):
    """
    remove non ascii

    this method makes sure the text filtered from all non printable characters, using the "regular expression" library

    :param text: the provided text, to be filtered
    :type text: string
    :return: the final text filtered from any non printable characters
    :rtype: string
    """
    # Use regular expressions to remove non-ASCII characters
    pattern = re.compile(r'[^\x00-\x7F%s\n]+' % re.escape("éèàáäûúüö"))
    cleaned_text = pattern.sub(' ', text)
    cleaned_text = re.sub(' +',' ',cleaned_text)
    return cleaned_text


def extractTextFromPDF(path):
    """
    extract Text from PDF

    This method scans a pdf file whose path is provided in the parameters, and extracts the entire text as a string, using "fitz" library

    :param path: path to the pdf file
    :type path: string
    :return: the extracted text "the entire content of the pdf"
    :rtype: string
    """
    #using fitz library to extract non-treated text from the pdf
    pdf = fitz.open(path)
    text = ''
    pageCount = pdf.page_count
    for i in range(pageCount):
        page = pdf.load_page(i)
        text = text + page.get_text('text')
    treatedText = remove_non_ascii(text)
    pdf.close()
    return treatedText

def writeStringToFile(text):
    with open("output.txt",'w') as file:
        file.write(text)


def gptTextAnalyser(text):
    """
    gpt text analyser

    this method uses the paid openAI api service inorder to analyse a text provided in the prompt, returning a structured json containing different sections of the text

    :param text: the entire text "for example extracted from a pdf file"
    :type text: string
    :return: all the extracted sections of the text organised json-like structure "JSON string"
    :rtype: string
    """
    try:
        #making sure the text does not surpass the number of tokens limit
        max_number_of_tokens = 9000
        words = text.split()
        if len(words) > max_number_of_tokens:
            updatedWords = words[:4500] + words[-4500:]
        else:
            # If the number of tokens is within the limit, no truncation is needed
            updatedWords = words

        # Join the words to form the truncated string
        finalText = ' '.join(updatedWords)
        #buidling the prompt to send to openAI api "to gpt-3.5 to be more specefic, specifying te role of the system as well, in addition to the return type "JSON string"
        prompt = f"Extract the exact following sections from the provided text :\n\n{finalText}\nthe json file contains only: \nAuthors:'a list of strings'\nTitle:\nAbstract:-the paragraph written in the section: abstract, from a to z-\nInstitutions:'a list of strings'\nKeyWords:'a list of strings, all the keywords in the -keywords section-'\nReferences:'a list of strings, all references in the section : references'\nPublication_date:'follow the format YYYY-MM-DD'"
        completion = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You extract data acurately as it is from the string, you DO NOT REFORMULATE EXTRACTED INFORMATION, you extract all the paragrph, no matter how long, and don't stop writing because it was too long, designed to output JSON."},
            {"role": "user", "content": prompt}
        ]
        )
        generated_text=completion.choices[0].message.content
        return generated_text
    except Exception as e :
        print("Erreur : ", e )





def fixJsonObject(json_object,text,url):
    """
    fix json object

    this method makes sure the json object provided as a reponse of gpt-3.5 model follows the exact structure of the articles stored in the database
    :param json_object: the json string returned by gpt-3.5 "converted to a JSON object"
    :type json_object: dict 
    :param text: the entire text extracted from the pdf, to be added to the final article structure
    :type text: string
    :param url: the exact path to the pdf file 
    :type url: string
    :return: the final article object structured according to what has been designed in the database
    :rtype: dict
    """
    intermediateObject = {}
    #use the intermediateObject to access data from "json_object" without facing problems of case sensitivity
    for key in json_object:
        intermediateObject[key.lower()]=key
    #progressively build the final correct structure of the json, based on the json returned by gpt-3.5 model that may have some errors in casing and existence of some fields
    finalObject = {}
    finalObject["title"]=json_object[intermediateObject["title"]] if "title" in intermediateObject else "non trouvé"
    finalObject["abstract"]=json_object[intermediateObject["abstract"]] if "abstract" in intermediateObject else "non trouvé"
    finalObject["authors"]=json_object[intermediateObject["authors"]] if "authors" in intermediateObject else []
    finalObject["institutions"]=json_object[intermediateObject["institutions"]] if "institutions" in intermediateObject else []
    finalObject["keywords"]=json_object[intermediateObject["keywords"]] if "title" in intermediateObject else []
    finalObject["references"]=json_object[intermediateObject["references"]] if "references" in intermediateObject else []
    finalObject["url"]=url
    finalObject["publication_date"]=json_object[intermediateObject["publication_date"]] if "publication_date" in intermediateObject else "non trouvé"
    finalObject["text"]=text
    finalObject["validated"]=False
    return finalObject


def get_app_root_path():
    """
    get app root path

    this method allows to return the path of the application, to guarrantee a correct path naming no matter the os

    :return: the correct path according to the device
    :rtype: string
    """
    # Load app.py as a module to access its variables and functions
    app_module = SourceFileLoader('app', os.path.join(os.path.dirname(__file__), 'app.py')).load_module()

    # Retrieve the root path from the loaded app module
    app_root_path = app_module.app.root_path
    return app_root_path



def pdfToJson(fileName):
    """
    pdf to json

    this method gathers all previous methods to have the entire process of converting a pdf file into a json strucutre containing details and sections of the pdf file

    :param fileName: the name of the pdf file to be converted "example.pdf"
    :type fileName: string
    :return: dictionary containing the entire article included in the pdf file, structured to different sections like title, abstract, authors ... etc"
    :rtype: dict
    """
    app_root_path = get_app_root_path()
    upload_folder = os.path.join(app_root_path, 'uploads')
    urlToPdf = os.path.join(upload_folder, fileName)
    # json_results_folder = os.path.join(app.root_path, 'json_results')  # Define the JSON results folder path
    # urlToJson = os.path.join(json_results_folder, fileName + ".json")

    pureText = extractTextFromPDF(urlToPdf)
    gptText = gptTextAnalyser(pureText)
    gptJson = json.loads(gptText)
    verified_dict = fixJsonObject(gptJson, pureText, fileName)

    '''
    with open(urlToJson, "w") as json_file:
        json_file.write(json.dumps(verified_dict, indent=2))
    '''
    return verified_dict



