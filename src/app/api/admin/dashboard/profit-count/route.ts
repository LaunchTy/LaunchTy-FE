import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const result = await prismaClient.deposit.aggregate({
			_sum: {
				amount: true,
			},
		});

		const totalInvestment = result._sum.amount || 0;
		const totalProfit = Number((totalInvestment * 0.1).toFixed(2)); // 10% lợi nhuận

		return NextResponse.json({ totalProfit });
	} catch (err) {
		console.error("Failed to calculate total profit:", err);
		return NextResponse.json(
			{ error: "Failed to calculate total profit" },
			{ status: 500 }
		);
	}
}
