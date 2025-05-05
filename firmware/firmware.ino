void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command == "LIGAR") {
      digitalWrite(LED_BUILTIN, HIGH);
      Serial.println("LED LIGADO");
    } else if (command == "DESLIGAR") {
      digitalWrite(LED_BUILTIN, LOW);
      Serial.println("LED DESLIGADO");
    }
  }
}