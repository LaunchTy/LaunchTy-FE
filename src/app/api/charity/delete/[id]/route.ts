import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await prismaClient.charity.delete({
			where: {
				charity_id: params.id,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Charity deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting charity:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to delete charity" },
			{ status: 500 }
		);
	}
}
