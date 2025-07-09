import prismaClient from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const total = await prismaClient.launchpad.count();

		const statusOrder = ["pending", "approve", "deny", "publish"];

		const byStatus = await prismaClient.launchpad.groupBy({
			by: ["status"],
			_count: { status: true },
		});

		// Map to fixed order and fill missing statuses with 0
		const statusCountMap = Object.fromEntries(
			byStatus.map((item) => [item.status, item._count.status])
		);

		const series = statusOrder.map((status) => statusCountMap[status] || 0);
		const labels = statusOrder;

		return NextResponse.json({
			total,
			series,
			labels,
		});
	} catch (error) {
		console.error("Error fetching launchpad chart data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch launchpad chart data" },
			{ status: 500 }
		);
	}
}
