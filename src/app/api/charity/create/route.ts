import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function POST(req: NextRequest) {
	console.log("=== Charity Creation API Call Started ===");

	try {
		const body = await req.json();
		const {
			charity_name,
			charity_short_des,
			charity_long_des,
			charity_token_symbol,
			charity_logo,
			charity_fb,
			charity_x,
			charity_ig,
			charity_website,
			charity_whitepaper,
			charity_img,
			charity_start_date,
			charity_end_date,
			license_certificate,
			evidence,
			repre_name,
			repre_phone,
			repre_faceid,
			wallet_address,
			status,
		} = body;

		if (
			!charity_name ||
			!charity_short_des ||
			!charity_long_des ||
			!charity_logo ||
			!charity_start_date ||
			!charity_end_date ||
			!repre_name ||
			!repre_phone ||
			!repre_faceid ||
			!wallet_address
		) {
			return NextResponse.json(
				{ success: false, error: "Missing required fields" },
				{ status: 400 }
			);
		}

		let user = await prismaClient.user.findUnique({
			where: { wallet_address },
		});

		const charity = await prismaClient.charity.create({
			data: {
				charity_name,
				charity_short_des,
				charity_long_des,
				charity_token_symbol,
				charity_logo,
				charity_fb,
				charity_x,
				charity_ig,
				charity_website,
				charity_whitepaper,
				charity_img,
				charity_start_date: new Date(charity_start_date),
				charity_end_date: new Date(charity_end_date),
				license_certificate,
				evidence,
				repre_name,
				repre_phone,
				repre_faceid,
				project_owner_id: user?.user_id ?? null,
				status: status ?? "pending",
			},
		});

		return NextResponse.json(
			{ success: true, data: charity },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating charity:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to create charity" },
			{ status: 500 }
		);
	} finally {
		console.log("=== Charity Creation API Call Ended ===");
	}
}
