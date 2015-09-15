const byte outputLedPin = 13; // Target LED to light up
const byte inputLedPin = 12; // Lights when data is received
const int updateDelay = 1000; // Sends signals every x milliseconds
unsigned long currentMillis = 0; // Current millis count
unsigned long lastUpdateMillis = 0; // Last time a message was sent (used for message loop)
unsigned long startTime = 0; // Amount of milliseconds since the LED started shining
unsigned long seconds = 0; // Amount of seconds the LED should shine

void setup() {
  delay(1000);
  Serial.begin(115200);
  Serial.setTimeout(500);
  pinMode(outputLedPin, OUTPUT);
  pinMode(inputLedPin, OUTPUT);
  currentMillis = millis();
  startTime = currentMillis;
}

void loop() {
  currentMillis = millis();

  // Check input
  getSecondsFromInput(digitalRead(outputLedPin) == HIGH, inputLedPin, seconds);

  // Turn on/off LED
  turnLedOnOff(outputLedPin, seconds, startTime, currentMillis);

  // Send output message over serial
  if (currentMillis - lastUpdateMillis >= updateDelay) {
    sendOutput(digitalRead(outputLedPin) == HIGH, currentMillis - startTime, seconds);
    lastUpdateMillis = currentMillis;
  }
}

void turnLedOnOff(byte outputLedPin, unsigned long &seconds, unsigned long &startTime, unsigned long currentMillis) {
  if (seconds > 0 && currentMillis - startTime < seconds) {
    if (digitalRead(outputLedPin) == LOW) {
      startTime = millis();
    }
    digitalWrite(outputLedPin, HIGH);
  } else {
    digitalWrite(outputLedPin, LOW);
    seconds = 0;
    startTime = currentMillis;
  }
}

void getSecondsFromInput(boolean isOn, byte inputLedPin, unsigned long &seconds) {
  while (Serial.available() > 0) {
      digitalWrite(inputLedPin, HIGH);
    String incoming = Serial.readStringUntil('\n');
      long tmp = incoming.toInt();
      seconds = tmp * 1000;
      Serial.println(tmp);
  }
  digitalWrite(inputLedPin, LOW);
}

void sendOutput(boolean on, unsigned long ms, unsigned long seconds) {
  String json = "{\"led\":{";
  json += "\"status\":\"" + (String)(on ? "ON" : "OFF") + "\"";
  if (on) {
    json += ",\"duration\":" + (String)ms;
    json += ",\"seconds\":" + (String)(seconds / 1000);
  }
  json += "}}";
  Serial.println(json);
}

boolean isValidNumber(String str) {
  for (byte i = 0; i < str.length(); i++)
  {
    if (isDigit(str.charAt(i))) return true;
  }
  return false;
}
