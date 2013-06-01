/// <reference path="Content/js/vendor/jquery-1.9.1.min.js" />
/// <reference path="Content/js/signalr/jquery.signalR-1.0.1.js" />
/// <reference path="Content/js/vendor/moment.js" />
/// <reference path="Content/js/vendor/linq.js" />

(function($, connection, ui, utility, controll) {
    "use strict";
    var client = connection.clientHub,
                 $ui = $(ui); // convert to jQuery object for .bind

    $ui.bind(ui.events.addZombie, function(ev, name) {
        console.log("[Inside controll.js] Adding zombie...");
        try {
            client.server.addZombie(name)
            .done(function (zombieVm) {
                ui.addZombieTab(zombieVm);
            })
            .fail(function (e) {
                console.log('Failed to add zombie: ' + e);
                ui.failZombieAdd(name);
            });
        }
        catch (e) {
            console.log('Failed to add zombie: ' + e);
            ui.failMessage(id);
        }
    });

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
            var host = "";
            connection.hub.url = host + "/signalr"; 

            ui.initialize();
            
            connection.hub.start({ transport: 'longPolling' })
                .done(function () {
                    client.server.signIn()
                    .fail(function (e) {
                        // Alert
                        console.log("Failed to sign in!");
                        console.error(e);
                    })
                     .done(function () {
                         console.log("Log on: OK");
                         console.log("Connection-Id: " + connection.hub.id);
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

        connection.hub.disconnected(function() {
            console.log('State: Disconnected!');
        });
        connection.hub.reconnecting(function () {
            console.log('State: Reconnecting!');
        });
        connection.hub.reconnected(function () {
            console.log('State: Reconnected!');
        });
        connection.hub.starting(function () {
            console.log('State: Starting!');
        });
        connection.hub.error(function (error) {
            console.log('SignalR error: ' + error);
        });
        connection.hub.stateChanged(function (a) {
            console.log('Old State: ' + a.oldState + ', New State: ' + a.newState);
        });
        connection.hub.logging = true;


        initConnection();
    });


})(jQuery, $.connection, window.controll.ui, window.controll.utility, window.controll);