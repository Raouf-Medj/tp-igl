import unittest
import requests

class DeleteModTest(unittest.TestCase):

    def setUp(self):

        self.URL = "http://localhost:5000"

        self.id_user = "50f3495eb6a7490b8867546ad48240c0"

        self.id_existing_article= "dummy_article_id"

        self.id_nonexisting_article= "non_existing_article_id"

    def test_unlike_existing_article(self):
        resp = requests.delete(self.URL+"/api/favoris/"+self.id_user+"/"+self.id_existing_article)
        self.assertEqual(resp.status_code, 200)
        self.assertDictEqual(resp.json(), {"user_id":self.id_user, "article_id":self.id_existing_article})

    def test_unlike_nonexisting_article(self):
        resp = requests.delete(self.URL+"/api/favoris/"+self.id_user+"/"+self.id_nonexisting_article)
        self.assertEqual(resp.status_code, 404)
        self.assertDictEqual(resp.json(), {"error":"Article introuvable dans la liste des favoris de l'utilisateur"})

if __name__ == "__main__":
    unittest.main()