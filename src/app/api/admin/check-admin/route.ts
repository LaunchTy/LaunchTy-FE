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

		const adminAddresses = [
			"0x0dB79A1EF3623586431DcE50a6173cf157550b21",
			"0x03eA53511cB61e3A3b7402BEdF494Bd74a322523",
			"0xB93B321b734812fE459F22e5bdE5d5F3b165D192",
			"0x8f07aDC031CF8e12fc66a01A12982fB543AEe86C",
		];
		const isAdmin = adminAddresses.some(
			(admin) => admin.toLowerCase() === address.toLowerCase()
		);

		return NextResponse.json({ success: true, isAdmin }, { status: 200 });
	} catch (err) {
		console.error("Error checking admin:", err);
		return NextResponse.json(
			{ success: false, isAdmin: false, message: "Server error" },
			{ status: 500 }
		);
	}
}
