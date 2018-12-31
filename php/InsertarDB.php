<?php
require_once('ConeccionDB.php');

$Evento[1] = "Electrificador Encendido";
$Evento[2] = "Trabajando con Fuente";
$Evento[3] = "Activación de la Cerca";
$Evento[4] = "Electrificador Apagado";
$Evento[5] = "Trabando con Batería";
$Evento[6] = "Batería Descargada";

$Mensaje = $_GET['Mensaje'];
$Fecha_Hora = date("Y-m-d H:i:s");

$q = "INSERT INTO actividad(id_Evento, Mensaje, Fecha_Hora) VALUES('','$Evento[$Mensaje]','$Fecha_Hora')";
$mysqli->query($q);
?>