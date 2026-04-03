from flask import jsonify


def success_response(message,data=None,status_code=200):
    if data is None:
        return jsonify({"status":"success","message":message}),status_code
    return jsonify({"status":"success","message":message,"data":data}),status_code

def error_response(message,status_code=400):
    return jsonify({"status":"error","message":message}),status_code