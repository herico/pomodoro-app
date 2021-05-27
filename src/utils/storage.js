export default class Storage {
    constructor(type) {
        if (!['sessionstorage','localstorage'].includes(type.toLowerCase())) {
            throw new Error(`Storage ${type} not supported`);
        }
        this.storageInstance = type.toLowerCase() === 'sessionstorage' ? sessionStorage : localStorage;
    }
    setItem(key, value) {
        this.storageInstance.setItem(key, JSON.stringify(value));
    }
    getItem(key) {
        return JSON.parse(this.storageInstance.getItem(key))
    }
}