double voltimetro(int PinAMedir) {
	int Sensor = analogRead(PinAMedir);
	double Voltaje = (Sensor * Aref()) / 1023;
	return Voltaje;
}

float Aref() { //Referencia de voltaje adaptada a la alimentacion del Arduino
	ADMUX = _BV(REFS0) | _BV(MUX3) | _BV(MUX2) | _BV(MUX1);
	delay(2);
	ADCSRA |= _BV(ADSC);
	while (bit_is_set(ADCSRA, ADSC)); //Bandera del ADC
	int result = ADCL;
	result |= ADCH << 8;
	float salida = 1126.400 / result; // Back-calculate AVcc in mV
	return salida;
}