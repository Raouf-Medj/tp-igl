from flask import Flask, request, abort, jsonify, session
from models import db, User, RoleEnum
from flask_bcrypt import Bcrypt

# Flask instance
app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:scifetch.23@db.bglmxtkawutiaiyihpij.supabase.co:5432/postgres"
app.config["SECRET_KEY"] = "zYpEicDyBgF704lYByrQVVDqDd3eRX0b"
# app.config["SQLALCHEMY_ECHO"] = True

bcrypt = Bcrypt(app)
db.init_app(app)


with app.app_context():
    db.create_all()


# Handling requests
@app.route('/api/register', methods=['POST'])
def register():
    username = request.json["username"]
    password = request.json["password"]
    role = request.json["role"]

    user_exists = User.query.filter_by(username=username).first() is not None

    if user_exists:
        abort(409, "Username already exists")

    try:
        enum_role = RoleEnum.__members__[role]
    except KeyError:
        abort(400, "Invalid role")

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(username=username, password=hashed_password, role=enum_role)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
        "role": new_user.role.name
    })

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json["username"]
    password = request.json["password"]
    # role = request.json["role"]

    user = User.query.filter_by(username=username).first()

    if user is None:
        abort(401, "Username does not exist")

    if not bcrypt.check_password_hash(user.password, password):
        abort(401, "Wrong password")

    # connect users respectively (client, mod, admin)

    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
        "role": new_user.role.name
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

