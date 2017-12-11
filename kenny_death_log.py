from flask import Flask
from flask import render_template

app = Flask(__name__)


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


if __name__ == '__main__':
    app.run(debug=True)
