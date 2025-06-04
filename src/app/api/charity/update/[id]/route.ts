import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      charity_name,
      charity_short_des,
      charity_long_des,
      charity_start_date,
      charity_end_date,
      charity_goal,
      charity_image,
      owner_id,
      representative_id
    } = body;

    const charity = await prismaClient.charity.update({
      where: {
        charity_id: params.id
      },
      data: {
        ...(charity_name && { charity_name }),
        ...(charity_short_des && { charity_short_des }),
        ...(charity_long_des && { charity_long_des }),
        ...(charity_start_date && { charity_start_date: new Date(charity_start_date) }),
        ...(charity_end_date && { charity_end_date: new Date(charity_end_date) }),
        ...(charity_goal && { charity_goal }),
        ...(charity_image && { charity_image }),
        ...(owner_id && {
          owner: {
            connect: { user_id: owner_id }
          }
        }),
        ...(representative_id && {
          representative: {
            connect: { user_id: representative_id }
          }
        })
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

    return NextResponse.json({ success: true, data: charity });
  } catch (error) {
    console.error("Error updating charity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update charity" },
      { status: 500 }
    );
  }
} 