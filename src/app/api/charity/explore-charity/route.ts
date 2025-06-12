import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function GET() {
	try {
		const charity = await prismaClient.charity.findMany({
			include: {
				donations: true,
			},
			where: { status: "publish" },
		});

		const charityWithTotal = charity.map((c) => ({
			...c,
			totalDonationAmount: c.donations.reduce(
				(sum, d) => sum + d.amount,
				0
			),
		}));

		return NextResponse.json(
			{ success: true, data: charityWithTotal },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching charity:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
