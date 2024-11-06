import pandas as pd
import psycopg2
import tensorflow as tf
from flask import Flask, request, jsonify
from sklearn.model_selection import train_test_split
from apscheduler.schedulers.background import BackgroundScheduler
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Embedding, Flatten, Concatenate


# 데이터베이스 설정
DB_HOST = "DB_HOST"
DB_NAME = "DB_NAME"
DB_USER = "DB_USER"
DB_PASSWORD = "DB_PASSWORD"

# Flask 앱 생성
app = Flask(__name__)

# 모델 초기화
model = None

# 데이터베이스에서 데이터 불러오기 함수

def load_data():
    # 데이터베이스 연결
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

    # 데이터 가져오기
    query = "SELECT user_id, post_id, activity_type, weather_keywords, season_keywords, activity_date FROM UserActivityData"
    data = pd.read_sql(query, conn)
    conn.close()  # 연결 종료
    return data

# 데이터 전처리 및 모델 학습 함수
def train_model():
    global model
    data = load_data()

    # One-hot encoding 및 데이터 전처리
    data = pd.get_dummies(data, columns=['activity_type', 'weather_keywords', 'season_keywords'])
    X = data.drop(['user_id', 'post_id', 'activity_date'], axis=1)
    y = data['user_id']

    # 학습/테스트 데이터 분리
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 모델 구성
    num_users = data['user_id'].nunique()
    num_posts = data['post_id'].nunique()
    embedding_dim = 50

    user_input = Input(shape=(1,), name="user_id")
    user_embedding = Embedding(input_dim=num_users, output_dim=embedding_dim)(user_input)
    user_vec = Flatten()(user_embedding)

    post_input = Input(shape=(1,), name="post_id")
    post_embedding = Embedding(input_dim=num_posts, output_dim=embedding_dim)(post_input)
    post_vec = Flatten()(post_embedding)

    features_input = Input(shape=(X_train.shape[1],), name="features")
    features_dense = Dense(128, activation='relu')(features_input)

    concat = Concatenate()([user_vec, post_vec, features_dense])
    dense = Dense(256, activation='relu')(concat)
    dense = Dense(128, activation='relu')(dense)
    output = Dense(1, activation='sigmoid')(dense)

    model = Model(inputs=[user_input, post_input, features_input], outputs=output)
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

    model.fit(
        [X_train['user_id'], X_train['post_id'], X_train],
        y_train,
        validation_data=([X_test['user_id'], X_test['post_id'], X_test], y_test),
        epochs=10,
        batch_size=64
    )

    # 모델을 메모리에 로드하고 저장
    model.save("recommendation_model.h5")
    print("Model retrained and saved.")

# 초기 모델 학습
train_model()

# 스케줄러 설정: 매일 모델을 재학습
scheduler = BackgroundScheduler()
scheduler.add_job(train_model, 'interval', days=1)  # 1일마다 재학습
scheduler.start()

# API 엔드포인트 설정
@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    user_id = data['user_id']
    post_id = data['post_id']
    features = pd.DataFrame([data['features']])

    # 예측 수행
    prediction = model.predict([pd.DataFrame([user_id]), pd.DataFrame([post_id]), features])

    return jsonify({'recommendation_score': float(prediction[0][0])})

# Flask 서버 실행
if __name__ == '__main__':
    app.run(port=5000)