// import { NextResponse } from "next/server";
// import prismaClient from "@/prisma";

// export async function POST(request: Request) {
// 	try {
// 		const { wallet_address } = await request.json();
// 		console.log("Received wallet address:", wallet_address);

// 		if (!wallet_address) {
// 			return NextResponse.json(
// 				{ success: false, error: "Missing wallet address" },
// 				{ status: 400 }
// 			);
// 		}

// 		const user = await prismaClient.user.findUnique({
// 			where: { wallet_address },
// 			select: { user_id: true },
// 		});

// 		if (!user) {
// 			return NextResponse.json(
// 				{ success: false, error: "User not found" },
// 				{ status: 404 }
// 			);
// 		}

// 		const deposits = await prismaClient.deposit.findMany({
// 			where: { user_id: user.user_id },
// 			select: {
// 				amount: true,
// 				launchpad: {
// 					select: {
// 						launchpad_id: true,
// 						launchpad_name: true,
// 						launchpad_logo: true,
// 						launchpad_token: true,
// 						launchpad_end_date: true,
// 						launchpad_start_date: true,
// 						min_stake: true,
// 						max_stake: true,
// 						soft_cap: true,
// 					},
// 				},
// 			},
// 			orderBy: {
// 				datetime: "desc",
// 			},
// 		});

// 		const projectMap = new Map();

// 		for (const d of deposits) {
// 			const id = d.launchpad.launchpad_id;
// 			const existing = projectMap.get(id);

// 			if (existing) {
// 				existing.price += Number(d.amount);
// 			} else {
// 				projectMap.set(id, {
// 					id,
// 					launchpad_name: d.launchpad.launchpad_name,
// 					launchpad_logo: d.launchpad.launchpad_logo,
// 					launchpad_token: d.launchpad.launchpad_token,

// 					launchpad_start_date:
// 						d.launchpad.launchpad_start_date?.toISOString() || null,
// 					launchpad_end_date:
// 						d.launchpad.launchpad_end_date?.toISOString() || null,
// 					price: Number(d.amount),
// 					min: d.launchpad.min_stake?.toString() || "0",
// 					max: d.launchpad.max_stake?.toString() || "0",
// 					raiseGoal: d.launchpad.soft_cap?.toString() || "0",
// 				});
// 			}
// 		}

// 		const projects = Array.from(projectMap.values());

// 		return NextResponse.json(
// 			{ success: true, data: projects },
// 			{ status: 200 }
// 		);
// 	} catch (error) {
// 		console.error("Error fetching deposited projects:", error);
// 		return NextResponse.json(
// 			{ success: false, error: "Internal Server Error" },
// 			{ status: 500 }
// 		);
// 	}
// }

import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

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
		// const launchpads = await prismaClient.launchpad.findMany();

		const deposits = await prismaClient.deposit.findMany({
			where: { user_id: user?.user_id },
			select: {
				amount: true,
				launchpad: true,
			},
		});

		// Gom tổng deposit theo launchpad_id
		const depositMap = new Map<string, number>();
		for (const dd of deposits) {
			const id = dd.launchpad.launchpad_id;
			const current = depositMap.get(id) || 0;
			depositMap.set(id, current + Number(dd.amount));
		}

		const projects = deposits.map((d) => {
			return {
				launchpad_id: d.launchpad.launchpad_id,
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
				soft_cap: d.launchpad.soft_cap,
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
