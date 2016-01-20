InSwitch
===================

Author: Tom Wu, Sivaneshwaran Loganathan

Introduction
---------------
InSwitch is a non-intrusive remotely operated light-switch flipper. It can easily be mounted onto existing light switches without touching the internal wiring of the room, so non-technical users can install InSwitch easily. The user can trigger flips of the switch remotely as long as he/she is connected to the internet. An audio cue can also be used to activate the switch with either a voice-recognition or a speech-recognition setting.

Technology
--------------
####Software 
The front-end was written in Angular..JS with most of the layouts in Google's Angular Material tools. The back-end was written using the Flask library (Python)

####Hardware
In order to connect the switch to the internet, we are using a Photon.

API
----
* /&lt;name>/&lt;id>
	* Add a switch which has the name &lt;name> and id &lt;id>
* /updateState
	* Http POST method which is used to post the form for a specific switch to the server to be updated in the mySQL database
* /switchList
	* Obtain the list of switches as a json object
* /switchStateID/&lt;id>
	* Obtain the switch state as either "ON" or "OFF" of the switch which has the id &lt;id>
* /updateStateUsingSensor
	* HTTP POST method to update a switch with a JSON object of form {id:'id',state:'state'}
