import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const charity = await prismaClient.charity.findUnique({
			where: {
				charity_id: params.id,
			},
			include: {
				project_owner: {
					select: {
						user_id: true,
						wallet_address: true,
						user_name: true,
					},
				},
				donations: true,
			},
		});

		if (!charity) {
			return NextResponse.json(
				{ success: false, error: "Charity not found" },
				{ status: 404 }
			);
		}

		// Calculate total donation amount
		const charityWithTotal = {
			...charity,
			totalDonationAmount: charity.donations.reduce(
				(sum, donation) => sum + donation.amount,
				0
			),
		};

		return NextResponse.json({ success: true, data: charityWithTotal });
	} catch (error) {
		console.error("Error fetching charity:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch charity" },
			{ status: 500 }
		);
	}
}
