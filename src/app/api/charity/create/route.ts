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
			repre_personal_id,
			wallet_address,
			status,
		} = body;

		console.log("Received charity data:", {
			charity_name,
			charity_short_des: charity_short_des?.substring(0, 50) + "...",
			charity_logo: charity_logo ? "Present" : "Missing",
			charity_img: Array.isArray(charity_img)
				? `${charity_img.length} images`
				: "Not array",
			license_certificate: license_certificate ? "Present" : "Missing",
			evidence: Array.isArray(evidence)
				? `${evidence.length} images`
				: "Not array",
			repre_faceid: repre_faceid ? "Present" : "Missing",
			repre_personal_id: repre_personal_id ? "Present" : "Missing",
			charity_start_date: charity_start_date,
			charity_end_date: charity_end_date,
			wallet_address: wallet_address,
		});

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
			!repre_personal_id ||
			!wallet_address ||
			!charity_website
		) {
			const missingFields = [];
			if (!charity_name) missingFields.push("Charity Name");
			if (!charity_short_des) missingFields.push("Short Description");
			if (!charity_long_des) missingFields.push("Long Description");
			if (!charity_logo) missingFields.push("Logo");
			if (!charity_start_date) missingFields.push("Start Date");
			if (!charity_end_date) missingFields.push("End Date");
			if (!repre_name) missingFields.push("Representative Name");
			if (!repre_phone) missingFields.push("Phone Number");
			if (!repre_faceid) missingFields.push("Face ID");
			if (!repre_personal_id) missingFields.push("Personal ID");
			if (!wallet_address) missingFields.push("Wallet Address");
			if (!charity_website) missingFields.push("Website");

			return NextResponse.json(
				{
					success: false,
					error: `Missing required fields: ${missingFields.join(", ")}`,
				},
				{ status: 400 }
			);
		}

		let user = await prismaClient.user.findUnique({
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

		// Ensure image arrays are properly formatted
		const charityImgArray = Array.isArray(charity_img)
			? (charity_img as string[])
			: [];
		const licenseCertificateArray = Array.isArray(license_certificate)
			? (license_certificate as string[])
			: license_certificate
				? [license_certificate]
				: [];
		const evidenceArray = Array.isArray(evidence)
			? (evidence as string[])
			: [];

		const charity = await prismaClient.charity.create({
			data: {
				charity_name,
				charity_short_des,
				charity_long_des,
				charity_token_symbol: charity_token_symbol || "",
				charity_logo,
				charity_fb: charity_fb || "",
				charity_x: charity_x || "",
				charity_ig: charity_ig || "",
				charity_website: charity_website || "",
				charity_whitepaper: charity_whitepaper || "",
				charity_img: charityImgArray,
				charity_start_date: new Date(charity_start_date),
				charity_end_date: new Date(charity_end_date),
				license_certificate: licenseCertificateArray,
				evidence: evidenceArray,
				repre_name,
				repre_phone,
				repre_faceid,
				repre_personal_id,
				project_owner_id: user?.user_id ?? null,
				status: status ?? "pending",
			},
		});

		console.log("Charity created successfully:", charity.charity_id);
		console.log("Full charity object:", JSON.stringify(charity, null, 2));

		return NextResponse.json(
			{ success: true, data: charity },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating charity:", error);
		console.error("Error details:", {
			message: error instanceof Error ? error.message : "Unknown error",
			stack: error instanceof Error ? error.stack : "No stack trace",
		});
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to create charity",
			},
			{ status: 500 }
		);
	} finally {
		console.log("=== Charity Creation API Call Ended ===");
	}
}
