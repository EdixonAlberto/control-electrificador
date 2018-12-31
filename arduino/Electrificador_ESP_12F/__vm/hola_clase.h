#pragma once
class hola_clase {
public:
	hola_clase();
	~hola_clase();
	void hola();
};

void hola_clase::hola() {
	Serial.print("hola mundo");
}

hola_clase::hola_clase() {
	
}


hola_clase::~hola_clase() {
}
