var budgetControler = (function() {
    // todo
})();

var uiControler = (function() {

    var DOMValues = {
        inputType: '.add-type',
        inputDescription: '.add-description',
        inputValue: '.add-value',
        addButton: '.btn-add'
    }

    return {

        getDOMValues: function() {
            return DOMValues;
        },

        readInputs: function() {
            return { 
                type: document.querySelector(DOMValues.inputType).value,
                description: document.querySelector(DOMValues.inputDescription).value,
                value: document.querySelector(DOMValues.inputValue).value
            };
        }
    };

})();

var globalControler = (function(budgetControl, uiControl){

    var DOM = uiControl.getDOMValues();

    var addItem = function() {
        var inputs = uiControl.readInputs();
        console.log(inputs);
    }

    document.querySelector(DOM.addButton).addEventListener('click', addItem);

    document.addEventListener('keypress', function(event) {
        if (event.key === "Enter") {
            addItem();
        } 
    })

})(budgetControler, uiControler);
