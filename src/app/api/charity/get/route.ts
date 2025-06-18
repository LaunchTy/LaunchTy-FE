import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function GET(req: NextRequest) {
	console.log("=== Charity Fetch API Call Started ===");

	const headers = {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	};

	try {
		// Get URL parameters
		const searchParams = req.nextUrl.searchParams;
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const search = searchParams.get("search") || "";
		const ownerWallet = searchParams.get("owner_wallet");
		const repreWallet = searchParams.get("repre_wallet");
		const status = searchParams.get("status"); // active, ended, upcoming

		console.log("=== Request Parameters ===");
		console.log({
			page,
			limit,
			search,
			ownerWallet,
			repreWallet,
			status,
		});

		// Build where clause
		const where: any = {};

		// Add search condition
		if (search) {
			where.OR = [
				{ charity_name: { contains: search, mode: "insensitive" } },
				{
					charity_short_des: {
						contains: search,
						mode: "insensitive",
					},
				},
				{ charity_long_des: { contains: search, mode: "insensitive" } },
			];
		}

		// Add owner filter
		if (ownerWallet) {
			where.owner = {
				wallet_address: ownerWallet,
			};
		}

		// Add representative filter
		if (repreWallet) {
			where.representative = {
				wallet_address: repreWallet,
			};
		}

		// Add status filter
		const now = new Date();
		if (status) {
			switch (status.toLowerCase()) {
				case "active":
					where.AND = [
						{ charity_start_date: { lte: now } },
						{ charity_end_date: { gte: now } },
					];
					break;
				case "ended":
					where.charity_end_date = { lt: now };
					break;
				case "upcoming":
					where.charity_start_date = { gt: now };
					break;
			}
		}

		console.log("=== Database Query Parameters ===");
		console.log("Where clause:", JSON.stringify(where, null, 2));

		// Get total count for pagination
		const total = await prismaClient.charity.count({ where });

		// Fetch charities with pagination
		const charities = await prismaClient.charity.findMany({
			where,
			include: {
				project_owner: {
					select: {
						user_id: true,
						wallet_address: true,
						user_name: true,
					},
				},
			},
			orderBy: {
				charity_id: "desc",
			},
			skip: (page - 1) * limit,
			take: limit,
		});

		console.log("=== Query Results ===");
		console.log(`Found ${charities.length} charities`);

		return new NextResponse(
			JSON.stringify({
				success: true,
				data: {
					charities,
					pagination: {
						total,
						page,
						limit,
						totalPages: Math.ceil(total / limit),
					},
				},
			}),
			{ status: 200, headers }
		);
	} catch (error) {
		console.error("=== Error in Charity Fetch API ===");
		console.error(
			"Error type:",
			error instanceof Error ? error.constructor.name : typeof error
		);
		console.error(
			"Error message:",
			error instanceof Error ? error.message : String(error)
		);
		console.error(
			"Error stack:",
			error instanceof Error ? error.stack : undefined
		);

		return new NextResponse(
			JSON.stringify({
				success: false,
				error: "Failed to fetch charities",
				details: error instanceof Error ? error.message : String(error),
			}),
			{ status: 500, headers }
		);
	} finally {
		console.log("=== Charity Fetch API Call Ended ===");
	}
}
