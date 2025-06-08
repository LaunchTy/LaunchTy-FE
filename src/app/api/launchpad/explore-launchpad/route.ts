import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function GET() {
	try {
		const launchpads = await prismaClient.launchpad.findMany();

		const deposits = await prismaClient.deposit.findMany({
			select: {
				amount: true,
				launchpad_id: true,
			},
		});

		// Gom tổng deposit theo launchpad_id
		const depositMap = new Map<string, number>();
		for (const d of deposits) {
			const id = d.launchpad_id;
			const current = depositMap.get(id) || 0;
			depositMap.set(id, current + Number(d.amount));
		}

		const projects = launchpads.map((lp) => {
			return {
				...lp,
				launchpad_start_date:
					lp.launchpad_start_date?.toISOString() || null,
				launchpad_end_date:
					lp.launchpad_end_date?.toISOString() || null,
				min_stake: lp.min_stake?.toString() || "0",
				max_stake: lp.max_stake?.toString() || "0",
				soft_cap: lp.soft_cap?.toString() || "0",
				price: depositMap.get(lp.launchpad_id) || 0,
			};
		});

		return NextResponse.json(
			{ success: true, data: projects },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching launchpads:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
