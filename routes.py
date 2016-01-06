from flask import Flask
import tempfile 
import os.path
from flask_sqlalchemy import SQLAlchemy
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(
    tempfile.gettempdir(), 'test.db')
db = SQLAlchemy(app)

class switchClass(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(80));
    identifier = db.Column(db.Integer, unique=True);
    state = db.Column(db.Integer)
    
    def __init__(self,name,identifier):
        self.name=name
        self.identifier = identifier
        self.state = 0
    
    def __repr__(self):
        jsonDicionary = {'name':self.name,'identifier':self.identifier,'state':self.state}
        jsonString = json.dumps(jsonDicionary)
        return jsonString

db.create_all()

#switch this to a post method, need to figure out override
@app.route("/<switchName>/<switchID>")
def switchAdd(switchName,switchID):
    switchNew = switchClass(switchName,switchID)
    db.session().add(switchNew)
    db.session().commit()
    return "added to Database"

#this is the get api, format it to JSON?
@app.route("/results")
def displayResults():
    user = switchClass.query.all()
    userStr = str(user)
    return userStr

if __name__=="__main__":
    app.run(debug=True)