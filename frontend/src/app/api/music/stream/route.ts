import envConfig from "@/config/env.config";
import ApiServer from "@/data/datasources/network/api.server";
import MediaEntity from "@/domain/entities/media.entity";
import { NextRequest, NextResponse } from "next/server";
import { RawQlRequest } from "raw_lib";

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get("Authorization");
        const apiServer = new ApiServer(token);
        const { searchParams } = new URL(req.url);

        if (!searchParams.get("id")) {
            throw new Error("I'm Sorry I don't know what are you asking for");
        }

        const response = await apiServer.post<MediaEntity>("/song/list", {
            entity: "Media",
            type: "get",
            filter: {
                field: "ref_id",
                op: "eq",
                value: searchParams.get("id"),
            }
        } as RawQlRequest);

        if (!response.status || !response.data || response.data.type !== "single") {
            throw new Error(response.message);
        }

        const audioResponse = await fetch(response.data.item?.local ? `${envConfig.baseUrl}${response.data.item?.path}` : response.data.item?.path);
        if (!audioResponse.ok) {
            throw new Error("Failed to get the song for you");
        }

        const contentLength = audioResponse.headers.get('content-length');
        const headers: HeadersInit = {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'private, max-age=3600',
            ...(contentLength ? { 'Content-Length': contentLength } : {}),
        };

        return new Response(audioResponse.body, {
            headers,
        });

    } catch (error: any) {
        return NextResponse.json({
            status: false,
            message: error?.message || "I'm Sorry for the inconvience but looks like something is wrong",
            data: null,
        });
    }
}
