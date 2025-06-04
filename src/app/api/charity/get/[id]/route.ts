import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const charity = await prismaClient.charity.findUnique({
      where: {
        charity_id: params.id
      },
      include: {
        owner: {
          select: {
            user_id: true,
            wallet_address: true,
            username: true
          }
        },
        representative: {
          select: {
            user_id: true,
            wallet_address: true,
            username: true
          }
        }
      }
    });

    if (!charity) {
      return NextResponse.json(
        { success: false, error: "Charity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: charity });
  } catch (error) {
    console.error("Error fetching charity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch charity" },
      { status: 500 }
    );
  }
} 