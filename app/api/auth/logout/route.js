import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const response = NextResponse.json({ success: true, message: "Logged out successfully" });

        // Remove the userId cookie
        response.cookies.delete("userId");

        // Alternatively, set it to expire immediately if delete() behaves oddly in some envs
        // response.cookies.set("userId", "", { maxAge: 0, path: "/" });

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Logout failed" }, { status: 500 });
    }
}
