import ApiServer from "@/data/datasources/network/api.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const token = req.headers.get("Authorization");
    const apiServer = new ApiServer(token);

    return NextResponse.json(await apiServer.post("/auth/login", await req.json()))
}
