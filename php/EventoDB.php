<?php
set_time_limit(0);
require_once('ConeccionDB.php');

$FechaHora_Actual = $_POST['Fecha'];
if ($FechaHora_Actual == 1) {
	$FechaHora_Actual = date("Y-m-d H:i:s");
}

$sql = "SELECT Fecha_Hora FROM actividad ORDER BY Fecha_Hora DESC LIMIT 1";
$consulta = $mysqli->query($sql);
$row =  $consulta->fetch_array(MYSQLI_ASSOC);
$FechaHora_DB = $row['Fecha_Hora'];

while ($FechaHora_DB <= $FechaHora_Actual){
	$sqlEvento				= "SELECT Fecha_Hora FROM actividad ORDER BY Fecha_Hora DESC LIMIT 1";
	$consultaEvento			= $mysqli->query($sqlEvento);
	$rowEvento				= $consultaEvento->fetch_array(MYSQLI_ASSOC);
	sleep(1);
	clearstatcache();
	$FechaHora_DB = $rowEvento['Fecha_Hora'];
}

header("Location: ConsultaDB.php");
?>