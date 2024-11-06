# app.py
from flask import Flask, jsonify

# Flask 애플리케이션 생성
app = Flask(__name__)

# 기본 라우트
@app.route('/')
def home():
    return "Welcome to the TPO Project!"

# 예제 API 엔드포인트
@app.route('/api/example', methods=['GET'])
def example():
    return jsonify({"message": "This is an example API endpoint."})

# 애플리케이션 실행
if __name__ == '__main__':
    app.run(debug=True)