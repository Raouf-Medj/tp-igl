import unittest
import requests

class DeleteModTest(unittest.TestCase):

    def setUp(self):

        self.URL = "http://localhost:5000"

        self.id_existing_mod = "1"

        self.username_existing_mod = "test_delete"

        self.id_nonexisting_mod = "210010hywqzk"

    def test_delete_nonexisting_mod(self):
        resp = requests.delete(self.URL+"/api/mods/"+self.id_nonexisting_mod)
        self.assertEqual(resp.status_code, 404)
        response_data = resp.json()
        self.assertIn('error',response_data)
        self.assertEqual(response_data['error'],"Utilisateur introuvable")

    def test_delete_existing_mod(self):
        resp = requests.delete(self.URL+"/api/mods/"+self.id_existing_mod)
        self.assertEqual(resp.status_code, 200)
        self.assertDictEqual(resp.json(), {"id":self.id_existing_mod, "username":self.username_existing_mod})

if __name__ == "__main__":
    unittest.main()

