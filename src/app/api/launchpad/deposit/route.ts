import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { launchpad_id, wallet_address, deposit_amount, tx_hash } = body;

		if (!launchpad_id || !wallet_address || !deposit_amount) {
			return NextResponse.json(
				{ success: false, error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const user = await prismaClient.user.findUnique({
			where: { wallet_address },
		});

		if (!user) {
			return NextResponse.json(
				{ success: false, error: "User not found" },
				{ status: 404 }
			);
		}

		const newDeposit = await prismaClient.deposit.create({
			data: {
				amount: deposit_amount,
				tx_hash: tx_hash,
				user_id: user.user_id,
				launchpad_id,
			},
		});

		return NextResponse.json(
			{ success: true, data: newDeposit },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating deposit:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
