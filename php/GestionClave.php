<?php
require_once('ConeccionDB.php');

$Metodo = $_POST['Metodo'];
$Clave = $_POST['Clave'];

switch ($Metodo) {
    case 'Verificar':
        $sql = "SELECT * FROM clave";
        $query = $mysqli->query($sql);
        $claveDB = $query->fetch_array(MYSQLI_ASSOC);

        if ( $Clave == $claveDB['Clave_Usuario'] ) {
                echo "true";
            }
            else {
                echo "false";
        }
        break;
    case 'Guardar':
        if ($Clave == "") {
            echo "Debe completar correctamente el formulario para guardar la clave";
        }
        else {
            $sql = "UPDATE clave SET Clave_Usuario = '$Clave' WHERE id_Clave = 1";
            $query = $mysqli->query($sql);
            echo "Nueva Clave Guardada";
        }
        break;
}
$mysqli->close();
exit;
?>