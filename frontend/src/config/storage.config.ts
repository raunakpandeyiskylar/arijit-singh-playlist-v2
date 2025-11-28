export default class LocalStorage {
    private readonly key: string;

    constructor(key: string) {
        this.key = key;
    }

    get() {
        return localStorage.getItem(this.key);
    }

    set(value: string) {
        return localStorage.setItem(this.key, value);
    }

    remove() {
        return localStorage.removeItem(this.key);
    }

    removeAll() {
        return localStorage.clear();
    }
}
