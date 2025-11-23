
import {MongoAdapter} from "raw_lib";
import envConfig from "../../../config/env.config";

const mongoAdapter = new MongoAdapter(envConfig.dbURI);

export default mongoAdapter;

