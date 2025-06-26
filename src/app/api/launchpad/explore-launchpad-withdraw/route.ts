import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
	try {
		const { wallet_address } = await request.json();

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
				launchpad: true,
			},
		});

		// Gộp deposits theo launchpad_id
		const projectMap = new Map<string, any>();

		for (const d of deposits) {
			const id = d.launchpad.launchpad_id;
			const existing = projectMap.get(id);

			if (existing) {
				existing.price += Number(d.amount); // cộng dồn amount
			} else {
				projectMap.set(id, {
					launchpad_id: id,
					launchpad_name: d.launchpad.launchpad_name,
					launchpad_logo: d.launchpad.launchpad_logo,
					launchpad_token: d.launchpad.launchpad_token,
					launchpad_img: d.launchpad.launchpad_img,
					launchpad_start_date:
						d.launchpad.launchpad_start_date?.toISOString() || null,
					launchpad_end_date:
						d.launchpad.launchpad_end_date?.toISOString() || null,
					price: Number(d.amount),
					min_stake: d.launchpad.min_stake?.toString() || "0",
					max_stake: d.launchpad.max_stake?.toString() || "0",
					soft_cap: d.launchpad.soft_cap?.toString() || "0",
				});
			}
		}

		const projects = Array.from(projectMap.values());

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
