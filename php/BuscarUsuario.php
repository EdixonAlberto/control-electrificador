<?php
require_once('ConeccionDB.php');

$NombreInput = $_POST['User'];
$ClaveInput = $_POST['Key'];

$sql = "SELECT Nombre FROM usuarios WHERE Nombre = '$NombreInput' AND clave = '$ClaveInput'";
$consulta = $mysqli->query($sql);
$Busqueda = $consulta->num_rows;

if ($Busqueda > 0) {
    echo "
        <script>
            alert('¡Acceso Permitido!');
            window.location = 'index.php';
        </script>
    ";
}
else {
    echo "
        <script>
            alert('--Acceso Denegado--');
            window.location = 'AccesoSistema.php';
        </script>
    ";
}
?>