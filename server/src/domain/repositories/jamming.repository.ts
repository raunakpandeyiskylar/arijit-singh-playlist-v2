import { RawQlRequest, RawQlResponse } from "raw_lib";
import Jamming from "../entities/jaming.entity";

export default abstract class JammingRepository {
    abstract createSession(jamm: Jamming): Promise<RawQlResponse<Jamming>>;
    abstract endSession(jamm: Jamming): Promise<RawQlResponse<Jamming>>;
    abstract restartSession(jamm: Jamming): Promise<RawQlResponse<Jamming>>;
    abstract getsessions(req: RawQlRequest): Promise<RawQlResponse<number | Jamming>>;
}
