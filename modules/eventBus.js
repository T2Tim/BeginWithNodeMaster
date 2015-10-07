var events = require('events');
var mEventBus;

/**
 * Event bus - This is a singleton wrapper around the events module
 * that allows us to use a single event bus by just requiring in the app
 */

module.exports.EventBus = function(){

    if (!mEventBus){
        mEventBus = new events.EventEmitter();
    }

    function _on(pEvent, pHandler){
        mEventBus.on(pEvent, pHandler);
    }

    function _fire(pEvent, pPayload){
        mEventBus.emit(pEvent, pPayload);
    }

    return {
        on: _on,
        fire: _fire,
        emit: _fire
    }
};
