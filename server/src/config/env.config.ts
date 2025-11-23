
import { config } from "dotenv";

config();

interface Config {
    port: number;
    nodeEnv: string;
    dbURI: string;
}

const envConfig: Config = {
    port: Number(process.env.PORT) || 9696,
    nodeEnv: process.env.NODE_ENV || "development",
    dbURI: process.env.DB_URI || "mongodb://localhost:27017/db_name"
}

export default envConfig;
