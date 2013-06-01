(function ($, window) {
    "use strict";

    var $ui = null;
    var vm = null;
    
    $('body').on('click', 'ol.picker-values li', function () {
        $(this).addClass("selectedPickerValue").siblings().removeClass("selectedPickerValue");
    });


    var showAddZombie = function(caller) {
        var a = $(caller);
        var form = a.next();

        a.hide();
        form.show();
        console.log(caller);
        console.log(form);
        $('#addZombieName').focus();
    };
    
    var addZombie = function (caller) {
        var form = $(caller);
        var a = form.prev();

        a.show();
        form.hide();

        var zombieName = $('> input', form).val();
        console.log("triggering event addZombie with name: " + zombieName);
        $ui.trigger(ui.events.addZombie, zombieName);
    };
    
    var toggleCommands = function (caller) {
        var parent = $(caller).parent();
        parent.next().slideToggle();

        if (parent.hasClass("open")) {
            parent.removeClass("open");
        } else {
            parent.addClass("open");
        }
    };

    var toggleInvocation = function (zombie, activity, command) {
        var zombieContainer = $('#zombie-' + zombie.name); // DOM object

        if (zombieContainer.hasClass('invokehidden')) {
            zombieContainer.toggleClass('invokehidden invokevisible'); // toggle invocation container
        }

        command.belongsToActivity = activity;
        zombie.selectedCommand(command);
    };

    var closeInvocation = function (caller) {
        var containerDiv = $(caller).closest('.container');

        if (containerDiv.hasClass('invokevisible'))
            containerDiv.toggleClass('invokehidden invokevisible'); // toggle invocation container
    };

    var sendActivityInvocation = function (form, zombie, commandObservable) {
        var command = commandObservable();
        var activity = command.belongsToActivity;
        var parameters = [];

        for (var i = 0; i < command.parameters.length; i++) {
            var descriptor = command.parameters[i];
            
            var inputElement = $(form).find('#' + descriptor.name);
            var inputElementValue = inputElement.val();

            if (descriptor.isBoolean) { // checkbox
                parameters.push({ name: descriptor.name, value: inputElementValue == "on", label: descriptor.label });
            } else if (descriptor.pickerValues == null || descriptor.pickerValues.length == 0) { // text
                parameters.push({ name: descriptor.name, value: inputElementValue, label: descriptor.label });
            } else { // dropdown
                var value = inputElement.find('li.selectedPickerValue').eq(0).attr('data-identifier');
                
                console.log('identifier: ' + value);
                parameters.push({ name: descriptor.name, value: value, label: descriptor.label });
            }
        }
        
        var invocation = {
            command: command,
            activity: activity,
            zombie: zombie,
            parameters: parameters
        };

        $ui.trigger(ui.events.activateZombie, invocation);
        closeInvocation(form);
    };

    var ui = {
        //lets store any events to be triggered as constants here to aid intellisense and avoid
        //string duplication everywhere
        events: {
            activateZombie: 'controll.ui.activateZombie',
            addZombie: 'controll.ui.addZombie',
        },

        toggleCommands: toggleCommands,
        toggleInvocation: toggleInvocation,
        sendActivityInvocation: sendActivityInvocation,
        closeInvocation: closeInvocation,
        addZombie: addZombie,
        showAddZombie: showAddZombie,
        
        addZombieTab: function (vm) {
            console.log("Add zombie tab " + name + "...");
            controll.viewModel.zombies.push(controll.createZombie(vm));
        },
        
        initialize: function () {
            console.log("Initializing UI...");
            $ui = $(this);
            vm = window.controll.viewModel;
        },

        setZombies: function (zombies) {
            var newZombies = new Array(zombies.length);
            for (var i = 0; i < zombies.length; i++) {
                newZombies[i] = new controll.Zombie(
                zombies[i].Name,
                zombies[i].IsOnline,
                zombies[i].Activities,
                null);
            }

            controll.viewModel.zombies(newZombies);
        },
        
        addInvocation: function (invocationVm) {
            if (window.controll.viewModel.zombies.indexOf(invocationVm.zombie) < 0) {
                console.error('Invoked zombie not found in the Knockout View Model!');
                return;
            }
            
            invocationVm.zombie.logItems.push(invocationVm);
            invocationVm.zombie.selectedCommand(null);
        },
        
        confirmDelivery: function (uiid, ticket) {
            var matchedZombie = ko.utils.arrayFirst(window.controll.viewModel.zombies(), function (zombie) {
                var logItem = ko.utils.arrayFirst(zombie.logItems(), function(k) {
                    return k.uiid == uiid;
                });
                if (logItem) {
                    logItem.ticket = ticket;
                    return true;
                }
                return false;
            });
            
            if (!matchedZombie) {
                console.error('Could not find log item with uiid ' + uiid);
            }
        },

        addActivityMessage: function (ticket, type, message) {
            var matchedZombie = ko.utils.arrayFirst(window.controll.viewModel.zombies(), function (zombie) {
                var logItem = ko.utils.arrayFirst(zombie.logItems(), function (k) {
                    return k.ticket == ticket;
                });
                if (logItem) {
                    logItem.messages.push(new controll.LogItemMessage(type, message));
                    return true;
                }
                return false;
            });

            if (!matchedZombie) {
                console.error('Could not find log item with ticket ' + ticket);
            }
        },

        addActivityResult: function (ticket, result) {
            var matchedZombie = ko.utils.arrayFirst(window.controll.viewModel.zombies(), function (zombie) {
                var logItem = ko.utils.arrayFirst(zombie.logItems(), function (k) {
                    return k.ticket == ticket;
                });
                if (logItem) {
                    logItem.result = window.controll.createCommand(result);
                    logItem.belongsToActivity = logItem.activity;
                    toggleInvocation(logItem.zombie, logItem.activity, logItem.result);
                    return true;
                }
                return false;
            });

            if (!matchedZombie) {
                console.error('Could not find log item with ticket ' + ticket);
            }
        },
    };

    if (window.controll == null) {
        window.controll = {};
    }
    window.controll.ui = ui;
})(jQuery, window);