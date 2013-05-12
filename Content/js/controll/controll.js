/// <reference path="Content/js/vendor/jquery-1.9.1.min.js" />
/// <reference path="Content/js/signalr/jquery.signalR-1.0.1.js" />
/// <reference path="Content/js/vendor/moment.js" />
/// <reference path="Content/js/vendor/linq.js" />

(function($, connection, ui, utility, controll) {
    "use strict";
    var client = connection.clientHub,
                 $ui = $(ui); // convert to jQuery object for .bind
    
    $ui.bind(ui.events.activateZombie, function (ev, invocation) {
        console.log("Sending invocation...");
        try {
            var zombie = invocation.zombie;
            var activity = invocation.activity;
            var parameters = invocation.parameters;
            var parameterDictionary = utility.convertParameterViewModelToDictionary(parameters);
            var command = invocation.command;
            var id = utility.newId();

            var logItemVm = new controll.LogItem(id, zombie, activity, command, parameters, moment().calendar());
            ui.addInvocation(logItemVm);

            console.log(parameterDictionary);
            client.server.startActivity(zombie.name, activity.id, parameterDictionary, command.name)
            .done(function (ticket) {
                ui.confirmDelivery(id, ticket);
            })
            .fail(function (e) {
                console.log('Failed to send: ' + e);
                ui.failDelivery(id);
                ui.addMessage(e, 'error');
            });
        }
        catch (e) {
            console.log('Failed to send: ' + e);
            ui.failMessage(id);
        }
    });

    client.client.activityMessage = function(ticket, type, message) {
        ui.addActivityMessage(ticket, type, message);
    };

    client.client.activityResult = function (ticket, resultVm) {
        ui.addActivityResult(ticket, resultVm);
    };

    $(function () {

        function initConnection() {
            connection.hub.url = "http://localhost:10244/signalr"; //Stand Alone Hosting

            ui.initialize();

            // This is temporary until the hub auth gets refacatored for claims
            // (and also until this app gets auth :P)
            client.state.userName = "username";
            var password = "password";
            //end of temporary stuff

            connection.hub.start()
                .done(function () {
                    client.server.logOn(password)
                    .fail(function (e) {
                        // Alert
                        console.log("Failed to log on!");
                        console.error(e);
                    })
                     .done(function () {
                         console.log("Log on: OK");
                         // Get the zombies
                         client.server.getAllZombies()
                             .done(function (z) {
                                 ui.setZombies(z);
                             })
                             .fail(function(e) {
                                 console.log("Error getting zombies!");
                                 console.error(e);
                             });
                     });
                })
                .fail(function () {
                    alert("Could not connect to hub!");
                });
        }

        initConnection();
    });


})(jQuery, $.connection, window.controll.ui, window.controll.utility, window.controll);