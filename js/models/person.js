define([
    'thorax',
    'models/person-criteria'
], function(Thorax, Criteria) {
    return _.extend({
        ".notEditable": {
           
        },
        ".switches": {
            cols: 3,
            eles: [{
                name: "state",
                label: "State",
                vals: ['active', 'inactive'],
                type: 'checkbox'
            }, {
                name: "Gender",
                label: "Can get balance",
                type: "checkbox",
                vals: ['Boy', 'Girl']
            }]
        },
        ".others": {
            cols: 3,
            eles: [{
                name: "identitycheck",
                label: 'ID Check',
                type: 'select',
                vals: [{
                    val: 'O',
                    name: 'Optional'
                }, {
                    val: 'Y',
                    name: 'Yes'
                }, {
                    val: 'N',
                    name: 'No'
                }]
            }]
        },
        ".amounts": {
            cols: 3,
            eles: [{
                name: 'mincharge',
                label: "Min charge",
                validators: {
                    numeric: {},
                    notEmpty: {}
                }
            }, {
                name: 'maxcharge',
                label: "Max charge",
                validators: {
                    numeric: {},
                    notEmpty: {}
                }
            }, {
                name: 'maxovercharge',
                label: "Max over charge",
                validators: {
                    numeric: {},
                    notEmpty: {}
                }
            }]
        }
    }, Criteria)
});