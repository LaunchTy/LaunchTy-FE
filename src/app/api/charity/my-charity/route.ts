import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const wallet_address = searchParams.get("wallet_address");

		if (!wallet_address) {
			return NextResponse.json(
				{ success: false, error: "Wallet address is required" },
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

		const charities = await prismaClient.charity.findMany({
			where: {
				project_owner_id: user.user_id,
			},
			include: {
				donations: true,
				project_owner: {
					select: {
						user_id: true,
						wallet_address: true,
						user_name: true,
					},
				},
			},
			orderBy: {
				charity_end_date: "desc",
			},
		});

		// Calculate total donation amount for each charity
		const charitiesWithTotal = charities.map((charity) => ({
			...charity,
			totalDonationAmount: charity.donations.reduce(
				(sum, donation) => sum + donation.amount,
				0
			),
		}));

		return NextResponse.json(
			{ success: true, data: charitiesWithTotal },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching charities:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch charities" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { wallet_address } = body;

		if (!wallet_address) {
			return NextResponse.json(
				{ success: false, error: "Wallet address is required" },
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

		const charities = await prismaClient.charity.findMany({
			where: {
				project_owner_id: user.user_id,
			},
			include: {
				donations: true,
				project_owner: {
					select: {
						user_id: true,
						wallet_address: true,
						user_name: true,
					},
				},
			},
			orderBy: {
				charity_end_date: "desc",
			},
		});

		// Calculate total donation amount for each charity
		const charitiesWithTotal = charities.map((charity) => ({
			...charity,
			totalDonationAmount: charity.donations.reduce(
				(sum, donation) => sum + donation.amount,
				0
			),
		}));

		return NextResponse.json(
			{ success: true, data: charitiesWithTotal },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching charities:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch charities" },
			{ status: 500 }
		);
	}
}
