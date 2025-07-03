import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function GET() {
	try {
		const charitiesWithEvidence = await prismaClient.charity.findMany({
			where: {
				Evidence: {
					some: {
						status: "pending",
					},
				},
			},
			include: {
				Evidence: {
					where: {
						status: "pending",
					},
					select: {
						evidence_id: true,
						evidence_images: true, // cần để đếm số ảnh
					},
				},
			},
		});

		const formatted = charitiesWithEvidence.map((charity) => {
			const totalImages = charity.Evidence.reduce(
				(sum, ev) => sum + ev.evidence_images.length,
				0
			);

			return {
				id: charity.charity_id,
				title: charity.charity_name,
				image: charity.charity_logo,
				shortDescription: charity.charity_short_des,
				tokenSymbol: charity.charity_token_symbol,
				endTime: charity.charity_end_date.toISOString(),
				newEvidences: totalImages,
			};
		});

		return NextResponse.json({ projects: formatted });
	} catch (error) {
		console.error("Error loading evidences:", error);
		return NextResponse.json(
			{ error: "Failed to load evidence projects" },
			{ status: 500 }
		);
	}
}
