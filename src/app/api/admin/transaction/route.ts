// /app/api/admin/load-transactions/route.ts

import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const deposits = await prismaClient.deposit.findMany({
			select: {
				tx_hash: true,
				amount: true,
				datetime: true,
				launchpad: {
					select: {
						launchpad_name: true,
					},
				},
			},
			orderBy: {
				datetime: "desc",
			},
		});

		const donations = await prismaClient.donation.findMany({
			select: {
				tx_hash: true,
				amount: true,
				datetime: true,
				charity: {
					select: {
						charity_name: true,
					},
				},
			},
			orderBy: {
				datetime: "desc",
			},
		});

		return NextResponse.json(
			{ success: true, deposits, donations },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error loading transactions:", error);
		return NextResponse.json(
			{ success: false, message: "Server error" },
			{ status: 500 }
		);
	}
}
