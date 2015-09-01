sconst int ledPin = 13;
const int inputPin = 12;
long inputDelay = 0;
long startTime = 0;
String reply;

void setup() {
  Serial.begin(9600);
  Serial.setTimeout(100); 
  pinMode(ledPin, OUTPUT);
  pinMode(inputPin, OUTPUT);
}

void loop() {
  // Turn off LED
  if(inputDelay > 0 && millis() - startTime >= inputDelay) {
    digitalWrite(ledPin, LOW);
    inputDelay = 0;
  }

  // Check input
  if(Serial.available() > 0) {
    digitalWrite(inputPin, HIGH);
    inputDelay = Serial.parseInt();
    inputDelay = abs(inputDelay) * 1000;

    if(inputDelay > 0 && digitalRead(ledPin) == LOW) {
      reply = "LED on for: ";
      reply += inputDelay / 1000;
      reply += " seconds";
      Serial.println(reply);
      startTime = millis();
      digitalWrite(ledPin, HIGH);
    }
  } else {
    digitalWrite(inputPin, LOW);
  }
}

