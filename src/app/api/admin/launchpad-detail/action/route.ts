import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { launchpad_id, action } = body;

		if (!launchpad_id || !["approve", "deny"].includes(action)) {
			return NextResponse.json(
				{ message: "Invalid data" },
				{ status: 400 }
			);
		}

		const updated = await prismaClient.launchpad.update({
			where: { launchpad_id: launchpad_id },
			data: { status: action },
		});

		return NextResponse.json({
			message: `Project ${action} successfully`,
			project: updated,
		});
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
