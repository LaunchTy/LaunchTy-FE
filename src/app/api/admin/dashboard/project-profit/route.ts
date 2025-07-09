import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const launchpads = await prismaClient.launchpad.findMany({
			where: {
				deposits: {
					some: {},
				},
			},
			select: {
				launchpad_id: true,
				launchpad_name: true,
				launchpad_logo: true,
				launchpad_short_des: true,
				launchpad_token: true,
				launchpad_end_date: true,
				deposits: {
					select: {
						amount: true,
					},
				},
			},
			orderBy: {
				launchpad_end_date: "asc",
			},
		});

		const formatted = launchpads
			.map((lp) => {
				const totalInvestment = lp.deposits.reduce(
					(sum, d) => sum + d.amount,
					0
				);
				const profit = Number((totalInvestment * 0.1).toFixed(2)); // 10% lợi nhuận

				if (profit <= 0) return null;

				return {
					id: lp.launchpad_id,
					title: lp.launchpad_name,
					image: lp.launchpad_logo,
					shortDescription: lp.launchpad_short_des,
					tokenSymbol: lp.launchpad_token,
					endTime: lp.launchpad_end_date.toISOString(),
					profit,
				};
			})
			.filter(Boolean); // loại bỏ null

		return NextResponse.json({ projects: formatted });
	} catch (err) {
		console.error("Failed to fetch project profits:", err);
		return NextResponse.json(
			{ error: "Failed to load project data" },
			{ status: 500 }
		);
	}
}
