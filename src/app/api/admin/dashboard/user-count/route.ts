import prismaClient from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const total = await prismaClient.user.count();

		return NextResponse.json({
			total,
		});
	} catch (error) {
		console.error("Error fetching user count:", error);
		return NextResponse.json(
			{ error: "Failed to fetch user count" },
			{ status: 500 }
		);
	}
}
