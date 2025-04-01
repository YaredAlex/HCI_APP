from flask import Flask,jsonify
from flask import request as req
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
from google import genai
from dotenv import load_dotenv 
import os
load_dotenv()
app = Flask('__name__')
CORS(app)
@app.route('/api/search',methods=['post'])
def search():
    url = req.json
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

@app.route("/api/chat-ai",methods=['POST'])
def summarize():
    query = req.json
    prompt = f'''
        context:
        {query['content']}

        query:
        {query['message']}
    '''

    client = genai.Client(api_key=os.getenv('GEMINI_API'))
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents= prompt,
    )
    return jsonify({'summary':response.text})


app.run(debug=True)