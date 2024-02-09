import os, requests
from flask import Flask,request,jsonify,make_response
from routes import routes
from dotenv import load_dotenv
from flask_cors import CORS


load_dotenv()
app = Flask(__name__,static_folder='static')
CORS(app, origins=[os.environ.get("CORS_ENDPOINT")])
app.config.from_mapping(
SECRET_KEY=os.environ.get("SECRET_KEY"),
DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
)

@app.route('/')
def homepage():
    return app.send_static_file("index.html")

app.register_blueprint(routes)


if __name__ == '__main__':
    app.run(debug=False)
    


