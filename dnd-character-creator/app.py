from flask import Flask, request, jsonify, session
from flask_migrate import Migrate
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Character, CharacterSchema
import jwt
import datetime

def generate_token(user):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=30),
        'iat': datetime.datetime.utcnow(),
        'sub': user.id
    }
    return jwt.encode(
        payload,
        app.config.get('SECRET_KEY'),
        algorithm='HS256'
    )

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'warrino'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate = Migrate(app, db)

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

    print(f'User-supplied password: {password}')
    if user:
        print(f'Hash from database: {user.password}')
        print(f'Result of check_password_hash: {check_password_hash(user.password, password)}')

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid username or password"}), 401

    session['user_id'] = user.id

    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email
    }

    token = generate_token(user)

    return jsonify({"message": "Logged in successfully", "user": user_data, "token": token}), 200



@app.route('/logout', methods=['GET'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/characters', methods=['GET'])
def get_characters():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

    characters = Character.query.filter_by(user_id=session['user_id']).all()
    return jsonify([char.to_dict() for char in characters]), 200

@app.route('/characters', methods=['POST'])
def create_character():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

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
        user_id=session['user_id'],
        email=data['email']  
    )

    db.session.add(new_character)
    db.session.commit()

    return jsonify({"message": "Character created successfully"}), 201


@app.route('/characters/<int:character_id>', methods=['PUT'])
def update_character(character_id):
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

    character = Character.query.get(character_id)
    if character is None or character.user_id != session['user_id']:
        return jsonify({"error": "Character not found"}), 404

    data = request.get_json()
    try:
        data = CharacterSchema().load(data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    for key, value in data.items():
        setattr(character, key, value)
    db.session.commit()

    return jsonify({"message": "Character updated successfully"}), 200

@app.route('/characters/<int:character_id>', methods=['DELETE'])
def delete_character(character_id):
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

    character = Character.query.get(character_id)
    if character is None or character.user_id != session['user_id']:
        return jsonify({"error": "Character not found"}), 404

    db.session.delete(character)
    db.session.commit()

    return jsonify({"message": "Character deleted successfully"}), 200


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not Found"}), 404

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(debug=True)

