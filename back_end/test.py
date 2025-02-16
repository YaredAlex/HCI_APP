from flask import Flask,jsonify
from flask import request as req
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests

app = Flask('__name__')
CORS(app)

@app.route('/api/search',methods=['post'])
def home():
    eg = 'https://www.geeksforgeeks.org/introduction-to-human-computer-interface-hci/'
    url = req.json
    print(url)
    result = requests.get(url['url'])
    soup = BeautifulSoup(result.content,'html.parser')
    article = soup.find('article',class_='content')
    try:
        article.find('div',class_='three_dot_dropdown_content').decompose()
        article.find('div',class_='three_dot_dropdown').decompose()
        article.find('div',class_='three_dot_dropdown_div three_dot_dropdown_likearticle').decompose()
    except Exception as e:
        print(e)
    # print(article.text)
    # print(article)
    # print(res.text)
    return jsonify({'article':f'''{article}''','text':article.text})

app.run(debug=True)