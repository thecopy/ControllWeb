(function (controll) {
    "use strict";

    function convertActivitiesObjectToVm(activities) {
        var newActivities = new Array(activities.length);
        for (var i = 0; i < activities.length; i++) {
            newActivities[i] = new Activity(
                activities[i].Name,
                activities[i].Key,
                Enumerable.From(activities[i].Commands).Select(function (c) { return createCommand(c); }).ToArray(),
                activities[i].Version,
                activities[i].CreatorName,
                activities[i].LastUpdated);
        }

        return newActivities;

    }
    
    var createCommand = function(c) {
        return new Command(
                c.Name,
                c.Label,
                Enumerable.From(c.ParameterDescriptors).Select(function (pd) { return createParameterDescriptor(pd); }).ToArray()
            );
    }
    function createParameterDescriptor(pd) {
        return new ParameterDescriptor(
                pd.Name,
                pd.Label,
                pd.Description,
                pd.IsBoolean,
                Enumerable.From(pd.PickerValues).Select(function (pv) { return createPickerValue(pv); }).ToArray()
        );
    }
    function createPickerValue(pv) {
        return new PickerValue(
                pv.Label,
                pv.Description,
                pv.Identifier,
                pv.IsCommand,
                pv.commandName,
                pv.Parameters);
    }

    function ControllViewModel() {
        var self = this;
        
        self.zombies = ko.observableArray();
    }

    function Zombie(name, isOnline, activities) {
        var self = this;
        
        self.name = name;
        self.isOnline = ko.observable(isOnline);
        self.activities = convertActivitiesObjectToVm(activities);
        self.logItems = ko.observableArray();
        self.selectedCommand = ko.observable();
    }

    function Activity(name, id, commands, version, creator, lastUpdated) {
        var self = this;
        
        self.name = name;
        self.id = id;
        self.commands = commands;
        self.version = version;
        self.creator = creator;
        self.lastUpdated = lastUpdated;
    }

    function Command(name, label, parameters) {
        var self = this;
        
        self.name = name;
        self.label = label;
        self.parameters = parameters;
    }

    function ParameterDescriptor(name, label, description, isBoolean, pickerValues) {
        var self = this;
        
        self.name = name;
        self.label = label;
        self.isBoolean = isBoolean;
        self.description = description;
        self.pickerValues = pickerValues;
    }
    
    function PickerValue(label, description, identifier, isCommand, commandName, parameters) {
        var self = this;
        
        self.label = label;
        self.description = description;
        self.identifier = identifier;
        self.isCommand = isCommand;
        self.commandName = commandName;
        self.parameters = parameters;
    }
    
    function LogItem(id, zombie, activity, command, parameters, time) {
        var self = this;

        self.uiid = id;
        self.zombie = zombie;
        self.activity = activity;
        self.command = command;
        self.parameters = parameters;
        self.time = time;
        self.messages = ko.observableArray();
        self.result = ko.observable();
    }
    
    function LogItemMessage(type, message) {
        var self = this;

        self.message = message;
        self.type = controll.ActivityMessageType[type];
        self.time = moment().startOf('minute').fromNow();
    }
    
    controll.ControllViewModel = ControllViewModel;

    controll.LogItemMessage = LogItemMessage;
    controll.LogItem = LogItem;
    controll.Zombie = Zombie;
    controll.Activity = Activity;
    controll.Command = Command;
    controll.ParameterDescriptor = ParameterDescriptor;
    controll.PickerValue = PickerValue;

    controll.ActivityMessageType = {
        0: "Started",
        1: "Notification",
        2: "Failed",
        3: "Completed"
    };

    controll.viewModel = new ControllViewModel();
    controll.createCommand = createCommand;
    ko.applyBindings(controll.viewModel);
}(window.controll));