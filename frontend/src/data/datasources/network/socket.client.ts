import envConfig from "@/config/env.config";
import authTokenStorage from "@/data/datasources/local/authToken.storage";
import io from "socket.io-client";

console.log("Base URL", envConfig.baseUrl);

const socket = io(envConfig.baseUrl, {
    auth: {tokem: authTokenStorage.getToken()},
    transports: ["websocket"],
    autoConnect: true,
    reconnectionDelay: 500,
    reconnectionDelayMax: 20000,
    reconnectionAttempts: 5,
    reconnection: true,
    path: "/ws/v1",
});

export default socket;
