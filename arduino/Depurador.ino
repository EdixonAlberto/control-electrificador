void debug(int mostrar) { Serial.println(mostrar); }
void debug(double mostrar) { Serial.println(mostrar); }
void debug(String mostrar) { Serial.println(mostrar); }

void Mensaje(String msj){ 
	Serial.print("\r\n" + msj +"\r\n");
}

void DebugWifi() {
	//PUENTE ARDUINO -> ESP-01______________
	if (Serial.available()) {
		while (Serial.available()) {
			Wifi.print((char)Serial.read());
		}
	}
	if (Wifi.available()) {
		while (Wifi.available()) {
			Serial.print((char)Wifi.read());
		}
	}
	return;
	//_______________________________________
}