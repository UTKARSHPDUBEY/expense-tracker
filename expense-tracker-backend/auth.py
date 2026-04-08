from flask import request,Blueprint
from db import get_connection
from utils import error_response,success_response
from mysql.connector import IntegrityError
import bcrypt
import os
import jwt
from datetime import datetime,timedelta
from functools import wraps


auth_bp = Blueprint("auth", __name__)
def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if request.method == "OPTIONS":
            return "", 200
        auth_headers=request.headers.get("Authorization")
        if not auth_headers:
            return error_response("Authorization header missing",401)
        parts=auth_headers.split(" ")
        if len(parts)!=2 or parts[0]!="Bearer":
            return error_response("Invalid header format",401)
        token=parts[1]
        try:
            SECRET_KEY=os.getenv("SECRET_KEY")
            decoded_token=jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            return f(decoded_token, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return error_response("Token has expired", 401)
        except jwt.InvalidTokenError:
            return error_response("Invalid Token", 401)
    return wrapper
        

    



@auth_bp.route('/me',methods=['GET','OPTIONS'])
@token_required
def get_me(current_user):
    con=get_connection()
    if not con:
        return error_response("Database connection failed",500)
    cursor=None
    try:
        cursor=con.cursor(dictionary=True)
        query="SELECT id,name,email FROM users where id=%s"
        values=(current_user["user_id"],)
        cursor.execute(query,values)
        rows=cursor.fetchone()
        return success_response("User info",rows,200)
    except Exception as e:
        return error_response("Internal server error", 500) 
    finally:
        if cursor:
            cursor.close()
        if con:
            con.close()



@auth_bp.route('/register',methods=['POST','OPTIONS'])
def post_user():
    data=request.json
    if not data:
        return error_response("No JSON data provided",400)
    name=data.get("name")
    email=data.get("email")
    password=data.get("password")
    if not name or not email or not password:
        return error_response("Missing name or email or password",400)
    if "@" not in email:
        return error_response("Invalid email format", 400)
    if len(password)<8:
        return error_response("Password must be at least 8 characters long",400)
    password=password.encode()
    salt=bcrypt.gensalt()
    hashed_password=bcrypt.hashpw(password,salt)
    hashed_password=hashed_password.decode()
    con=get_connection()
    if not con:
        return error_response("Database connection failed",500)
    cursor=None
    try:
        cursor=con.cursor()
        query = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
        values = (name, email, hashed_password)
        cursor.execute(query, values)
        con.commit()
        new_user_id = cursor.lastrowid
        return success_response("User registered successfully",{
            "user_id": new_user_id,
            "name": name,
            "email": email}, 201)
    except IntegrityError:
        return error_response("Email already registered", 400)
    except Exception as e:
        return error_response("Internal server error", 500)
    finally:
        if cursor:
            cursor.close()
        if con:
            con.close()



@auth_bp.route('/login',methods=['POST','OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return "", 200
    data=request.json
    if not data:
        return error_response("No data available",400)
    email=data.get("email")
    password=data.get("password")
    if not email or not password:
        return error_response("Missing email or password", 400)
    con=get_connection()
    if not con:
        return error_response("Database connection failed",500)
    cursor=None
    try:
        cursor=con.cursor(dictionary=True)
        query="SELECT * FROM users WHERE email=%s"
        cursor.execute(query,(email,))
        user=cursor.fetchone()
        if not user:
            return error_response("invalid email or password", 401)
        password=password.encode()
        stored_password=user["password"].encode()
        valid=bcrypt.checkpw(password, stored_password)
        if not valid:
            return error_response("invalid email or password", 401)
        SECRET_KEY=os.getenv("SECRET_KEY")
        expiration_time = datetime.utcnow() + timedelta(hours=1)
        payload={
            "user_id":user["id"],
            "email":user["email"],
            "exp":expiration_time
        }
        token=jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        if isinstance(token, bytes):
            token = token.decode("utf-8")
        return success_response(
            "login successful",{
            "token":token
        },200)
    except Exception as e:
        return error_response("Internal server error", 500)
    finally:
        if cursor:
            cursor.close()
        if con:
            con.close()