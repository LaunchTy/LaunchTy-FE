import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
	try {
		const { status = "pending" } = await request.json();
		console.log("Fetching projects with status:", status);
		const projects = await prismaClient.charity.findMany({
			where: { status },
			orderBy: { charity_end_date: "asc" },
			select: {
				charity_id: true,
				charity_token_symbol: true,
				charity_name: true,
				charity_logo: true,
				charity_short_des: true,
				charity_end_date: true,
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
