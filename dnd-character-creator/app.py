from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Character, CharacterSchema
import jwt
import datetime
from functools import wraps
from marshmallow.exceptions import ValidationError


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['SECRET_KEY'] = 'warrino'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate = Migrate(app, db)


def generate_token(user):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=365, minutes=30),
        'iat': datetime.datetime.utcnow(),
        'sub': user.id
    }
    return jwt.encode(
        payload,
        app.config.get('SECRET_KEY'),
        algorithm='HS256'
    )


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['sub']).first()   
        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated


@app.route('/')
def home():
    return "Welcome to KingMaker!"


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    email = data['email']

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password, email=email)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Registered successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid username or password"}), 401

    token = generate_token(user)
    
    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
    }

    return jsonify({"message": "Logged in successfully", "token": token, "user": user_data}), 200



@app.route('/characters', methods=['GET'])
@token_required
def get_characters(current_user):
    characters = Character.query.filter_by(user_id=current_user.id).all()

    if characters:
        return jsonify([char.to_dict() for char in characters]), 200
    else:
        return jsonify([]), 200


@app.route('/characters', methods=['POST'])
@token_required
def create_character(current_user):
    schema = CharacterSchema()
    try:
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify(err.messages), 400

    new_character = Character(
        name=data['name'],
        race=data['race'],
        profession=data['profession'],
        age=data['age'],
        weight=data['weight'],
        strength=data['strength'],
        dexterity=data['dexterity'],
        constitution=data['constitution'],
        intelligence=data['intelligence'],
        wisdom=data['wisdom'],
        charisma=data['charisma'],
        user_id=current_user.id,
        email=current_user.email
    )

    db.session.add(new_character)
    db.session.commit()

    result = schema.dump(new_character)

    return jsonify({'id': new_character.id, **result}), 201


@app.route('/characters/<int:character_id>', methods=['GET'])
@token_required
def get_character(current_user, character_id):
    character = Character.query.get(character_id)
    if character is None or character.user_id != current_user.id:
        return jsonify({"error": "Character not found"}), 404

    return jsonify(character.to_dict()), 200


@app.route('/characters/<int:character_id>', methods=['DELETE'])
@token_required
def delete_character(current_user, character_id):
    print('test')
    character = Character.query.get(character_id)
    
    if character is None or character.user_id != current_user.id:
        return jsonify({"error": "Character not found"}), 404
    
    db.session.delete(character)
    db.session.commit()

    return jsonify({"message": "Character deleted successfully"}), 200

@app.route('/all', methods=['GET'])
@token_required
def get_all_characters(current_user):
    schema = CharacterSchema()
    characters = Character.query.all()
    result = [schema.dump(character) for character in characters]
    return jsonify({"characters": result})



@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not Found"}), 404


@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Internal Server Error"}), 500


if __name__ == '__main__':
    app.run(debug=True)


