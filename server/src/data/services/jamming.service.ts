import { RawQlEngine, RawQlRequest, RawQlResponse } from "raw_lib";
import JammingRepository from "../../domain/repositories/jamming.repository";
import Jamming from "../../domain/entities/jaming.entity";

export default class JammingService implements JammingRepository {
    constructor(private engine: RawQlEngine) { }

    async createSession(jamm: Jamming): Promise<RawQlResponse<Jamming>> {
        return await this.engine.execute({
            entity: "Jamms",
            type: "create",
            data: jamm
        }) as RawQlResponse<Jamming>;
    }

    async endSession(jamm: Jamming): Promise<RawQlResponse<Jamming>> {
        return await this.engine.execute({
            entity: "Jamms",
            type: "update",
            id: jamm?._id,
            data: {
                endAt: Date.now(),
                restartedAt: null,
            },
        }) as RawQlResponse<Jamming>
    }

    async restartSession(jamm: Jamming): Promise<RawQlResponse<Jamming>> {
        return await this.engine.execute({
            entity: "Jamms",
            type: "update",
            id: jamm?._id,
            data: {
                endAt: null,
                restartedAt: Date.now(),
            }
        }) as RawQlResponse<Jamming>;
    }

    async getsessions(req: RawQlRequest): Promise<RawQlResponse<number | Jamming>> {
        if (["create", "update", "delete"].includes(req.type)) {
            throw new Error("You are not allowed to perform these actions");
        }
        return await this.engine.execute(req);
    }
}
