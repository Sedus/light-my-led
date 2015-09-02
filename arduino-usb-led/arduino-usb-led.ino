const byte outputLedPin = 13; // Target LED to light up
const byte inputLedPin = 12; // Lights when data is received
const int updateDelay = 500; // Sends signals every x milliseconds
unsigned long currentMillis = 0; // Current millis count
unsigned long lastUpdateMillis = 0; // Last time a message was sent (used for message loop)
unsigned long startTime = 0; // Amount of milliseconds since the LED started shining
unsigned int seconds = 0; // Amount of seconds the LED should shine

void setup() {
  Serial.begin(115200);
  pinMode(outputLedPin, OUTPUT);
  pinMode(inputLedPin, OUTPUT);
}

void loop() {
  currentMillis = millis();

  // Turn on/off LED
  if(seconds > 0) {
    startTime = turnLedOnOff(outputLedPin, seconds);
  }
  
  // Check input, but only if the amount of seconds have passed
  if (seconds == 0) {
    seconds = getSecondsFromInput(outputLedPin, inputLedPin);
  }

  // Send output message over serial
  if (currentMillis - lastUpdateMillis >= updateDelay) {
    sendOutput(digitalRead(outputLedPin) == HIGH, currentMillis - startTime);
    lastUpdateMillis = millis();
  }
}

unsigned long turnLedOnOff(byte outputLedPin, unsigned int seconds) {
  if (seconds > 0 && digitalRead(outputLedPin) == LOW) {
    digitalWrite(outputLedPin, HIGH);
    return millis();
  } else {
    digitalWrite(outputLedPin, LOW);
    return 0;
  }
}

long getSecondsFromInput(byte outputLedPin, byte inputLedPin) {
  if (Serial.available() > 0) {
    digitalWrite(inputLedPin, HIGH);
    return abs(Serial.parseInt()) * 1000;
  } else {
    digitalWrite(inputLedPin, LOW);
  }
  return 0;
}

void sendOutput(boolean on, unsigned long millis) {
  String duration = "";
  if(millis > 0) {
    duration = ",\"duration\":" + millis;
  }
  Serial.println("{\"led\":{\"status:\"" + (String)(on ? "ON" : "OFF") + duration + "}}");
}

