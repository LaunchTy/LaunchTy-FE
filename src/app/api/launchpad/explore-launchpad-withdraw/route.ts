import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function POST(request: Request) {
	try {
		const { wallet_address } = await request.json();
		console.log("Received wallet address:", wallet_address);

		if (!wallet_address) {
			return NextResponse.json(
				{ success: false, error: "Missing wallet address" },
				{ status: 400 }
			);
		}

		const user = await prismaClient.user.findUnique({
			where: { wallet_address },
			select: { user_id: true },
		});

		if (!user) {
			return NextResponse.json(
				{ success: false, error: "User not found" },
				{ status: 404 }
			);
		}

		const deposits = await prismaClient.deposit.findMany({
			where: { user_id: user.user_id },
			select: {
				amount: true,
				launchpad: {
					select: {
						launchpad_id: true,
						launchpad_name: true,
						launchpad_logo: true,
						launchpad_token: true,
						launchpad_end_date: true,
						launchpad_start_date: true,
						min_stake: true,
						max_stake: true,
						soft_cap: true,
					},
				},
			},
			orderBy: {
				datetime: "desc",
			},
		});

		// Tính tổng amount per project
		const projectMap = new Map();

		for (const d of deposits) {
			const id = d.launchpad.launchpad_id;
			const existing = projectMap.get(id);

			if (existing) {
				existing.price += Number(d.amount);
			} else {
				projectMap.set(id, {
					id,
					title: d.launchpad.launchpad_name,
					image: d.launchpad.launchpad_logo,
					tokenSymbol: d.launchpad.launchpad_token,
					endTime:
						d.launchpad.launchpad_end_date?.toISOString() || null,
					launchpad_start_date:
						d.launchpad.launchpad_start_date?.toISOString() || null,
					launchpad_end_date:
						d.launchpad.launchpad_end_date?.toISOString() || null,
					price: Number(d.amount),
					min: d.launchpad.min_stake?.toString() || "0",
					max: d.launchpad.max_stake?.toString() || "0",
					raiseGoal: d.launchpad.soft_cap?.toString() || "0",
				});
			}
		}

		const projects = Array.from(projectMap.values());

		return NextResponse.json(
			{ success: true, data: projects },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching deposited projects:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
