import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";

export async function POST(req: NextRequest) {
  console.log("=== Charity Creation API Call Started ===");
  console.log("Request headers:", Object.fromEntries(req.headers.entries()));
  
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

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

    // Validate required fields
    if (!charity_name || !charity_short_des || !charity_long_des || !charity_start_date || !charity_end_date || !charity_goal || !owner_id) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const charity = await prismaClient.charity.create({
      data: {
        charity_name,
        charity_short_des,
        charity_long_des,
        charity_start_date: new Date(charity_start_date),
        charity_end_date: new Date(charity_end_date),
        charity_goal,
        charity_image,
        owner: {
          connect: { user_id: owner_id }
        },
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

    return NextResponse.json({ success: true, data: charity }, { status: 201 });
  } catch (error) {
    console.error("Error creating charity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create charity" },
      { status: 500 }
    );
  } finally {
    console.log("=== Charity Creation API Call Ended ===");
  }
}
