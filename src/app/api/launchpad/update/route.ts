import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function PUT(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const launchpadId = searchParams.get("launchpad_id");
		const body = await req.json();

		if (!launchpadId) {
			return NextResponse.json(
				{ success: false, error: "Missing launchpad_id" },
				{ status: 400 }
			);
		}

		const {
			token_address,
			total_supply,
			launchpad_token,
			max_stake,
			min_stake,
			soft_cap,
			hard_cap,
			launchpad_name,
			launchpad_logo,
			launchpad_short_des,
			launchpad_long_des,
			launchpad_fb,
			launchpad_x,
			launchpad_ig,
			launchpad_website,
			launchpad_whitepaper,
			launchpad_img,
			launchpad_start_date,
			launchpad_end_date,
			wallet_address,
		} = body;

		// Verify the user owns this launchpad
		const user = await prismaClient.user.findUnique({
			where: { wallet_address },
		});

		if (!user) {
			return NextResponse.json(
				{
					success: false,
					error: "User not found with given wallet address.",
				},
				{ status: 404 }
			);
		}

		// Check if the launchpad exists and belongs to the user
		const existingLaunchpad = await prismaClient.launchpad.findFirst({
			where: {
				launchpad_id: launchpadId,
				project_owner_id: user.user_id,
			},
		});

		if (!existingLaunchpad) {
			return NextResponse.json(
				{
					success: false,
					error: "Launchpad not found or you don't have permission to edit it.",
				},
				{ status: 404 }
			);
		}

		// Update the launchpad
		const updatedLaunchpad = await prismaClient.launchpad.update({
			where: {
				launchpad_id: launchpadId,
			},
			data: {
				token_address,
				total_supply,
				launchpad_token,
				max_stake,
				min_stake,
				soft_cap,
				hard_cap,
				launchpad_name,
				launchpad_logo,
				launchpad_short_des,
				launchpad_long_des,
				launchpad_fb,
				launchpad_x,
				launchpad_ig,
				launchpad_website,
				launchpad_whitepaper,
				launchpad_img,
				launchpad_start_date: new Date(launchpad_start_date),
				launchpad_end_date: new Date(launchpad_end_date),
				status: "pending", // Reset to pending for admin review
			},
		});

		return NextResponse.json(
			{ success: true, data: updatedLaunchpad },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating launchpad:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
