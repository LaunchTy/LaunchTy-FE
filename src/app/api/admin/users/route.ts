import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const search = searchParams.get("search") || "";

		// Build where clause for search
		const where: any = {};
		if (search) {
			where.OR = [
				{ wallet_address: { contains: search, mode: "insensitive" } },
				{ user_name: { contains: search, mode: "insensitive" } },
			];
		}

		// Calculate pagination
		const skip = (page - 1) * limit;

		// Get users with pagination
		const users = await prismaClient.user.findMany({
			where,
			select: {
				user_id: true,
				wallet_address: true,
				user_name: true,
				create_date: true,
				_count: {
					select: {
						charities_as_owner: true,
						deposits: true,
						donations: true,
						launchpads: true,
					},
				},
			},
			orderBy: {
				create_date: "desc",
			},
			skip,
			take: limit,
		});

		// Get total count for pagination
		const totalUsers = await prismaClient.user.count({ where });

		// Format the response
		const formattedUsers = users.map((user) => ({
			user_id: user.user_id,
			wallet_address: user.wallet_address || "N/A",
			user_name: user.user_name,
			create_date: user.create_date.toISOString(),
			charity_count: user._count.charities_as_owner,
			deposit_count: user._count.deposits,
			donation_count: user._count.donations,
			launchpad_count: user._count.launchpads,
		}));

		return NextResponse.json({
			success: true,
			data: {
				users: formattedUsers,
				pagination: {
					currentPage: page,
					totalPages: Math.ceil(totalUsers / limit),
					totalUsers,
					hasNextPage: page * limit < totalUsers,
					hasPrevPage: page > 1,
				},
			},
		});
	} catch (error) {
		console.error("Error fetching users:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch users" },
			{ status: 500 }
		);
	}
}
