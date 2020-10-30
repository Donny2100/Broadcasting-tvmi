"use strict";

let GlobalEventInstance = null; // singleton

export default class GlobalEvent {

    constructor() {
        this.callbacks = [];
    }

    static publishEvent(event) {
        let instance = GlobalEvent.getInstance();
        instance.publishEvent(event, null);
    }

    static publishEvent(event, param) {
        console.log('publishEvent');
        
        let instance = GlobalEvent.getInstance();
        instance.callbacks.forEach(function (callback) {
            callback(event, param);
        });
    }

    static getInstance() {
        if (!GlobalEventInstance) {
            GlobalEventInstance = new GlobalEvent();
        }
        return GlobalEventInstance;
    }

    static destroy() {
        let instance = GlobalEvent.getInstance();
        instance.callbacks = null;
        GlobalEventInstance = null;
    }

    static addCallback(item) {
        let instance = GlobalEvent.getInstance();
        let index = instance.callbacks.indexOf(item);
        if (index < 0) {
            instance.callbacks.push(item);
        }
        console.log('addCallback');
    }

    static removeCallback(item) {
        let instance = GlobalEvent.getInstance();
        let index = instance.callbacks.indexOf(item);
        if (index !== -1) {
            instance.callbacks.splice(index, 1);
        }
    }
}