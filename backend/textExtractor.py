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
    # Use regular expressions to remove non-ASCII characters
    pattern = re.compile(r'[^\x00-\x7F%s\n]+' % re.escape("éèàáäûúüö"))
    cleaned_text = pattern.sub(' ', text)
    cleaned_text = re.sub(' +',' ',cleaned_text)
    return cleaned_text


def extractTextFromPDF(path):
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
    # usage of an external "paid" service "openAI api" by letting gpt_3.5 model to deduce all the elements of an article from pure text 
    try:
        #making sure the text does not surpass the number of tokens limit
        max_number_of_tokens = 9000
        words = text.split()
        print(words)
        if len(words) > max_number_of_tokens:
            updatedWords = words[:4500] + words[-4500:]
        else:
            # If the number of tokens is within the limit, no truncation is needed
            updatedWords = words

        # Join the words to form the truncated string
        finalText = ' '.join(updatedWords)
        prompt = f"Extract the exact following sections from the provided text :\n\n{finalText}\nthe json file contains only: \nAuthors:'a list of strings'\nTitle:\nAbstract:-the paragraph written in the section: abstract-\nInstitutions:'a list of strings'\nKeyWords:'a list of strings, all the keywords in the -keywords section-'\nReferences:'a list of strings, all references in the section : references'\nPublication_date:'YYYY-MM-DD'"
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
    # gpt_3.5 model returns a json, this method will make sure all field names are indeed correct
    intermediateObject = {}
    #use the intermediateObject to access data from "json_object" without facing problems of case sensitivity
    #the only thing left to do is to guarantee that all fields are here, if not you fill them with blank
    for key in json_object:
        intermediateObject[key.lower()]=key
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



def pdfToJson(fileName):
    #final method which uses all previously defined method, and this is the exported function that the article controller will actually use
    urlToPdf = "../frontend/public/docs/"+fileName
    #urlToJson = "./json_results/"+fileName+".json"

    pureText = extractTextFromPDF(urlToPdf)
    gptText = gptTextAnalyser(pureText)
    gptJson = json.loads(gptText)
    verified_dict = fixJsonObject(gptJson,pureText,urlToPdf)

    '''
    with open(urlToJson,"w") as json_file:
        json_file.write(json.dumps(verified_dict,indent=2))
    '''
    return verified_dict



