import { auth } from "@/lib/betterAuth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handlers = auth.handlers.next();

export const GET = handlers.GET;

export const POST = async (req: Request, ctx: unknown) => {
	try {
		return await handlers.POST(req as any, ctx as any);
	} catch (err: any) {
		// Log full details to the server console and return JSON (not HTML)
		console.error("/api/auth error", err?.stack || err);
		const message = err?.message || "Internal Server Error";
		return NextResponse.json(
			{
				error: message,
				stack: process.env.NODE_ENV === "production" ? undefined : err?.stack,
			},
			{ status: 500 }
		);
	}
};
