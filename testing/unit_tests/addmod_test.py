import unittest
import requests

class AddModTest(unittest.TestCase):

    def setUp(self):

        self.URL = "http://localhost:5000"

        self.existing_mod = {
            "username":"cherfa",
            "password":"mohamed.2023"
        }

        self.new_mod = {
            "username":"new_mod_test",
            "password":"esi.igl.23"
        }

        self.invalid_username = {
            "username":"@$mod$%",
            "password":"mod.scifetch.hacker"
        }

        self.invalid_password = {
            "username":"rayane_bkb",
            "password":"ryn.23"
        }

    def test_add_existing_mod(self):
        resp = requests.post(self.URL+"/api/mods",json=self.existing_mod)
        self.assertEqual(resp.status_code, 409)
        self.assertDictEqual(resp.json(), {"error":"Nom d'utilisateur déjà existant"})

    def test_add_new_mod(self):
        resp = requests.post(self.URL+"/api/mods",json=self.new_mod)
        self.assertEqual(resp.status_code, 200)
        response_data = resp.json()
        self.assertIn('id',response_data)
        self.assertIn('username', response_data)
        self.assertEqual(response_data['username'],self.new_mod['username'])

    def test_add_new_mod_invalid_username(self):
        resp = requests.post(self.URL+"/api/mods",json=self.invalid_username)
        self.assertEqual(resp.status_code, 400)
        self.assertDictEqual(resp.json(), {"error":"Nom d'utilisateur invalide"})
      
    def test_add_new_mod_invalid_password(self):
        resp = requests.post(self.URL+"/api/mods",json=self.invalid_password)
        self.assertEqual(resp.status_code, 400)
        self.assertDictEqual(resp.json(), {"error":"La longueur du mot passe doit être supérieure à 8"})

if __name__ == "__main__":
    unittest.main()