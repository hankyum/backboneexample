define(['thorax'], function(Thorax) {
    return {
        ".criteria": {
            cols: 2,
            eles: [{
                "name": "country",
                "label": "Country",
                "prop": "countrys",
                "url": "/data/country.json",
                "type": "select",
                "child": "state"/*,
                "valsStatic": [{
                    id: '-1',
                    name: 'NONE'
                }]*/
            }, {
                "name": "state",
                "label": "State",
                "type": "select",
                "child": "street",
                "ref": "country.states"/*,
                "valsStatic": [{
                    id: '-1',
                    name: 'NONE'
                }]*/
            }, {
                "name": "street",
                "label": "Street",
                "type": "select",
                "ref": "state.streets"/*,
                "valsStatic": [{
                    id: '-1',
                    name: 'NONE'
                }]*/
            }]
        }
    }
});