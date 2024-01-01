import unittest
import requests


class TestAPI(unittest.TestCase):

    def setUp(self):

        # Make sure to have the mod corresponding to id_mod and username_mod within the DB
        self.id_mod = '1' # Mod id to delete
        self.username_mod = "test_delete" # Username of the mod to be deleted

        self.URL = "http://localhost:5000" # URL of the website

        self.new_user = { # The new mod to be added (it should not already exist within the db)
            "username":"mod_add_test",
            "password":"esi.igl.23"
        }

        # Article id to remover from user_id's preferences (make sure this record exist within the DB to have a test validated)
        self.user_id = "0be6e6cfd1a7430182285b72dc0e2421"
        self.article_id = "dummy_article_id"

    def test_add_mod(self):
        resp = requests.post(self.URL+"/api/mods",json=self.new_user)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()['username'], self.new_user['username'])

    def test_delete_mod(self):
        resp = requests.delete(self.URL+"/api/mods/"+self.id_mod)
        self.assertEqual(resp.status_code, 200)
        self.assertDictEqual(resp.json(), {"id":self.id_mod, "username":"test_delete"})

    def test_unlike_article(self):
        resp = requests.delete(self.URL+"/api/favoris/"+self.user_id+"/"+self.article_id)
        self.assertEqual(resp.status_code, 200)
        self.assertDictEqual(resp.json(), {"user_id":self.user_id, "article_id":self.article_id})


if __name__ == "__main__":
    unittest.main()