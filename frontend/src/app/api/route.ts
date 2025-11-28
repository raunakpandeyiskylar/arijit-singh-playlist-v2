import { NextResponse } from "next/server"

export function GET() {
    return NextResponse.json({
        status: true,
        message: "Welcome to the Musical World",
        data: null,
    })
}
