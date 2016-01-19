// This #include statement was automatically added by the Particle IDE.
#include "Adafruit_PWMServoDriver/Adafruit_PWMServoDriver.h"
#include "SparkJson/SparkJson.h"
#include "neopixel/neopixel.h"
#include "HttpClient/HttpClient.h"
#include <cstring>
#include <string>

/**
* Declaring the variables and constants
*/
const int ON_STATE = 0;
const int RESET_STATE = 3;
unsigned int nextTime = 0;    // Next time to contact the server
char onArray[] = "ON";
HttpClient http;
unsigned int servoDelay = 100;
Servo servo;
unsigned int currentState = 0;
unsigned int cWise = 1550;
unsigned int anticWise = 1425;
#define PIXEL_COUNT 1
#define PIXEL_PIN   D1
#define PIXEL_TYPE  WS2812B

http_header_t headers[] = {
    { "Accept" , "*/*"},
    { NULL, NULL } 
};

http_request_t request;
http_response_t response;
Adafruit_NeoPixel led = Adafruit_NeoPixel(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);

void setup() {
    led.begin();
    Serial.begin(9600);
    Serial.println("Hello");
    pinMode(D5, OUTPUT); //LED indicator switch
    digitalWrite(D5, HIGH); //Initial assumption that switch is on
    pinMode(D3,INPUT); //Limit Switch
    pinMode(D7,OUTPUT);
    servo.attach(D0);
    
    request.hostname = "colab-sbx-56.oit.duke.edu";
    request.port = 80;
    request.path = "/switchStateID/1";
}

void loop() {
    if (nextTime > millis()) {
        return;
    }

    http.get(request, response, headers);
    Serial.println(response.body);
    StaticJsonBuffer<200> jsonBuffer;
    char responseCharArray[1024];
    strcpy(responseCharArray, response.body.c_str());
    JsonObject& root = jsonBuffer.parseObject(responseCharArray);
    int comparison = strcmp (root["state"],onArray); //0 if ON
    if(currentState!=comparison){
        showTheRainbow();
        executeState(comparison);
        currentState=comparison;
    }
    nextTime = millis() + 2000;
}

void executeState(int state){
    if(state==ON_STATE){ 
        digitalWrite(D5, HIGH); 
        runServo(ON_STATE);
        led.setPixelColor(0, 0, 63, 0); //green
        led.show();
        Serial.println("ON");
    }
    else if(state==RESET_STATE){
        servoDelay = 400;
        digitalWrite(D7,HIGH);
        runServo(ON_STATE);
        delay(2000);
        led.setPixelColor(0, 63, 0, 0); //red
        led.show();
        digitalWrite(D7,LOW);
        
    }
    else{
        digitalWrite(D5, LOW); 
        runServo(state);
        led.setPixelColor(0, 255, 255, 0);
        led.show();
        Serial.println("OFF");
    }
}

void runServo(int servoState){
    if(servoState==ON_STATE){ //no limit switch; flip from off to on
        servo.writeMicroseconds(cWise);
        delay(servoDelay);
        servo.writeMicroseconds(1500);
        servoDelay = 0;
    }
    else{ //detect for limit Switch hitting to stop, flip from on to off
        servo.writeMicroseconds(anticWise);
        servoDelay = servoDelay + 5;
        delay(5);
        while(digitalRead(D3)==LOW){
            servoDelay = servoDelay + 5;
            delay(5);
        }
        servoDelay = servoDelay * 1.1;
        servo.writeMicroseconds(1500);
    }
}

void showTheRainbow() {
  // number of milliseconds to delay between pixel change
  // lower this number to speed up the rainbow
  int rainbowDelay = 10;

  // start with Red on, and make Green grow brighter
  for (int i = 0; i < 255; i += 10) {
    led.setPixelColor(0, 255, i, 0);
    led.show();
    delay(rainbowDelay);
  }
  // Green is now on, make Red shrink
  for (int i = 0; i < 255; i += 10) {
    led.setPixelColor(0, 255 - i, 255, 0);
    led.show();
    delay(rainbowDelay);
  }
  // Green is now on, make Blue grow
  for (int i = 0; i < 255; i += 10) {
    led.setPixelColor(0, 0, 255, i);
    led.show();
    delay(rainbowDelay);
  }
  // Blue is now on, make Green shrink
  for (int i = 0; i < 255; i += 10) {
    led.setPixelColor(0, 0, 255 - i, 255);
    led.show();
    delay(rainbowDelay);
  }
  // Blue is now on, make Red grow
  for (int i = 0; i < 255; i += 10) {
    led.setPixelColor(0, i, 0, 255);
    led.show();
    delay(rainbowDelay);
  }
  // Red is now on, make Blue shrink
  for (int i = 0; i < 255; i += 10) {
    led.setPixelColor(0, 255, 0, 255 - i);
    led.show();
    delay(rainbowDelay);
  }
}
