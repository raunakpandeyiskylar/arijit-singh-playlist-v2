import LocalStorage from "@/config/storage.config";

class AuthTokenStorage {
    private localStorage = new LocalStorage("authToken");

    getToken() {
        return this.localStorage.get();
    }

    setToken(token: string) {
        return this.localStorage.set(token);
    }

    removeToken() {
        return this.localStorage.remove();
    }
}

export default new AuthTokenStorage();
