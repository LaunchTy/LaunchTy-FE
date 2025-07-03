import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const launchpads = await prismaClient.launchpad.findMany({
			where: {
				status: "pending",
			},
			select: {
				launchpad_id: true,
				launchpad_name: true,
				launchpad_logo: true,
				launchpad_short_des: true,
				launchpad_token: true,
				launchpad_end_date: true,
			},
			orderBy: {
				launchpad_end_date: "asc",
			},
		});

		const formatted = launchpads.map((lp) => ({
			id: lp.launchpad_id,
			title: lp.launchpad_name,
			image: lp.launchpad_logo,
			shortDescription: lp.launchpad_short_des,
			tokenSymbol: lp.launchpad_token,
			endTime: lp.launchpad_end_date.toISOString(),
			profit: 0, // placeholder vì component yêu cầu
		}));

		return NextResponse.json({ projects: formatted });
	} catch (err) {
		console.error("Failed to fetch project profits:", err);
		return NextResponse.json(
			{ error: "Failed to load project data" },
			{ status: 500 }
		);
	}
}
