
import {RawQlRequest, RawQlResponse} from "raw_lib";
import MediaEntity from "../entities/media.entity";

export default abstract class MediaRepository {
    abstract operation(req: RawQlRequest): Promise<RawQlResponse<number | MediaEntity>>
}
