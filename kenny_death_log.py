from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'kennysDeaths')
COLLECTION_NAME = 'deaths'


@app.route('/')
def home():
    return render_template("home.html")

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/cartman')
def cartman():
    return render_template("cartman.html")

@app.route('/stan')
def stan():
    return render_template("stan.html")

@app.route('/kyle')
def kyle():
    return render_template("kyle.html")

@app.route('/kenny')
def kenny():
    return render_template("kenny.html")

@app.route('/deaths')
def deaths_page():
    return render_template("deaths.html")

@app.route('/kennysDeaths/deaths')
def death_methods():

    FIELDS = {
        '_id': False, 'SEASON': True, 'EPISODE': True, 'METHOD': True, 'QUOTE': True
    }

    with MongoClient(MONGO_URI) as conn:
        collection = conn[DBS_NAME][COLLECTION_NAME]
        deaths = collection.find(projection=FIELDS)
        return json.dumps(list(deaths))


if __name__ == '__main__':
    app.run(debug=False)
