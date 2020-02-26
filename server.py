import json
from flask import Flask, make_response, g, request, send_file
import requests
import jwt
import time

CONGRATULATION_URL = 'http://pozdravlala.ru/gen'

def get_congratulation():
    response = requests.post(CONGRATULATION_URL, data='[3,1,2,0,0]')

    if response.status_code != 200:
        raise RuntimeError("Invalid response received: code: %d, message: %s" % (
            response.status_code, response.text))

    return response.json()['text']


TOKENS_URL = 'https://iam.api.cloud.yandex.net/iam/v1/tokens'
SYNTHESIZE_URL = 'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize'

IAM_TOKEN = None


def get_private_key(private_key_path):
    with open(private_key_path, 'r') as f:
        return f.read()


def create_jwt_token(private_key, service_account_id, key_id):
    now = int(time.time())
    payload = {
        'aud': TOKENS_URL,
        'iss': service_account_id,
        'iat': now,
        'exp': now + 360}

    return jwt.encode(payload, private_key, algorithm='PS256', headers={'kid': key_id}).decode('utf-8')


def get_iam_token(jwt_token):
    data = {
        'jwt': jwt_token
    }

    response = requests.post(TOKENS_URL, data=json.dumps(data))

    if response.status_code != 200:
        raise RuntimeError("Invalid response received: code: %d, message: %s" % (
            response.status_code, response.text))

    return response.json()['iamToken']


def synthesize(text, iam_token, folder_id):
    headers = {
        'Authorization': 'Bearer ' + iam_token,
    }

    data = {
        'text': text,
        'emotion': 'good',
        'folderId': folder_id,
        'spead': "0.1"
    }

    resp = requests.post(SYNTHESIZE_URL, headers=headers, data=data)
    if resp.status_code != 200:
        raise RuntimeError("Invalid response received: code: %d, message: %s" % (
            resp.status_code, resp.text))

    return resp.content


def get_settings():
    with open("settings.json", "r") as f:
        return json.load(f)


def create_app():
    app = Flask(__name__, instance_relative_config=True,
                static_url_path='', static_folder="static")
    settings = get_settings()
    app.config.from_mapping(
        SECRAT_KEY='dev',
    )
    app.config["service_account_id"] = settings['service_account_id']
    app.config["key_id"] = settings['key_id']
    app.config["folder_id"] = settings['folder_id']
    app.config["private_key_path"] = settings['private_key_path']
    app.config['db'] = dict()

    @app.route("/")
    def index():
        return send_file("static/index.html")

    @app.route('/text', methods=['POST'])
    def test():
        text = request.args.get('text')

        if 'iam_token' not in app.config:
            private_key = get_private_key(app.config['private_key_path'])
            app.config['iam_token'] = get_iam_token(create_jwt_token(
                private_key,
                app.config['service_account_id'],
                app.config['key_id']
            ))

        voice = synthesize(
            text,
            app.config['iam_token'],
            app.config['folder_id']
        )
        response = make_response(voice)
        response.headers.set('Content-Type', 'audio/ogg;codecs=opus')
        return response

    @app.route('/congratulation', methods=["GET", "POST"])
    def congratulation():
        if request.method == 'POST':
            name = request.args.get('name')
            congratulation = get_congratulation()
            text = "! ".join([name, congratulation])
            return text

        text = request.args.get('text')

        if 'iam_token' not in app.config:
            print('not in g')
            private_key = get_private_key(app.config['private_key_path'])
            app.config['iam_token'] = get_iam_token(create_jwt_token(
                private_key,
                app.config['service_account_id'],
                app.config['key_id']
            ))

        voice = synthesize(
            text,
            app.config['iam_token'],
            app.config['folder_id']
        )

        response = make_response(voice)
        response.headers.set('Content-Type', 'audio/ogg;codecs=opus')
        return response

    return app

if __name__ == "__main__":
    create_app().run(host='0.0.0.0', port="80")