interface Config {
    baseUrl: string,
    clientUrl: string,
    encryptionKey: string;
}

const envConfig: Config = {
    baseUrl: process.env["NETWORK_BASE_URL"] || "http://localhost:6969/",
    clientUrl: process.env["NEXT_PUBLIC_CLIENT_URL"] || "",
    encryptionKey: process.env.ENCRYPTION_KEY || "5faf12faf28efcdc07cc6d4a2368c908d7a33d5b057b33cd41ca24aa84b267cb"
}

export default envConfig;

