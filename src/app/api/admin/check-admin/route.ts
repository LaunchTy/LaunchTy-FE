// /app/api/admin/check-admin/route.ts
import { NextResponse } from "next/server";
import prismaClient from "@/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const address = searchParams.get("address");

		if (!address) {
			return NextResponse.json(
				{ success: false, isAdmin: false, message: "Missing address" },
				{ status: 400 }
			);
		}

		const adminAddress = "0x0dB79A1EF3623586431DcE50a6173cf157550b21"; // hardcode admin wallet
		const isAdmin = address.toLowerCase() === adminAddress.toLowerCase();

		return NextResponse.json({ success: true, isAdmin }, { status: 200 });
	} catch (err) {
		console.error("Error checking admin:", err);
		return NextResponse.json(
			{ success: false, isAdmin: false, message: "Server error" },
			{ status: 500 }
		);
	}
}
