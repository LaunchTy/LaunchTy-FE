import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function GET(
  request: Request,
  { params }: { params: { 'charity-id': string } }
) {
  try {
    const donations = await prismaClient.donation.findMany({
      where: {
        charity_id: params['charity-id']
      },
      include: {
        user: {
          select: {
            user_name: true,
            wallet_address: true
          }
        }
      },
      orderBy: {
        datetime: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: donations
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
} 