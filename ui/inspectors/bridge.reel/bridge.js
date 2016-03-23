var Component = require("montage/ui/component").Component,
    NetworkInterfaceType = require("core/model/enumerations/network-interface-type").NetworkInterfaceType,
    Model = require("core/model/model").Model;

/**
 * @class Bridge
 * @extends Component
 */
var Bridge = exports.Bridge = Component.specialize({

    _object: {
        value: null
    },

    memberOptions: {
        value: null
    },

    dhcpAlias: {
        value: null
    },

    staticIP: {
        value: null
    },

    otherAliases: {
        value: null
    },

    ipAddressSource: {
        value: null
    },

    editMode: {
        value: null
    },

    constructor: {
        value: function() {
            this.super();
            this.dhcpAlias =
                {address: "",
                 netmask: null,
                 type: "INET" };
        }
    },

    object: {
        set: function (networkInterface) {
            if (networkInterface && networkInterface.type === NetworkInterfaceType.BRIDGE) {
                this._object = networkInterface;

                if (networkInterface) {

                    this.editMode = !!networkInterface.id ? "editing" : "creating";
                    // Filter member options
                    //FIXME: when move to FetchDataWithCriteria when it will have been implemented.
                    this.application.dataService.fetchData(Model.NetworkInterface).then(function (networkInterfaces) {
                        var memberOptions = [],
                            _networkInterface;

                        for (var i = 0, length = networkInterfaces.length; i < length; i++) {
                            _networkInterface = networkInterfaces[i];

                            if (_networkInterface.type === NetworkInterfaceType.ETHER) {
                                memberOptions.push(_networkInterface);
                            }
                        }

                        this.memberOptions = memberOptions;
                    }.bind(this));
                    if (networkInterface.dhcp) {
                        this.ipAddressSource = "dhcp";
                        // The first and only ipv4 address in the read-only aliases is
                        // always the one assigned by dhcp if dhcp is enabled.
                        // Otherwise the one pre-set in the inspector applies.
                        for (var i = 0, length = networkInterface.status.aliases.length; i < length; i++ ) {
                            if (networkInterface.status.aliases[i].type === "INET") {
                                this.dhcpAlias = networkInterface.status.aliases[i];
                                break;
                            }
                        }
                    } else {
                        this.ipAddressSource = "static";
                    }
                    // This always applies, in case they switch off DHCP
                    this.staticIP = networkInterface.aliases.slice(0, 1);
                    this.otherAliases = networkInterface.aliases.slice(1);
                }
            } else {
                this._object = null;
            }
        },
        get: function () {
            var newObject = new Object(this._object);
            newObject.aliases = this.staticIP.concat(this.otherAliases).filter(function(alias) {return !!alias});
            return newObject;
        }
    }

});
