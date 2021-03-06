var Montage = require("montage").Montage,
    Uuid = require("montage/core/uuid").Uuid;

var SelectionService = exports.SelectionService = Montage.specialize({
    _tasks: {
        value: null
    },

    _sections: {
        value:  null
    },

    needsRefresh: {
        value: false
    },

    constructor: {
        value: function() {
            this._sections = new Map();
            this._tasks = new Map();
        }
    },

    saveSelection: {
        value: function(section, selection) {
            if (section && selection && selection.length > 0) {
                this._section = section;
                this._sections.set(
                    section, 
                    selection.slice(1).map(function(x) { return x.object; })
                );
            }
        }
    },

    getSelection: {
        value: function(section) {
            return this._sections.get(section);
        }
    },

    getCurrentSelection: {
        value: function() {
            return this._sections.get(this._section);
        }
    },

    saveTemporaryTaskSelection: {
        value: function() {
            if (this._section) {
                var temporaryId = Uuid.generate();
                this._tasks.set(temporaryId, {
                    path: this._sections.get(this._section).slice(),
                    section: this._section
                });
                return temporaryId;
            }
        }
    },

    persistTaskSelection: {
        value: function(temporaryId, taskId) {
            this._tasks.set(taskId, this._tasks.get(temporaryId));
            this._tasks.delete(temporaryId);
        }
    },

    restoreTaskSelection: {
        value: function(taskId) {
            var taskSelection = this._tasks.get(taskId);
            if (taskSelection) {
                this._sections.set(taskSelection.section, taskSelection.path);
                return taskSelection.section;
            }
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new SelectionService();
            }
            return this._instance;
        }
    }
});
