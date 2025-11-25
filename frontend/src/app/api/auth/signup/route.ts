import ApiServer from "@/data/datasources/network/api.server";
import UserEntity from "@/domain/entities/user.entity";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const apiServer = new ApiServer(req.headers.get("Authorization"));

        return NextResponse.json(await apiServer.post<UserEntity>("/auth/signup", await req.json()));
    } catch (error: any) {
        return NextResponse.json({
            status: false,
            message: error.message || "Cannot Register your account for now",
            data: null,
        });
    }
}
