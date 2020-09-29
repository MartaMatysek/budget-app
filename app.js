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

    var calculateTotal = function(type) {
        var sum = 0;
        budget.allItems[type].forEach(function(curr) {
            sum += curr.value;
        });

        budget.totals[type] = sum;
    };

    var budget = {
        allItems: {
            exp: [],
            inc: []
        }, 
        totals: {
            exp: 0,
            inc: 0
        }, 
        totalBudget: 0,
        percentage: -1
    };

    return {
        addNewItem: function(type, desc, val) {
            var budgetList, ID, newItem;

            budgetList = budget.allItems[type];
            if (budget.allItems[type].length > 0) {
                ID = budget.allItems[type][budget.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            newItem = type === 'exp' ? new Expenses(ID, desc, val) : new Incomes(ID, desc, val);
            budget.allItems[type].push(newItem);

            return newItem;
        }, 

        calculateBudget: function() {
            var inc, exp;

            calculateTotal('exp');
            calculateTotal('inc');

            inc = budget.totals.inc;
            exp = budget.totals.exp;

            budget.totalBudget = inc - exp;
            if (inc > 0) {
                budget.percentage = Math.round((exp / inc) * 100);
            } else {
                budget.percentage = -1;
            }
            
        },

        getBugdet: function() {
            return {
                totalBudget: budget.totalBudget,
                totalInc: budget.totals.inc,
                totalExp: budget.totals.exp,
                percentage: budget.percentage
            };
        }
    };
})();

var uiControler = (function() {

    var DOMValues = {
        inputType: '.add-type',
        inputDescription: '.add-description',
        inputValue: '.add-value',
        addButton: '.btn-add', 
        incomeList: '.income-list',
        expensesList: '.expenses-list',
        budgetLabel: '.budget-value',
        totalIncomeLabel: '.budget-income-value',
        totalExpensesLabel: '.budget-expenses-value',
        percentage: '.budget-expenses-percentage'
    };

    return {

        getDOMValues: function() {
            return DOMValues;
        },

        readInputs: function() {
            return { 
                type: document.querySelector(DOMValues.inputType).value,
                description: document.querySelector(DOMValues.inputDescription).value,
                value: parseFloat(document.querySelector(DOMValues.inputValue).value)
            };
        },

        addListItem: function(object, type) {
            var html, containerType, newHtml;

            if (type === 'inc') {
                containerType = DOMValues.incomeList;
                html = '<div class="item clearfix" id="inc-%id%">' + 
                            '<div class="item-description">%description%</div>' + 
                            '<div class="right-side clearfix">' + 
                                '<div class="item-value">%value%</div>' + 
                                '<div class="item-delete">' + 
                                    '<button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button>' + 
                                '</div>' + 
                            '</div>' + 
                        '</div>';
            } else {
                containerType = DOMValues.expensesList;
                html = '<div class="item clearfix" id="exp-%id%">' + 
                            '<div class="item-description">%description%</div>' + 
                            '<div class="right-side clearfix">' + 
                                '<div class="item-value">%value%</div>' + 
                                '<div class="item-delete">' + 
                                    '<button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button>' + 
                                '</div>' + 
                            '</div>' + 
                        '</div>';
            }

            newHtml = html.replace('%id%', object.id);
            newHtml = newHtml.replace('%description%', object.description);
            newHtml = newHtml.replace('%value%', object.value);

            console.log(object.description);
            console.log(newHtml);
            document.querySelector(containerType).insertAdjacentHTML('beforeend', newHtml);
            console.log(newHtml);
        }, 

        clearFields: function() {
            var fields;

            fields = document.querySelectorAll(DOMValues.inputDescription + ', ' + DOMValues.inputValue);
            fields.forEach(function(current) {
                current.value = "";
            })
        },

        updateBudget: function(newBudget) {
            document.querySelector(DOMValues.budgetLabel).textContent = newBudget.totalBudget;
            document.querySelector(DOMValues.totalIncomeLabel).textContent = newBudget.totalInc;
            document.querySelector(DOMValues.totalExpensesLabel).textContent = newBudget.totalExp;
            if (newBudget.percentage > 0) {
                document.querySelector(DOMValues.percentage).textContent = newBudget.percentage + '%';
            } else {
                document.querySelector(DOMValues.percentage).textContent = '---';
            }
        }
    };

})();

var globalControler = (function(budgetControl, uiControl){

    var setupEventListeners = function() {
        var DOM = uiControl.getDOMValues();

        document.querySelector(DOM.addButton).addEventListener('click', addItem);

        document.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                addItem();
            } 
        })
    };

    var calculateBudget = function() {
        budgetControl.calculateBudget();
        var newBudget = budgetControl.getBugdet();
        uiControl.updateBudget(newBudget);
    };

    var addItem = function() {
        var inputs, newItem;
        inputs = uiControl.readInputs();

        if (inputs.description !== "" && !isNaN(inputs.value) && inputs.value > 0) {
            newItem = budgetControl.addNewItem(inputs.type, inputs.description, inputs.value);
            uiControl.addListItem(newItem, inputs.type);
            uiControl.clearFields();
            calculateBudget();
        }
    };

    return {
        init: function() {
            console.log('Application has started!');
            uiControl.updateBudget({
                totalBudget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetControler, uiControler);

globalControler.init();