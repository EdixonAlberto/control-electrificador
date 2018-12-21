<?php
    $mysqli = new mysqli("localhost", "root", "", "control_electrificador");
    if ($mysqli->connect_errno) {
        $er =  $mysqli->connect_errno;
        echo"
            <script> alert('Conección Fallida' + $er); </script>
        ";
    }
?>