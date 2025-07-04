import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		// Get launchpad statistics
		const launchpadStats = await prismaClient.launchpad.groupBy({
			by: ['status'],
			_count: {
				status: true
			}
		});

		// Get charity statistics
		const charityStats = await prismaClient.charity.groupBy({
			by: ['status'],
			_count: {
				status: true
			}
		});

		// Get user statistics
		const totalUsers = await prismaClient.user.count();
		
		// Get users who have created launchpads
		const launchpadUsers = await prismaClient.user.count({
			where: {
				launchpads: {
					some: {}
				}
			}
		});

		// Get users who have created charities
		const charityUsers = await prismaClient.user.count({
			where: {
				charities_as_owner: {
					some: {}
				}
			}
		});

		// Format launchpad statistics
		const launchpadCounts = {
			pending: 0,
			approved: 0,
			denied: 0,
			total: 0
		};

		launchpadStats.forEach(stat => {
			if (stat.status === 'pending') launchpadCounts.pending = stat._count.status;
			else if (stat.status === 'publish') launchpadCounts.approved = stat._count.status;
			else if (stat.status === 'denied') launchpadCounts.denied = stat._count.status;
			launchpadCounts.total += stat._count.status;
		});

		// Format charity statistics
		const charityCounts = {
			pending: 0,
			approved: 0,
			denied: 0,
			total: 0
		};

		charityStats.forEach(stat => {
			if (stat.status === 'pending') charityCounts.pending = stat._count.status;
			else if (stat.status === 'publish') charityCounts.approved = stat._count.status;
			else if (stat.status === 'denied') charityCounts.denied = stat._count.status;
			charityCounts.total += stat._count.status;
		});

		return NextResponse.json({
			success: true,
			data: {
				launchpads: launchpadCounts,
				charities: charityCounts,
				users: {
					total: totalUsers,
					launchpadUsers: launchpadUsers,
					charityUsers: charityUsers
				}
			}
		});
	} catch (error) {
		console.error("Error fetching dashboard statistics:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch statistics" },
			{ status: 500 }
		);
	}
} 