import os, requests
from flask import Flask,request,jsonify,make_response

from dotenv import load_dotenv

load_dotenv()

def create_app(test_config=None):
    # App configuration
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY"),
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/')
    def homepage():
        return app.send_static_file("index.html")

    @app.route('/stock-ticker', methods = ["GET"])
    def stock_ticker():
        search_string=request.args.get('ticker')
        search_string=(search_string,False)[search_string is None]
        if search_string:
            stock_data=requests.get("{}/search?q={}&token={}".format(os.environ.get("FINHUB_ENDPOINT"),search_string,os.environ.get("FINHUB_API_KEY")))
            if stock_data.status_code == 200:
                stock_data=stock_data.json()["result"]
                if stock_data:
                    stock_data=stock_data[0]
                else:
                    stock_data=[]
            else :
                stock_data=(make_response(jsonify({"Error":"Finhub Api Error"}),502),stock_data.json())
            
            
        else:
            stock_data= make_response(jsonify({"Error":"No Search String Provided"}),400)
        return stock_data

    return app