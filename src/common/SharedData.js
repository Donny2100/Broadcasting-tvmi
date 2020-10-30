const store = {
    stack: {},
    callback: {},
    nStopNews: null,
}

export default class SharedData {
    static setObject(key, value) {
        store.stack[key] = value
    }

    static getObject(key) {
        return store.stack[key]
    }

    static setCallback(callback) {
        store.callback['callback'] = callback
    }
    
    static emitEvent(value) {
        let callback = store.callback['callback']
        if(callback) {
            console.log("EMIT EVENT")
            callback(value)
        }
    }

    static setNonStopNews(data, lang) {
        let obj = {};
        obj[lang] = data;
        store['nStopNews'] = obj;
    }

    static getNonStopNews(lang) {
        if(!store['nStopNews']) return null;
        return store['nStopNews'][lang]
    }
}