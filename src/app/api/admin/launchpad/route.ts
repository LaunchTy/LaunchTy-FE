import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
	try {
		const { status = "pending" } = await request.json();
		console.log("Fetching projects with status:", status);
		const projects = await prismaClient.launchpad.findMany({
			where: { status },
			orderBy: { launchpad_end_date: "asc" },
			select: {
				launchpad_id: true,
				launchpad_token: true,
				launchpad_name: true,
				launchpad_logo: true,
				launchpad_short_des: true,
				launchpad_end_date: true,
				status: true,
			},
		});

		return NextResponse.json({ success: true, projects }, { status: 200 });
	} catch (error) {
		console.error("Error fetching projects:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
