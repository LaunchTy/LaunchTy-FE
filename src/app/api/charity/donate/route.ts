import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { charity_id, wallet_address, donate_amount, tx_hash } = body;
		console.log("Received data:", body);

		if (!charity_id || !wallet_address || !donate_amount) {
			return NextResponse.json(
				{ success: false, error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const user = await prismaClient.user.findUnique({
			where: { wallet_address },
		});
		console.log("User found:", user);

		if (!user) {
			return NextResponse.json(
				{ success: false, error: "User not found" },
				{ status: 404 }
			);
		}

		const newDonation = await prismaClient.donation.create({
			data: {
				amount: donate_amount,
				tx_hash: tx_hash,
				user_id: user.user_id,
				charity_id,
			},
		});

		return NextResponse.json(
			{ success: true, data: newDonation },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error creating donation:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
