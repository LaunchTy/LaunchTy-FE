import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	console.log("=== Charity Update API Call Started ===");
	console.log("Charity ID:", params.id);

	try {
		const body = await req.json();
		console.log("Request body:", body);

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
			status,
		} = body;

		console.log("Extracted fields:", {
			charity_name,
			charity_short_des,
			charity_long_des,
			charity_token_symbol,
			charity_logo: charity_logo ? "present" : "missing",
			charity_fb,
			charity_x,
			charity_ig,
			charity_website,
			charity_whitepaper,
			charity_img: charity_img
				? `array with ${charity_img.length} items`
				: "missing",
			charity_start_date,
			charity_end_date,
			license_certificate: license_certificate ? "present" : "missing",
			evidence: evidence
				? `array with ${evidence.length} items`
				: "missing",
			repre_name,
			repre_phone,
			repre_faceid: repre_faceid ? "present" : "missing",
			status,
		});

		console.log("Attempting database update...");

		// First check if the charity exists
		const existingCharity = await prismaClient.charity.findUnique({
			where: {
				charity_id: params.id,
			},
		});

		if (!existingCharity) {
			console.error("Charity not found with ID:", params.id);
			return NextResponse.json(
				{ success: false, error: "Charity not found" },
				{ status: 404 }
			);
		}

		console.log("Charity found, proceeding with update...");

		const charity = await prismaClient.charity.update({
			where: {
				charity_id: params.id,
			},
			data: {
				...(charity_name && { charity_name }),
				...(charity_short_des && { charity_short_des }),
				...(charity_long_des && { charity_long_des }),
				...(charity_token_symbol && { charity_token_symbol }),
				...(charity_logo && { charity_logo }),
				...(charity_fb && { charity_fb }),
				...(charity_x && { charity_x }),
				...(charity_ig && { charity_ig }),
				...(charity_website && { charity_website }),
				...(charity_whitepaper && { charity_whitepaper }),
				...(charity_img && { charity_img }),
				...(charity_start_date && {
					charity_start_date: new Date(charity_start_date),
				}),
				...(charity_end_date && {
					charity_end_date: new Date(charity_end_date),
				}),
				...(license_certificate && { license_certificate }),
				...(evidence && { evidence }),
				...(repre_name && { repre_name }),
				...(repre_phone && { repre_phone }),
				...(repre_faceid && { repre_faceid }),
				...(status && { status }),
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

		console.log("Database update successful:", charity);

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
		console.error("=== Charity Update API Error ===");
		console.error("Error details:", error);
		console.error(
			"Error message:",
			error instanceof Error ? error.message : "Unknown error"
		);
		console.error(
			"Error stack:",
			error instanceof Error ? error.stack : "No stack trace"
		);
		return NextResponse.json(
			{ success: false, error: "Failed to update charity" },
			{ status: 500 }
		);
	} finally {
		console.log("=== Charity Update API Call Ended ===");
	}
}
