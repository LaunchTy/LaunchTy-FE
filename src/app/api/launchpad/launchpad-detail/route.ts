import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const LaunchpadId = searchParams.get("launchpad_id");
		console.log("LaunchpadId:", LaunchpadId);

		if (!LaunchpadId) {
			return NextResponse.json(
				{ success: false, error: "Missing LaunchpadId" },
				{ status: 400 }
			);
		}

		const launchpad = await prismaClient.launchpad.findUnique({
			where: {
				launchpad_id: LaunchpadId,
			},
		});
		console.log("Fetched launchpad:", launchpad);

		return NextResponse.json(
			{ success: true, data: launchpad },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching projects:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
