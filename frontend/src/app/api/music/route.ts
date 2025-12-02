/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiServer from "@/data/datasources/network/api.server";
import SongEntity from "@/domain/entities/song.entity";
import { NextRequest, NextResponse } from "next/server";
import { RawQlPipelineStep, RawQlRequest } from "raw_lib";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization");
    const apiServer = new ApiServer(token);
    const { searchParams } = new URL(req.url);

    const pipeline: RawQlPipelineStep[] = [
      {
        lookup: {
          foreignField: "ref_id",
          localField: "_id",
          from: "media",
          as: "coverImage",
          pipeline: [
            {
              match: {
                field: "ref_code",
                op: "eq",
                value: "song_cover",
              }
            },
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
        unwind: {
          path: "coverImage",
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        limit: Number(searchParams.get("limit")) || 10,
      },
      {
        skip:
          (Number(searchParams.get("page") || 1) - 1) *
          Number(searchParams.get("limit") || 10),
      },
    ];

    if (searchParams.get("id")) {
      pipeline.unshift({
        match: {
          field: "_id",
          op: "eq",
          value: searchParams.get("id"),
        },
      });
    }

    let response = await apiServer.post<SongEntity>("/song/list", {
      entity: "Song",
      type: "aggregate",
      pipeline,
    } as RawQlRequest);

    if (
      !response.status ||
      !response.data ||
      response.data?.type === "single"
    ) {
      throw new Error(response.message);
    }

    response = {
      ...response,
      data: {
        ...response.data,
        items: response.data.items.map((s) => {
          return {
            ...s,
            song: `/api/music/stream?id=${s._id}`,
          };
        }),
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({
      status: false,
      message:
        error?.message ||
        "I'm Sorry for the inconvience but looks like something is wrong",
      data: null,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiServer = new ApiServer(req.headers.get("Authorization"));

    const formData = await req.formData();

    const youtubeLink = formData.get("youtubeLink") as string;

    console.log("Starting song addition process...");

    const conversionResult = await apiServer.post<{
      audio: string,
      mimeType: string,
      size?: number;
    }>("/convert", { youtubeUrl: youtubeLink });

    if (!conversionResult.status) {
      throw new Error(conversionResult.message || "YouTube conversion failed");
    }

    console.log("YouTube conversion successful, preparing upload...");

    if (!conversionResult.status || !conversionResult.data || conversionResult.data.type !== "single") {
      throw new Error(conversionResult.message);
    }

    const audioBuffer = Buffer.from(conversionResult.data.item.audio, "base64");
    const audioBlob = new Blob([audioBuffer], {
      type: conversionResult.data.item.mimeType,
    });
    const audioFile = new File(
      [audioBlob],
      `${(formData.get("name") as string).replace(/\s+/g, "_")}.mp3`,
      {
        type: conversionResult.data.item.mimeType,
      }
    );

    formData.append("song", audioFile);

    ["song_cover", "song"].forEach(a => formData.append("ref_code", a))

    return NextResponse.json(
      await apiServer.post<SongEntity>(
        "/song/create",
        formData,
      )
    );
  } catch (error: any) {
    return NextResponse.json({
      status: false,
      message:
        error?.message ||
        "I'm Sorry for the inconvience but looks like something is wrong",
      data: null,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const apiServer = new ApiServer(req.headers.get("Authorization"));

    const formData = await req.formData();

    return NextResponse.json(
      await apiServer.post<SongEntity>(
        "/song/update",
        formData,
        "multipart/form-data"
      )
    );
  } catch (error: any) {
    return NextResponse.json({
      status: false,
      message:
        error?.message ||
        "I'm Sorry for the inconvience but looks like something is wrong",
      data: null,
    });
  }
}
