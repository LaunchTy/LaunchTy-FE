import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const {
			token_address,
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
			project_owner_id,
		} = body;
		console.log("Received data:", body);

		const newLaunchpad = await prismaClient.launchpad.create({
			data: {
				token_address,
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
				project_owner_id,
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
