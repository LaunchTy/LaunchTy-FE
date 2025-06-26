import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const CharityId = searchParams.get("charity_id");
		console.log("CharityId:", CharityId);

		if (!CharityId) {
			return NextResponse.json(
				{ success: false, error: "Missing charity_id" },
				{ status: 400 }
			);
		}

		const charity = await prismaClient.charity.findUnique({
			where: {
				charity_id: CharityId,
			},
		});

		return NextResponse.json(
			{ success: true, data: charity },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching charity detail:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
