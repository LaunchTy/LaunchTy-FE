import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

const prisma = prismaClient;

// GET all donations
export async function GET() {
	try {
		const donations = await prisma.donation.findMany({
			include: {
				user: true,
				charity: true,
			},
		});
		return NextResponse.json(donations);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch donations" },
			{ status: 500 }
		);
	}
}

// POST new donation
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { amount, tx_hash, user_id, charity_id } = body;

		// Validate required fields
		if (!amount || !user_id || !charity_id) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const donation = await prisma.donation.create({
			data: {
				amount,
				tx_hash,
				user_id,
				charity_id,
			},
			include: {
				user: true,
				charity: true,
			},
		});

		return NextResponse.json(donation, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to create donation" },
			{ status: 500 }
		);
	}
}

// PUT update donation
export async function PUT(request: Request) {
	try {
		const body = await request.json();
		const { donate_id, amount, tx_hash, user_id, charity_id } = body;

		if (!donate_id) {
			return NextResponse.json(
				{ error: "Donation ID is required" },
				{ status: 400 }
			);
		}

		const updatedDonation = await prisma.donation.update({
			where: {
				donate_id: donate_id,
			},
			data: {
				amount,
				tx_hash,
				user_id,
				charity_id,
			},
			include: {
				user: true,
				charity: true,
			},
		});

		return NextResponse.json(updatedDonation);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to update donation" },
			{ status: 500 }
		);
	}
}

// DELETE donation
export async function DELETE(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const donate_id = searchParams.get("donate_id");

		if (!donate_id) {
			return NextResponse.json(
				{ error: "Donation ID is required" },
				{ status: 400 }
			);
		}

		await prisma.donation.delete({
			where: {
				donate_id: donate_id,
			},
		});

		return NextResponse.json({ message: "Donation deleted successfully" });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to delete donation" },
			{ status: 500 }
		);
	}
}
