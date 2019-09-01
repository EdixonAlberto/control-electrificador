const SERVER_URL = 'http://localhost/control-electrificador/php';
var start = false;

function access() {
    var key = $('#key').val();

    $.ajax({
        type: 'POST',
        url: `${SERVER_URL}/GestionClave.php`,
        data: {
            key: key
        },
        dataType: 'json',
        success: function (resp) {
            if (resp.error == null) {
                if (resp.keyCorrect) {
                    location.href = 'Electrificador.html';
                    alert('Acceso Permitido');
                    alert('Bienvenid@ a continuación se presentan las opciones para controlar el electrificador.');
                } else {
                    location.href = 'index.html';
                    alert('Clave Incorrecta');
                }
            } else alert(resp.error);
        }
    });
}

function eventElectrificador() {
    if (start) {
        $.ajax({
            type: 'POST',
            url: `${SERVER_URL}/event.php`,
            data: {
                start: start
            },
            dataType: 'json',
            success: function (resp) {
                if (resp.error == null) {
                    $("#register").html(resp.register);
                    notification("Evento Producido");
                } else {
                    alert(resp.error);
                    start = false;
                    $('#stop').css('background', 'green');
                    $('#stop').prop('value', 'Iniciar Registro');
                }
            }
        });

        setTimeout('eventElectrificador()', 1000);
    } else clearTimeout();
}

function stop() {
    start = !start;
    $('#stop').click(function () {
        if (start) {
            $('#stop').css('background', 'green');
            $('#stop').prop('value', 'Iniciar Registro');
        } else {
            $('#stop').css('background', '#ff0000bd');
            $('#stop').prop('value', 'Detener Registro');
        }
    })
    eventElectrificador();
}

function sendArduino() {
    var stateOn = EstadoBoton.click ? 1 : 0;
    var EstadoBoton = document.getElementById('Boton');
    const ADDRESS_IP = "http://192.168.43.210:80/"; // Direccion IP del modulo ESP8266

    $.ajax({
        type: "GET",
        url: ADDRESS_IP,
        data: {
            Estado: stateOn
        },
        dataType: "text",
        success: function (resp) {
            if (resp == 'OK') {
                if (stateOn) notification("¡Electrificador Encendido!");
                else notification("¡Electrificador Apagado!");
            }
        }
    });
}

function loginKey() {
    $('#oldKey').focus(function () {
        $('#oldKey').css('border-color', '#A5C7FE');
    });

    $('#oldKey').on('keyup', function () {
        var oldKey = $('#oldKey').val();
        var newKey = $('#newKey').val();

        if (oldKey == '' && newKey == '') {
            $('#newKey').css('border-color', '#A5C7FE');
            $('#newKey').prop('disabled', true);
        } else {
            $('#newKey').prop('disabled', false);
        }
    });

    $('#newKey').on('keyup', function () {
        var oldKey = $('#oldKey').val();
        var newKey = $('#newKey').val();

        if (oldKey == '')
            $('#newKey').prop('disabled', true);

        $('#newKey').css('border-color', '#A5C7FE');
        $('#confirmKey').css('border-color', '#A5C7FE');
        $('#confirmKey').prop('disabled', newKey == '');
        $('#confirmKey').prop('value', '');
    });

    $('#confirmKey').on('keyup', function () {
        var confirmKey = $('#confirmKey').val();
        var newKey = $('#newKey').val();

        if (confirmKey == '')
            $('#confirmKey').css('border-color', '#A5C7FE');
        else if (confirmKey != newKey)
            $('#confirmKey').css('border', '3px solid red');
        else $('#confirmKey').css('border-color', '#A5C7FE');
    });
}

function keySave() {
    var oldKey = $('#oldKey').val();
    var newKey = $('#newKey').val();
    var fieldsCorrects = validateFields(oldKey, newKey);

    if (fieldsCorrects) $.ajax({
        type: 'POST',
        url: `${SERVER_URL}/GestionClave.php`,
        data: {
            key: oldKey,
            newKey: newKey
        },
        dataType: 'json',
        success: function (resp) {
            if (resp.error == null) {
                if (resp.keyCorrect) {
                    alert('Nueva Clave Guardada');
                    location.href = 'Electrificador.html';
                } else {
                    $('#oldKey').css('border', '3px solid red');
                    alert('Contraseña Incorrecta');
                }
            } else alert(resp.error);
        }
    });
}

function validateFields(oldKey, newKey) {
    var confirmKey = $('#confirmKey').val();

    if (oldKey == '') {
        $('#oldKey').css('border', '3px solid red');
    } else if (newKey == '') {
        $('#newKey').css('border', '3px solid red');
    } else if (confirmKey == '' || confirmKey != newKey) {
        $('#confirmKey').css('border', '3px solid red');
    } else return true;

    return false;
}

// function SetupWifi() {
//     $(document).ready(function () {
//         var nombre = $('#NombreSSID').val();
//         var clave = $('#ClaveWifi').val();
//         $.ajax({
//             async: false,
//             type: "GET",
//             url: "http://192.168.43.210:80/",
//             data: { Estado: "2", nom: nombre, key: clave },
//             dataType: 'text',
//             success: function (data) {
//                 var respuesta = data;
//                 if (respuesta == "ok") {
//                     alert(respuesta);
//                 }
//                 else {
//                     alert('No se pudo conectar ');
//                 }
//             },
//             beforeSend: function () {
//                 alert('Espere mientras se conecta a la red wifi...');
//             }
//         });
//     })
// }

function notification(text) {
    // @ts-ignore
    Push.create(text, {
        body: 'Una nueva actividad detectada',
        icon: './img/Alerta.png',
        onClick: function () {
            window.focus();
            this.close();
        }
    });
}
