import LocalStorage from "@/config/storage.config";

class UserIdStorage {
    private localStorage = new LocalStorage("userId");

    getUserId() {
        return this.localStorage.get();
    }

    setUserId(token: string) {
        this.localStorage.set(token);
    }

    removeUserId() {
        this.localStorage.remove();
    }
}

export default new UserIdStorage();
