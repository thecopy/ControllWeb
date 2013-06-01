(function (window) {
    function guidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    
    function convertParameterViewModelToDictionary(viewModel) {
        var dict = {};
        for (var i = 0; i < viewModel.length; i++) {
            dict[viewModel[i].name] = viewModel[i].value;
        }

        return dict;
    }

    var utility = {
        newId: guidGenerator,
        convertParameterViewModelToDictionary: convertParameterViewModelToDictionary
    };

    if (window.controll == null) {
        window.controll = {};
    }
    window.controll.utility = utility;


})(window);