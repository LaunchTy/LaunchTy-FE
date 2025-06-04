import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function GET() {
	// console.log("GET /api/launchpad hit!");
	try {
		const launchpads = await prismaClient.launchpad.findMany();

		return NextResponse.json(
			{ success: true, data: launchpads },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching launchpads:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
