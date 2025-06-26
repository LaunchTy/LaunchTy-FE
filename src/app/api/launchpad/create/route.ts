import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
	console.log("API route hit!");
	try {
		const body = await req.json();

		const {
			launchpad_id,
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
		console.log("Received data:", body);

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

		const newLaunchpad = await prismaClient.launchpad.create({
			data: {
				launchpad_id,
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
				project_owner_id: user?.user_id!,
				status: "pending",
			},
		});

		return NextResponse.json(
			{ success: true, data: newLaunchpad },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating launchpad:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
