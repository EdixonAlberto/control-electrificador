//En esta seccion se va a ejecutar la accion correspondiente al evento sucedido

void ProcesarEvento() {
	if (_Evento != Ninguno) {
		switch (_Evento) {
		case FuenteON:
			LeerMemoria();
			_Evento = FuenteON;
			ActualizarDB();

			//if (RevisarBateria()) {
			//	_Evento = BateriaOFF;
			//}
			//else {
			//	_Evento = BateriaON;
			//}

			break;

		case FuenteOFF:
			_EstadoFuente = OFF;
			GuardarMemoria();
			break;

		case Cerca:
			_EstadoSirena = ON;
			detachInterrupt(1);
			ActualizarDB();
			break;
		}
		_Evento = Ninguno;
		interrupts();
		Mensaje("Evento Procesado");
	}
}

bool RevisarBateria() {
	double VoltajeMalo = 2.5;
	return voltimetro(PinBateria) <= VoltajeMalo;
}