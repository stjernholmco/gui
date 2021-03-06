/**
 * @module ui/directory-services.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    DirectoryServicesInspector = require("ui/inspectors/directory-services.reel/directory-services").DirectoryServices;

/**
 * @class DirectoryServices
 * @extends Component
 */
var DirectoryServices = exports.DirectoryServices = Component.specialize(/** @lends DirectoryServices# */ {

    enterDocument: {
        value: function () {
            this._fetchDataIfNeeded();
        }
    },

    _fetchDataIfNeeded: {
        value: function () {
            var directoryTypesKeyValuesKeys = Object.keys(DirectoryServicesInspector.DIRECTORY_TYPES_KEY_VALUES),
                directoryTypesValueKeys = DirectoryServicesInspector.DIRECTORY_TYPES_VALUE_KEYS,
                directoryTypesLabels = DirectoryServicesInspector.DIRECTORY_TYPES_LABELS,
                directoryServicesMap = new Map(),
                directoryServices, directoryService,
                directoryTypesValueKey,
                directoryTypesKeyValue,
                directory, i, length,
                promises = [],
                self = this;

            for (i = 0, length = directoryTypesKeyValuesKeys.length; i < length; i++) {
                directoryTypesKeyValue = directoryTypesKeyValuesKeys[i];

                if (!directoryServicesMap.has(directoryTypesKeyValue)) {
                    promises.push(this._getNewDirectoryInstance(directoryTypesKeyValue));
                }
            }

            Promise.all(promises).then(function (directoryServices) {
                var directoryService;

                for (i = 0, length = directoryServices.length; i < length; i++) {
                    directoryService = directoryServices[i];
                    directoryServicesMap.set(directoryServices[i].type || i, directoryService);
                }

                self.object.$directoryServices = self.directoryServices = self.application.dataService.setTypeForCollection(
                    directoryServicesMap.toArray(),
                    Model.Directory
                );
            });
        }
    },

    _getNewDirectoryInstance: {
        value: function (type) {
            var directoryTypesKeyValues = DirectoryServicesInspector.DIRECTORY_TYPES_KEY_VALUES,
                directoryTypesLabels = DirectoryServicesInspector.DIRECTORY_TYPES_LABELS;

            return this.application.dataService.getNewInstanceForType(Model.Directory).then(function (directory) {
                directory.type = directoryTypesKeyValues[type];
                directory.parameters = {"%type": directory.type + "-directory-params"};
                directory.label = directoryTypesLabels[directory.type];

                return directory;
            });
        }
    }
});
