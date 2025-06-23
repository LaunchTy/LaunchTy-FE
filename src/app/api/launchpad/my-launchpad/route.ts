import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function POST(request: Request) {
	try {
		// const { searchParams } = new URL(request.url);
		// const projectOwnerId = searchParams.get("project_owner_id");

		const body = await request.json();
		const { wallet_address } = body;

		if (!wallet_address) {
			return NextResponse.json(
				{ success: false, error: "Missing wallet_address" },
				{ status: 400 }
			);
		}

		const user = await prismaClient.user.findUnique({
			where: {
				wallet_address: wallet_address,
			},
		});

		if (user === null) {
			return NextResponse.json(
				{ success: false, error: "User not found" },
				{ status: 404 }
			);
		}

		const projects = await prismaClient.launchpad.findMany({
			where: {
				project_owner_id: user.user_id,
			},
			orderBy: {
				launchpad_start_date: "desc",
			},
			include: {
				deposits: {
					select: {
						amount: true,
					},
				},
			},
		});
		console.log("Fetched projects:", projects);

		const formattedProjects = projects.map((project) => {
			const totalInvest = project.deposits.reduce(
				(sum, deposit) => sum + deposit.amount,
				0
			);

			return {
				launchpad_id: project.launchpad_id,
				launchpad_name: project.launchpad_name,
				token_address: project.token_address,
				total_supply: project.total_supply,
				max_stake: project.max_stake,
				min_stake: project.min_stake,
				soft_cap: project.soft_cap,
				hard_cap: project.hard_cap,
				launchpad_logo: project.launchpad_logo,
				launchpad_token: project.launchpad_token,
				launchpad_short_des: project.launchpad_short_des,
				totalInvest,
				launchpad_start_date: new Date(
					project.launchpad_start_date
				).toISOString(),
				launchpad_end_date: new Date(
					project.launchpad_end_date
				).toISOString(),
				status_launchpad: project.status,
			};
		});
		console.log("Formatted projects:", formattedProjects);
		return NextResponse.json(
			{ success: true, data: formattedProjects },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching projects:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
