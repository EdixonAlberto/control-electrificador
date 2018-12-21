<?php
    require_once('ConeccionDB.php');
    
    $sql = "SELECT * FROM actividad";
    $query = $mysqli->query($sql);

    echo "<table>
            <tr id='Titulo'>
                <td>Evento</td>
                <td>Fecha</td> 
                <td>Hora</td>
            </tr>
    ";

    while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
        SepararFechaHora($row,$Fecha,$Hora);
        echo "
            <tr>
                <td>" .$row['Mensaje']. "</td>
                <td>" .$Fecha. "</td>
                <td>" .$Hora. "</td>
            </tr>
        ";
    }
    echo "</table>";

    $mysqli->close();

    function SepararFechaHora($row,&$Fecha,&$Hora_date){
        $FH =  $row['Fecha_Hora'];

        $Fecha = substr($FH,0,stripos($FH," "));
        $Fecha = date_create($Fecha);
        $Fecha = $Fecha->format('d-m-Y');

        $Hora = substr($FH,stripos($FH," "));
        $Hora = date_create($Hora);
        $Hora_date = $Hora->format('h:i A');
    }
?>