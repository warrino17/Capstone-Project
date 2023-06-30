from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from marshmallow import Schema, fields

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    characters = db.relationship('Character', backref='creator', lazy=True)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"


class Character(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    race = db.Column(db.String(20), nullable=False)
    profession = db.Column(db.String(30), nullable=False)
    age = db.Column(db.Integer)
    weight = db.Column(db.Float)
    strength = db.Column(db.Integer)
    dexterity = db.Column(db.Integer)
    constitution = db.Column(db.Integer)
    intelligence = db.Column(db.Integer)
    wisdom = db.Column(db.Integer)
    charisma = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    email = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f"Character('{self.name}', '{self.race}', '{self.profession}')"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "race": self.race,
            "profession": self.profession,
            "age": self.age,
            "weight": self.weight,
            "strength": self.strength,
            "dexterity": self.dexterity,
            "constitution": self.constitution,
            "intelligence": self.intelligence,
            "wisdom": self.wisdom,
            "charisma": self.charisma,
            "user_id": self.user_id,
            "email": self.email
        }

class CharacterSchema(Schema):
    name = fields.Str(required=True)
    race = fields.Str(required=True)
    profession = fields.Str(required=True)
    age = fields.Int()
    weight = fields.Float()
    strength = fields.Int()
    dexterity = fields.Int()
    constitution = fields.Int()
    intelligence = fields.Int()
    wisdom = fields.Int()
    charisma = fields.Int()
    email = fields.Str(required=True)