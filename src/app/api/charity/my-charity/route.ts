import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const project_owner_id = searchParams.get('project_owner_id');

    if (!project_owner_id) {
      return NextResponse.json(
        { success: false, error: "Project owner ID is required" },
        { status: 400 }
      );
    }

    const charities = await prismaClient.charity.findMany({
      where: {
        project_owner_id: project_owner_id
      },
      include: {
        donations: true,
        project_owner: {
          select: {
            user_id: true,
            wallet_address: true,
            user_name: true
          }
        }
      },
      orderBy: {
        charity_end_date: 'desc'
      }
    });

    // Calculate total donation amount for each charity
    const charitiesWithTotal = charities.map(charity => ({
      ...charity,
      totalDonationAmount: charity.donations.reduce((sum, donation) => sum + donation.amount, 0)
    }));

    return NextResponse.json(
      { success: true, data: charitiesWithTotal },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching charities:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch charities" },
      { status: 500 }
    );
  }
} 