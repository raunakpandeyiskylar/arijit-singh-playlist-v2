import ApiServer from "@/data/datasources/network/api.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get("Authorization");
        const apiServer = new ApiServer(token);

        return NextResponse.json(await apiServer.post("/auth/logout"))
    } catch (error: any) {
        return NextResponse.json({
            status: false,
            message: error.message || "Something went wrong",
            data: null,
        });
    }
}
