import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { wallet_address, launchpad_address, launchpad_id } = body;
		// const { launchpad_id } = body;
		console.log("Wallet address: ", wallet_address);
		console.log("Launchpad ID: ", launchpad_id);
		console.log("Request body:", body);

		if (!wallet_address || !launchpad_id) {
			return NextResponse.json(
				{ success: false, error: "Missing wallet_address" },
				{ status: 400 }
			);
		}

		const launchpad = await prismaClient.launchpad.findUnique({
			where: {
				launchpad_id: launchpad_id,
				user: {
					wallet_address,
				},
				status: "approve",
			},
		});

		if (!launchpad) {
			return NextResponse.json(
				{
					success: false,
					error: "Launchpad not found or not in approve status",
				},
				{ status: 404 }
			);
		}

		const updated = await prismaClient.launchpad.update({
			where: {
				launchpad_id: launchpad_id,
				user: {
					wallet_address,
				},
				status: "approve",
			},
			data: {
				launchpad_id: launchpad_address,
				status: "publish",
			},
		});

		return NextResponse.json(
			{
				success: true,
				message: "Launchpad published successfully",
				project: updated,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error publishing launchpad:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
