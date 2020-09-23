var budgetControler = (function() {

    var Expenses = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Incomes = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var budget = {
        allItems: {
            exp: [],
            inc: []
        }, 
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addNewItem: function(type, desc, val) {
            var budgetType, ID, newItem;

            budgetType = this.budget.allItems[type];
            ID = budgetType[budgetType.length - 1].id + 1;

            newItem = type === "exp" ? new Expenses(ID, desc, val) : new Incomes(ID, desc, val);
            budgetType.push(newItem);

            return newItem;
        }
    }
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

    var setupEventListeners = function() {
        var DOM = uiControl.getDOMValues();

        document.querySelector(DOM.addButton).addEventListener('click', addItem);

        document.addEventListener('keypress', function(event) {
            if (event.key === "Enter") {
                addItem();
            } 
        })
    };

    var addItem = function() {
        var inputs, newItem;
        inputs = uiControl.readInputs();
        newItem = budgetControl.addNewItem(inputs.type, inputs.description, inputs.value);
    }

    return {
        init: function() {
            console.log("Application has started!");
            setupEventListeners();
        }
    }
    
})(budgetControler, uiControler);

globalControler.init();