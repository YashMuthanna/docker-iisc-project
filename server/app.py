from flask import Flask, jsonify, request, send_from_directory
import urllib.request
import os
from werkzeug.utils import secure_filename 
from ultralytics import YOLO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'static/uploads'
PROCESSED_FOLDER = 'static/processed'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

model = YOLO('yolov8n.pt')  # pretrained YOLOv8n model

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def home():
    return "<p>Hello, World!</p>"

@app.route("/upload", methods=["POST"])
def file_upload():

    if 'files[]' not in request.files:
        resp = jsonify({
            "message": "No file part in request",
            "status": "failed"
        })
        resp.status_code = 400
        return resp
    
    files = request.files.getlist('files[]')
    print(files)
    success = False

    for file in files:
        if file and allowed_file(file.filename):
           
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            results = model([os.path.join(app.config['UPLOAD_FOLDER'], filename)])
            processed_filename = f"processed_{filename}"
            results[0].save(filename=os.path.join(app.config['PROCESSED_FOLDER'], processed_filename))


            success = True
        else:
            resp = jsonify({
                "message": 'Files type not allowed',
                "status": 'failed'
            })
            return resp
    if success:
        resp = jsonify({
        "message": 'Files successfully uploaded',
        "status": 'success'
    })
        resp.status_code = 201
        return resp
    
    return resp

@app.route("/processed/<filename>", methods=["GET"])
def get_processed_file(filename):
    return send_from_directory(app.config['PROCESSED_FOLDER'], filename)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

