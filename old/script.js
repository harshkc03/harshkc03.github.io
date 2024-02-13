document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('mqttForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var imei = document.getElementById('imei').value;
        var amount = document.getElementById('amount').value;
        var language = document.getElementById('language').value;

        sendMessage(imei, amount, language);
    });

    function sendMessage(imei, amount, language) {
        var topic = '/kiotel/sb/' + imei;
        var message = amount + '#' + language + '#';

        var client = new Paho.MQTT.Client('wss://broker.emqx.io:8084/mqtt', 'clientId');

        client.onConnectionLost = function (responseObject) {
            console.log('Connection lost: ' + responseObject.errorMessage);
        };

        client.connect({
            onSuccess: function () {
                console.log('Connected to the broker');
                var messagePayload = new Paho.MQTT.Message(message);
                messagePayload.destinationName = topic;
                client.send(messagePayload);
                console.log('Message sent');
                // client.disconnect();
            },
            onFailure: function (message) {
                console.log('Connection failed: ' + message.errorMessage);
            }
        });
    }
});