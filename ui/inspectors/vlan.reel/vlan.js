var Component = require("montage/ui/component").Component,
    NetworkInterfaceType = require("core/model/enumerations/network-interface-type").NetworkInterfaceType,
    Model = require("core/model/model").Model;

/**
 * @class Vlan
 * @extends Component
 */
exports.Vlan = Component.specialize({

    _object: {
        value: null
    },

    object: {
        set: function (networkInterface) {
            if (networkInterface && networkInterface.type === NetworkInterfaceType.VLAN) {
                this._object = networkInterface;

                if (networkInterface) {
                    var self = this;

                    //FIXME: when move to FetchDataWithCriteria when it will have been implemented.
                    this.application.dataService.fetchData(Model.NetworkInterface).then(function (networkInterfaces) {
                        var parentOptions = [],
                            _networkInterface;

                        for (var i = 0, length = networkInterfaces.length; i < length; i++) {
                            _networkInterface = networkInterfaces[i];

                            if (_networkInterface.type === NetworkInterfaceType.LAGG ||
                                _networkInterface.type === NetworkInterfaceType.ETHER) {

                                parentOptions.push(_networkInterface);
                            }
                        }

                        self.parentOptions = parentOptions;
                    });
                }
            } else {
                this._object = null;
            }
        },
        get: function () {
            return this._object;
        }
    },

    parentOptions: {
        value: null
    }

});
