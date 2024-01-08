import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
import time
from datetime import datetime
import unicodedata

class TestArticleValidation(unittest.TestCase):

    # Change your query that you want to test it out here

    def setUp(self):
        self.search_words = [] # Words to be put within the search text field: write each word followed by a comma
        self.keywords_to_search = []
        self.authors_to_search = []
        self.institutions_to_search = [""]
        self.date_debut_search = "1990-01-01" #YYYY-MM-dd
        self.date_fin_search = "2008-01-01" #YYYY-MM-DD
        self.website_link = "http://localhost:3000/"

    def test_article_validation(self):

        search_text_field = ' '.join(self.search_words)
        search_validated = True

        options = Options()

        options.add_experimental_option("detach", True)

        driver_path = ChromeDriverManager().install()

        driver = webdriver.Chrome(service=Service(driver_path), options=options)

        driver.get(self.website_link)

        driver.maximize_window()

        user_input = driver.find_element(By.ID, "username")

        user_input.send_keys("clientbot")

        time.sleep(1)

        user_input = driver.find_element(By.ID, "password")

        user_input.send_keys("clientbot")

        user_input.send_keys(Keys.ENTER)

        try:
            user_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID,"search"))
            )
        except:
            driver.close()

        user_input.send_keys(search_text_field)

        user_input = driver.find_element(By.ID,"keywords")

        for words in self.keywords_to_search:
            user_input.send_keys(words)
            user_input.send_keys(Keys.ENTER)

        user_input = driver.find_element(By.ID,"author")

        for author_name in self.authors_to_search:
            user_input.send_keys(author_name)
            user_input.send_keys(Keys.ENTER)

        user_input = driver.find_element(By.ID,"institution")

        for institution in self.institutions_to_search:
            user_input.send_keys(institution)
            user_input.send_keys(Keys.ENTER)

        date_debut_input = driver.find_element(By.ID,"date_debut")

        driver.execute_script("arguments[0].setAttribute('value', arguments[1])", date_debut_input, self.date_debut_search)
        driver.execute_script("arguments[0].dispatchEvent(new Event('input', { bubbles: true }))", date_debut_input)

        date_fin_input = driver.find_element(By.ID,"date_fin")
        driver.execute_script("arguments[0].setAttribute('value', arguments[1])", date_fin_input, self.date_fin_search)
        driver.execute_script("arguments[0].dispatchEvent(new Event('input', { bubbles: true }))", date_fin_input)

        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.LINK_TEXT,"Lire plus"))
            )
        except:
            driver.close()

        lire_plus_elements = driver.find_elements(By.LINK_TEXT, "Lire plus")

        href_list = [element.get_attribute("href") for element in lire_plus_elements ]

        for href in href_list:
            
            driver.get(href)

            auteurs_element = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//p[text()='Auteurs:']"))
            )

            following_authors = auteurs_element.find_elements(By.XPATH, "following-sibling::p")

            authors_retrieved = [author.text for author in following_authors]

            all_authors_present = all_searched_words_exist(searched_words=self.authors_to_search, strings_retrieved=authors_retrieved)

            institutions_element = driver.find_element(By.XPATH, "//p[text()='Institutions:']")

            following_institutions = institutions_element.find_elements(By.XPATH, "following-sibling::p")

            institutions_retrieved = [institution.text for institution in following_institutions]

            all_institutions_present = all_searched_words_exist(searched_words= self.institutions_to_search, strings_retrieved=institutions_retrieved)

            keywords_element = driver.find_element(By.XPATH, "//p[text()='Mots-clés:']")

            following_keywords = keywords_element.find_elements(By.XPATH, "following-sibling::p")

            keywords_retrieved = [keyword.text for keyword in following_keywords]

            all_keywords_present = all_searched_words_exist(searched_words=self.keywords_to_search, strings_retrieved=keywords_retrieved)

            date_element = driver.find_element(By.XPATH, "//p[text()='Date de publication:']")

            date = date_element.find_element(By.XPATH, "following-sibling::p").text

            date_valide = is_between_dates(initial_date_str=self.date_debut_search, final_date_str=self.date_fin_search, date_to_check_str=date)

            text_element = driver.find_element(By.XPATH, "//p[text()='Texte intégral:']")

            text_retrieved = text_element.find_element(By.XPATH, "following-sibling::p").text

            all_words_exist = check_all_words_existence(words=self.search_words, text_content=text_retrieved)

            if not all_authors_present or not all_institutions_present or not all_keywords_present or not all_words_exist or not date_valide:
                print("Validation failed for the following article:")
                print(f"----> Authors present: {authors_retrieved}")
                print(f"** Authors searched: {self.authors_to_search}")
                print(f"----> Institutions present: {institutions_retrieved}")
                print(f"** Institutions searched: {self.institutions_to_search}")
                print(f"----> Keywords present: {keywords_retrieved}")
                print(f"** Keywords searched: {self.keywords_to_search}")
                print(f"----> Integral text content: {text_retrieved}")
                print(f"** Words being searched within the integral text: {self.search_words}")
                print(f"----> Publish date: {date}")
                print(f"** Starting date: {self.date_debut_search}, Ending date: {self.date_fin_search}")
                search_validated = False
                break
        driver.close()
        self.assertEqual(search_validated, True)

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

if __name__ == "__main__":
    unittest.main()