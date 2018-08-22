import unittest
from kenny_death_log import app

class TestAppRouting(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_home_page(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

    def test_about_page(self):
        response = self.app.get('/about')
        self.assertEqual(response.status_code, 200)

    def test_cartman_page(self):
        response = self.app.get('/cartman')
        self.assertEqual(response.status_code, 200)

    def test_stan_page(self):
        response = self.app.get('/stan')
        self.assertEqual(response.status_code, 200)

    def test_kyle_page(self):
        response = self.app.get('/kyle')
        self.assertEqual(response.status_code, 200)

    def test_kenny_page(self):
        response = self.app.get('/kenny')
        self.assertEqual(response.status_code, 200)

    def test_deaths_page(self):
        response = self.app.get('/deaths')
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
  unittest.main()
