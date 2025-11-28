
export default interface MediaEntity {
    _id?: string,
    path: string,
    local: boolean,
    ref_code?: string;
    ref_id: string;
    mimeType: string,
    createdAt: string,
    updatedAt: string,
}
