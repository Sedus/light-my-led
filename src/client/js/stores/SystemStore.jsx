var AppDispatcher = require('./../dispatchers/appDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('lodash');
var Promise = require('bluebird');

var CHANGE_EVENT = 'change';

var SystemStore = assign({}, EventEmitter.prototype, {
    components: [
        {color: 'red', name: 'led-1', isOn: false},
        {color: 'green', name: 'led-2', isOn: false}
    ],

    getAllComponents: function () {
        return this.components;
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

});

var find = Promise.method(function (comp) {
    return _.find(SystemStore.components, function (component) {
        return component.name === comp.name;
    })
});

AppDispatcher.register(function (payload) {

    switch (payload.eventName) {
        case 'toggleState':
            console.log('Toggle state on ' + payload.component.name);
            find(payload.component)
                .then(function (component) {
                    component.isOn = !component.isOn;
                    SystemStore.emitChange();
                });
            break;
    }

    return true; // Needed for Flux promise resolution

});

module.exports = SystemStore;
