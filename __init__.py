from flask import Flask, redirect, url_for
import tempfile 
import os.path
from flask_sqlalchemy import SQLAlchemy
from flask import request
import json
from flask.templating import render_template
from time import strftime
import keys

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = keys.MYSQL_KEY;
db = SQLAlchemy(app)

class switchClass(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80));
    identifier = db.Column(db.Integer, unique=True);
    state = db.Column(db.String(3));
    location = db.Column(db.String(80));
    notes = db.Column(db.String(150));
    timestamp = db.Column(db.String(80));
    
    def __init__(self, name, identifier, location, notes):
        self.name = name
        self.identifier = identifier
        self.state = 'OFF'
        self.location = location
        self.notes = notes
        self.timestamp = 'Not Triggered Yet'
    
    def __repr__(self):
        jsonDicionary = {'name':self.name, 'id':self.identifier, 'state':self.state, 'location':self.location, 'notes':self.notes, 'timestamp':self.timestamp}
        jsonString = json.dumps(jsonDicionary)
        return jsonString

#db.drop_all()
db.create_all()

# switch this to a post method, need to figure out override
@app.route("/<name>/<id>")
def switchAdd(name, id):
    switchNew = switchClass(name, id,'my house','lol')
    db.session.add(switchNew)
    db.session.commit()
    return "added To switchList"

# this should be a post method to update the state of the switch add {{url_for('updateState')}}
@app.route("/updateState", methods=['POST'])
def updateSwitchState():
    if request.method == 'POST':
        print request.form
        id = request.form['id']
        switchUpdate = switchClass.query.filter_by(identifier=id).first();
        switchUpdate.name = request.form['name'];
        switchUpdate.state = checkState(request.form['.state']);
        switchUpdate.location = request.form['location'];
        switchUpdate.notes = request.form['notes'];
        switchUpdate.timestamp = strftime("%Y-%m-%d %H:%M:%S")
        db.session.commit()
    return redirect(url_for("index"))

def checkState(state):
    if "RES" in state:
        return "RES"
    elif "ON" not in state:
        return "OFF"
    else:
        return "ON"

@app.route("/updateStateUsingSensor",methods=['POST'])
def updateStateFromSensor():
    if request.method == 'POST':
        data = request.get_json(force=True);
        id = data['id'];
        switchUpdate = switchClass.query.filter_by(identifier=id).first();
        switchUpdate.state = data['state'];

# this is the get api, format it to JSON?
@app.route("/switchList", methods=['GET'])
def displayList():
    user = switchClass.query.all()
    userStr = str(user)
    return userStr

@app.route("/switchStateID/<id>", methods=['GET'])
def getSwitchState(id):
    switchOfID = switchClass.query.filter_by(identifier=id).first()
    stringToReturn = {'state':switchOfID.state}
    return json.dumps(stringToReturn)

@app.route("/")
def index():
    return render_template("index.html")



if __name__ == "__main__":
    app.run()