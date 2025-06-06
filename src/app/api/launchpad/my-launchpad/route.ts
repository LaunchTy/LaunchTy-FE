import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function GET(request: Request) {
	try {
		// Lấy URL từ request
		const { searchParams } = new URL(request.url);
		const projectOwnerId = searchParams.get("project_owner_id");
		// console.log("projectOwnerId:", projectOwnerId);

		if (!projectOwnerId) {
			return NextResponse.json(
				{ success: false, error: "Missing project_owner_id" },
				{ status: 400 }
			);
		}

		const projects = await prismaClient.launchpad.findMany({
			where: {
				project_owner_id: projectOwnerId,
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
