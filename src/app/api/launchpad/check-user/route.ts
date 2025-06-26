import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { wallet_address } = body;

		if (!wallet_address) {
			return NextResponse.json(
				{ success: false, error: "Missing wallet_address" },
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

		const userId = user.user_id;

		const launchpads = await prismaClient.launchpad.findFirst({
			where: { project_owner_id: userId },
		});

		const investment = await prismaClient.deposit.findFirst({
			where: { user_id: userId },
		});

		return NextResponse.json(
			{
				success: true,
				data: {
					userId,
					hasLaunchpad: !!launchpads,
					hasInvestment: !!investment,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error in overview API:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
