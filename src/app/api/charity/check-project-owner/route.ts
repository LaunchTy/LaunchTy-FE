import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function POST(req: NextRequest) {
	try {
		const { charity_id, wallet_address } = await req.json();

		if (!charity_id || !wallet_address) {
			return NextResponse.json(
				{ success: false, message: "Missing parameters" },
				{ status: 400 }
			);
		}

		const charity = await prismaClient.charity.findUnique({
			where: { charity_id },
			include: {
				project_owner: true,
			},
		});

		if (!charity) {
			return NextResponse.json(
				{ success: false, message: "Charity not found" },
				{ status: 404 }
			);
		}

		const isOwner =
			charity.project_owner?.wallet_address === wallet_address;

		return NextResponse.json({ success: true, isOwner });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, message: "Server error" },
			{ status: 500 }
		);
	}
}
