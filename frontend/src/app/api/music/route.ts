import ApiServer from "@/data/datasources/network/api.server";
import SongEntity from "@/domain/entities/song.entity";
import YoutubeConvertor from "@/lib/youtube.convertor";
import { NextRequest, NextResponse } from "next/server";
import { RawQlRequest } from "raw_lib";

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get("Authorization");
        const apiServer = new ApiServer(token);
        const { searchParams } = new URL(req.url);

        let response = await apiServer.post<SongEntity>("/song/list", {
            entity: "Song",
            type: "aggregate",
            pipeline: [
                {
                    lookup: {
                        foreignField: "ref_id",
                        localField: "_id",
                        from: "media",
                        as: "coverImage",
                        pipeline: [
                            {
                                project: {
                                    path: 1,
                                    local: 1,
                                    mimeType: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    limit: Number(searchParams.get("limit")) || 10,
                },
                {
                    skip: ((Number(searchParams.get("page") || 1) - 1) * Number(searchParams.get("limit") || 10))
                }
            ]
        } as RawQlRequest);

        if (!response.status || !response.data || response.data?.type === "single") {
            throw new Error(response.message);
        }

        response = {
            ...response,
            data: {
                ...response.data,
                items: response.data.items.map((s) => {
                    return {
                        ...s,
                        song: `/api/music/stream?id=${s._id}`
                    }
                })
            }
        }
    } catch (error: any) {
        return NextResponse.json({
            status: false,
            message: error?.message || "I'm Sorry for the inconvience but looks like something is wrong",
            data: null,
        });
    }
}

export async function POST(req: NextRequest) {
    try {
        const apiServer = new ApiServer(req.headers.get("Authorization"));

        const formData = await req.formData();

        const youtubeLink = formData.get("youtubeLink") as string;

        console.log('Starting song addition process...');

        const conversionResult = await YoutubeConvertor.convertToWav({ youtubeUrl: youtubeLink });

        if (!conversionResult.status) {
            throw new Error(conversionResult.message || "YouTube conversion failed");
        }

        console.log('YouTube conversion successful, preparing upload...');

        const audioBuffer = Buffer.from(conversionResult.data.item.audio, 'base64');
        const audioBlob = new Blob([audioBuffer], { type: conversionResult.data.item.mimeType });
        const audioFile = new File([audioBlob], `${(formData.get("name") as string).replace(/\s+/g, '_')}.wav`, {
            type: conversionResult.data.item.mimeType
        });

        formData.append("song", audioFile);

        return NextResponse.json(await apiServer.post<SongEntity>("/song/create", formData, "multipart/form-data"))
    } catch (error: any) {
        return NextResponse.json({
            status: false,
            message: error?.message || "I'm Sorry for the inconvience but looks like something is wrong",
            data: null,
        });
    }
}
