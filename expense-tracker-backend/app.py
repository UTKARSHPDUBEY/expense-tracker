from flask import Flask
from flask_cors import CORS
from auth import auth_bp
from expenses import expenses_bp
from summary import summary_bp
from dotenv import load_dotenv
load_dotenv()


app=Flask(__name__)
app.url_map.strict_slashes = False
CORS(app,supports_credentials=True)
app.register_blueprint(auth_bp,url_prefix="/auth")
app.register_blueprint(expenses_bp,url_prefix="/expenses")
app.register_blueprint(summary_bp,url_prefix="/expenses/summary")
    

if __name__=='__main__':
    app.run(debug=True)