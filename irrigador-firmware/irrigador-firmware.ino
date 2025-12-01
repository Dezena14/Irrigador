#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// --- Configurações ---

//  WI-FI
const char* ssid = "NOME DA REDE";
const char* password = "SENHA";
const char* mqtt_user = "USUARIO";
const char* mqtt_pass = "SENHA";

// MQTT
const char* mqtt_server = "192.168.3.21"; 
const int mqtt_port = 1883;

// Módulo
const int MODULE_ID = 1; 
const int SENSOR_PIN = A0;
const int TRANSISTOR_PIN = D1;

// Tópicos MQTT
const char* HUMIDITY_TOPIC = "sensor.data";
const char* COMMAND_TOPIC = "module.command";

// Tempos
const long SENSOR_READ_INTERVAL = 60000;
const int RELE_DURATION = 3000;

// --- Execução ---

unsigned long previousMillis = 0;
WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(9600);
  
  pinMode(TRANSISTOR_PIN, OUTPUT);
  digitalWrite(TRANSISTOR_PIN, LOW); 

  setup_wifi();
  
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi conectado!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Mensagem recebida no tópico: ");
  Serial.println(topic);

  JsonDocument doc;
  deserializeJson(doc, payload, length);

  int id = doc["moduleId"];
  const char* action = doc["action"];

  if (id != MODULE_ID) {
    return;
  }

  if (strcmp(action, "on") == 0) {
    Serial.println("Comando 'on' recebido. Acionando relé.");
    
    digitalWrite(TRANSISTOR_PIN, HIGH);
    delay(RELE_DURATION);
    digitalWrite(TRANSISTOR_PIN, LOW);
  }
}

void reconnect_mqtt() {
  while (!client.connected()) {
    Serial.print("Tentando conectar ao MQTT...");
    
    String clientId = "NodeMCUClient-" + String(MODULE_ID);
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_pass)) {
      Serial.println("Conectado!");
      
      client.subscribe(COMMAND_TOPIC);
      Serial.print("Inscrito no tópico: ");
      Serial.println(COMMAND_TOPIC);
      
    } else {
      Serial.print("falhou, rc=");
      Serial.print(client.state());
      Serial.println(" tentando novamente em 5 segundos");
      delay(5000);
    }
  }
}

void readAndPublishSensorData() {

  int sensorValue = analogRead(SENSOR_PIN);
  int humidityPercent = map(sensorValue, 1023, 0, 0, 100);

  Serial.print("Leitura: ");
  Serial.print(sensorValue);
  Serial.print(" -> Umidade: ");
  Serial.print(humidityPercent);
  Serial.println("%");

  JsonDocument doc;
  doc["moduleId"] = MODULE_ID;
  doc["humidity"] = humidityPercent;

  char jsonBuffer[128];
  serializeJson(doc, jsonBuffer);

  client.publish(HUMIDITY_TOPIC, jsonBuffer);
  
  Serial.print("Publicado em '");
  Serial.print(HUMIDITY_TOPIC);
  Serial.print("': ");
  Serial.println(jsonBuffer);
}

void loop() {
  if (!client.connected()) {
    reconnect_mqtt();
  }
  client.loop(); 

  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= SENSOR_READ_INTERVAL) {
    previousMillis = currentMillis;
    readAndPublishSensorData();
  }
}