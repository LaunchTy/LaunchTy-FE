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
				id: project.launchpad_id,
				title: project.launchpad_name,
				image: project.launchpad_logo,
				tokenSymbol: project.launchpad_token,
				// totalInvest,
				endTime: new Date(project.launchpad_end_date).toISOString(),
			};
		});

		return NextResponse.json(
			{ success: true, data: projects },
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
