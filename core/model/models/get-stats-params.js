var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.GetStatsParams = AbstractModel.specialize({
    _end: {
        value: null
    },
    end: {
        set: function (value) {
            if (this._end !== value) {
                this._end = value;
            }
        },
        get: function () {
            return this._end;
        }
    },
    _frequency: {
        value: null
    },
    frequency: {
        set: function (value) {
            if (this._frequency !== value) {
                this._frequency = value;
            }
        },
        get: function () {
            return this._frequency;
        }
    },
    _start: {
        value: null
    },
    start: {
        set: function (value) {
            if (this._start !== value) {
                this._start = value;
            }
        },
        get: function () {
            return this._start;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "end",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "frequency",
            valueType: "String"
        }, {
            mandatory: false,
            name: "start",
            valueType: "datetime"
        }]
    }
});