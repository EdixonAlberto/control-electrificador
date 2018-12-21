function Notif(texto) {
    Push.create(texto, {
        body: 'Una nueva actividad detectada',
        icon: 'img/Alerta.png',
        onClick: function () {
            window.focus();
            this.close();
        }
    });
}

function Evento(tabla) {
    $.ajax({
        async: true,
        type: "POST",
        url: "EventoDB.php",
        data: { Fecha: tabla },
        dataType: "html",
        success: function (data) {
            $("#Registro").html(data);
            if (tabla == 1) {
                Notif("Evento Producido");
            }
            setTimeout('Evento(1)', 1000);
        }
    });
}

function EnviarOrden() {
    var EstadoON = 0;
    var EstadoBoton = document.getElementById('Boton');
    EstadoBoton.click ? EstadoON = 1 : EstadoON = 0;
    $.ajax({
        async: true,
        type: "GET",
        url: "http://192.168.43.210:80/", // <-- Direccion IP del modulo ESP8266
        dataType: "text",
        data: { Estado: EstadoON },
        success: function (data) {
            if (data = "OK") {
                EstadoON == 1 ? Notif("¡Electrificador Encendido!") : Notif("¡Electrificador Apagado!")
            }
        }
    });
}

function ValidacionesCampos() {
    $("#_keyActual").focus();
    $("#_keyActual").on('keyup', function () {
        var kActual = $(this).val();
        if (kActual != '') {
            $(this).css('border-color', '#dcdcdc');
            $("#_keyNueva").prop('disabled', false);
        }
        else {
            $("#_keyNueva").prop('disabled', true);
            $("#_keyConfirmar").prop('disabled', true);
            $("#_keyConfirmar").css('border-color', '#dcdcdc');
        }
    })
    //Validar Clave Actual
    $("#_keyActual").blur('keyup', function () {
        var kActual = $(this).val();

        if (ComprobarClave(kActual)) {
            $(this).css('border-color', 'green');
            $(this).prop('disabled', true);
            $("#_keyNueva").prop('disabled', false);
            $("#_keyNueva").focus();
        }
        else {
            $("#_keyNueva").prop('disabled', true);
            $("#_keyActual").css('border-color', 'red');
            $("#_keyActual").focus();
        }
    })
    $("#_keyNueva").on('keyup', function () {
        var kNueva = $(this).val();
        $(this).css('border-color', '#dcdcdc');
        $("#_keyConfirmar").prop('disabled', kNueva == '');
        $("#_keyConfirmar").css('border-color', '#dcdcdc');
        $("#_keyConfirmar").prop('value', '');

    })
    $("#_keyConfirmar").on('keyup', function () {
        $("#_keyNueva").css('border-color', 'green');
        var kNueva = $("#_keyNueva").val();
        var kConfirmar = $(this).val();
        if (kConfirmar != kNueva && kConfirmar != '') {
            $(this).css('border-color', 'red');
        }
        else if (kConfirmar == kNueva) {
            $(this).css('border-color', 'green');
        }
        else {
            $(this).css('border-color', '#dcdcdc');
        }
    })

    function ComprobarClave(clave) {
        var resultado;
        $.ajax({
            async: false,
            type: "POST",
            url: "GestionClave.php",
            data: { Clave: clave, Metodo: "Verificar" },
            dataType: 'text',
            success: function (data) {
                (data == "true") ? resultado = true : resultado = false;
            }
        });
        return resultado;
    }
}

function GuardarClave() {
    var NuevaClave = $('#_keyNueva').val();
    $.ajax({
        async: false,
        type: "POST",
        url: "GestionClave.php",
        data: { Clave: NuevaClave, Metodo: "Guardar" },
        dataType: 'text',
        success: function (msj) {
            location.href = "ClaveAcceso.html";
            alert(msj);
        }
    });
}

function SetupWifi() {
    $(document).ready(function () {
        var nombre = $('#NombreSSID').val();
        var clave = $('#ClaveWifi').val();
        $.ajax({
            async: false,
            type: "GET",
            url: "http://192.168.43.210:80/",
            data: { Estado: "2", nom: nombre, key: clave },
            dataType: 'text',
            success: function (data) {
                var respuesta = data;
                if (respuesta == "ok") {
                    alert(respuesta);
                }
                else {
                    alert('No se pudo conectar ');
                }
            },
            beforeSend: function () {
                alert('Espere mientras se conecta a la red wifi...');
            }
        });
    })
}