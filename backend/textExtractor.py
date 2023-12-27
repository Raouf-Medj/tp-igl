import fitz
import re
import os
from openai import OpenAI
import json
#import os
#import dotenv
#dotenv.load_dotenv('.env')
#print(os.environ['OPENAI_API_KEY'])
client = OpenAI(api_key="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")


def remove_non_ascii(text):
    # Use regex to remove non-ASCII characters
    pattern = re.compile(r'[^\x00-\x7F%s\n]+' % re.escape("éèàáäûúüö"))
    cleaned_text = pattern.sub(' ', text)
    cleaned_text = re.sub(' +',' ',cleaned_text)
    return cleaned_text


def extractTextFromPDF(path):
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
    prompt = f"Extract the exact following sections from the provided text :\n\n{text}\nthe json file contains only: \nAuthors:'a list of strings'\nTitle:\nAbstract:\nInstitutions:'a list of strings'\nKeyWords:'a list of strings'\nReferences:'a list of strings, mention everything'\nPublication_date:'YYYY-MM-DD'"
    completion = client.chat.completions.create(
    model="gpt-3.5-turbo-1106",
    response_format={ "type": "json_object" },
    messages=[
        {"role": "system", "content": "You extract data acurately as it is from the string, you DO NOT REFORMULATE EXTRACTED INFORMATION, you mention every single detail, and don't stop because of length, designed to output JSON."},
        {"role": "user", "content": prompt}
    ]
    )
    generated_text=completion.choices[0].message.content
    return generated_text


def textToJson(text):
    json_object = json.loads(text)
    json_data = json.dumps(json_object, indent=2)
    # Specify the file path where you want to save the JSON data
    return json_data

def fixJsonObject(json_object,text):
    intermediateObject = {}
    #use the intermediateObject to access data from "json_object" without facing problems of case sensitivity
    #the only thing left to do is to guarantee that all fields are here, if not you fill them with blank
    for key in json_object:
        intermediateObject[key.lower()]=key
    finalObject = {}
    finalObject["id"]="something"
    finalObject["title"]="something"
    finalObject["abstract"]="something"
    finalObject["authors"]="something"
    finalObject["institutions"]="something"
    finalObject["keywords"]="something"
    finalObject["references"]="something"
    finalObject["url"]="something"
    finalObject["publication_date"]="something"
    finalObject["text"]="something"
    finalObject["validated"]="something"


gptStuff = gptTextAnalyser(extractTextFromPDF("./static/dummy.pdf"))
writeStringToFile(gptStuff)
file_path = "article.json"
# Write the JSON data to the file
with open(file_path, "w") as json_file:
    json_file.write(textToJson(gptStuff))


