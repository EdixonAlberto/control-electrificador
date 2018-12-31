//Comandos AT para el modulo ESP-01, con vercion de SDK: 0018000902

void AT(String comando) { Wifi.println("AT+" + comando); }
void AT_SRN(String comando) { Wifi.print("AT+" + comando); }

void SetupWifi() {
	AT("RST");
	delay(3000);
	vaciar();

	AT("CIPMUX=1");
	Esperar("OK");

	AT("CIPSERVER=1,80");
	Esperar("OK");

	AT("CIFSR");
	Esperar("OK");
}

bool ConexionWifi() {
	String nombre = "";
	String clave = "";

	nombre = buffer.substring(1, buffer.indexOf("&"));
	buffer = buffer.substring(buffer.indexOf("&"));
	clave = buffer.substring(buffer.indexOf("=") + 1, buffer.indexOf(" "));
	Responder(PaginaConfirmacionConexion());

	String SSID = "\"" + nombre + "\"";
	String CLAVE = "\"" + clave + "\"";

	ComandoAT = "CWJAP=" + SSID + "," + CLAVE;
	AT(ComandoAT);
	debug(ComandoAT);
	Esperar("OK");

	return true;
	Mensaje("Conexion Establecida");
}

void ModoServidor() {
	AT("RST");
	delay(3000);
	vaciar();

	AT("CIPMUX=1");
	Esperar("OK");

	AT("CIPSERVER=1,80");
	Esperar("OK");
}

void ModoClient() {
	AT("CIPMUX=0");
	Esperar("OK");
}

void Enviar(String Dato) {
	String GET = "GET /ControlElectrificador/InsertarDB.php?Mensaje=" + Dato + " HTTP/1.1";
	String HOST = "Host: 192.168.43.100";
	ComandoAT = GET + "\r\n" + HOST + "\r\n";

	String Longitud = (String)((GET + HOST).length() + 6);

	AT("CIPSTART=\"TCP\",\"192.168.43.100\",80");
	Esperar("Linked");

	AT("CIPSEND=" + Longitud);
	Esperar(">");

	Wifi.println(ComandoAT); //en modo cliente con rn al final
	Esperar("SEND OK");

	AT("CIPCLOSE");
	Esperar("Unlink");
}

void Responder(String pagina) {
	String Respuesta = pagina;

	String ID = (String)ConexionID;
	String Longitud = (String)Respuesta.length();
	ComandoAT = "CIPSEND=" + ID + "," + Longitud;
	AT(ComandoAT);
	Esperar(">");
	Wifi.print(Respuesta); //Se envia la respuesta sin \r\n porque el buffer se establece con una longitud fija.
	Esperar("SEND OK");
	AT("CIPCLOSE=" + ID);
	Esperar("OK");
	Mensaje("Respuesta Enviada");
}

void Esperar(String Promesa) {
	buffer = "";
	while (buffer.indexOf(Promesa) < 0) {
		if (Wifi.available() > 0) {
			buffer = Wifi.readString();
		}
	}
	if (_debug) { Serial.println(buffer); }
	vaciar();
}

void vaciar() {
	while (Wifi.available() > 0) { 
		if (_debug) {
			buffer = Wifi.readString();
			Serial.println(buffer);
		}
		else {
			Wifi.read();
		}
	}
}