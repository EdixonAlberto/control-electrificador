// Electrificador de Cercas para Perimetros Residenciales

/*
	Name:       Electrificador_ARDUINO_ESP8266.ino
	Created:	14/7/2018 12:25:17 p.m.
	Author:     Edixon Pi�a, V-20.670.071, +584263070365
*/

#include <eeprom.h>
#include <SoftwareSerial.h>
SoftwareSerial Wifi(4, 5); //RX|TX

#pragma region Definiciones
//define Pines
#define VelocidadComunicacion 74880
#define PinConmutador 11
#define PinSirena 10
#define PinBuzzer 12
#define PinDetectorAT 3
#define PinFuente 2
#define PinBateria A0

//define Constantes
#define ON 1
#define OFF 0

//define Eventos
#define Ninguno 0
#define sistemaON 1
#define FuenteON 2
#define Cerca 3
#define sistemaOFF 4
#define BateriaON 5
#define BateriaOFF 6

#define FuenteOFF 7
#pragma endregion //Definiciones

#pragma region Variables
int ConexionID;
int i;
String IP;
String ComandoAT;
String datoRecibido;
String buffer;

//Variables Super Globales
bool _EstadoSirena;
bool _EstadoConmutador;
bool _EstadoFuente;
int _direccionMemoria;
int _Evento;
bool _debug;
#pragma endregion //Variables

#pragma region Programa
void setup()
{
	//Comunicacion
	Serial.begin(9600);
	Wifi.begin(VelocidadComunicacion);

	//Modo de los Pines de Salida
	pinMode(PinSirena, OUTPUT);
	pinMode(PinConmutador, OUTPUT);
	pinMode(PinBuzzer, OUTPUT);

	//Modo de los Pines de Entrada
	pinMode(PinFuente, INPUT);
	pinMode(PinBateria, INPUT);

	//Estado Inicial de los Pines
	digitalWrite(PinSirena, LOW);
	digitalWrite(PinConmutador, LOW);
	digitalWrite(PinBuzzer, LOW);

	//Interrucciones
	//attachInterrupt(0, ControlAlimentacion, CHANGE); //Pin2=0, Cambio de estado
	attachInterrupt(1, ActivacionCerca, RISING); //Pin3=1, De bajo a Alto
	IniciarVariables();

	SetupWifi();
	BuzzerOrden();
	Mensaje("Listo para Recibir Ordenes");
}

void loop()
{
	RecibirOrdenes();
	ConmutadorDePotencia();
	ProcesarEvento();
}
#pragma endregion //Programa

#pragma region Interrucciones
void ControlAlimentacion()
{
	delay(3000);
	noInterrupts();
	_EstadoFuente = digitalRead(PinFuente);
	if (_EstadoFuente)
	{
		_Evento = FuenteON;
	}
	else
	{
		_Evento = FuenteOFF;
	}
}

void ActivacionCerca()
{
	noInterrupts();
	_Evento = Cerca;
}
#pragma endregion //Interrucciones