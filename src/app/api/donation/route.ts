import { NextRequest, NextResponse } from 'next/server'
import prismaClient from '@/prisma'

const prisma = prismaClient

// GET all donations
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const charity_id = searchParams.get('charity_id')

		if (!charity_id) {
			return NextResponse.json(
				{
					success: false,
					error: 'charity_id is required',
				},
				{ status: 400 }
			)
		}

		const donations = await prisma.donation.findMany({
			where: {
				charity_id: charity_id,
			},
			include: {
				user: true,
				charity: true,
			},
			orderBy: {
				datetime: 'desc',
			},
		})

		return NextResponse.json(
			{
				success: true,
				data: donations,
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error fetching donations:', error)
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to fetch donations',
			},
			{ status: 500 }
		)
	}
}

// POST new donation
export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { charity_id, wallet_address, amount, tx_hash, datetime } = body

		// Validate required fields
		if (!charity_id || !wallet_address || !amount || !tx_hash) {
			return NextResponse.json(
				{
					success: false,
					error: 'Missing required fields: charity_id, wallet_address, amount, tx_hash',
				},
				{ status: 400 }
			)
		}

		// Check if charity exists
		const charity = await prisma.charity.findUnique({
			where: { charity_id: charity_id },
		})

		if (!charity) {
			return NextResponse.json(
				{
					success: false,
					error: 'Charity not found',
				},
				{ status: 404 }
			)
		}

		// Check if user exists, if not create one
		let user = await prisma.user.findUnique({
			where: { wallet_address: wallet_address },
		})

		if (!user) {
			user = await prisma.user.create({
				data: {
					wallet_address: wallet_address,
					user_name: `User_${wallet_address.slice(0, 8)}`,
				},
			})
		}

		// Create donation record
		const donation = await prisma.donation.create({
			data: {
				charity_id: charity_id,
				user_id: user.user_id,
				amount: amount,
				tx_hash: tx_hash,
				datetime: datetime || new Date().toISOString(),
			},
			include: {
				user: true,
				charity: true,
			},
		})

		return NextResponse.json(
			{
				success: true,
				message: 'Donation recorded successfully',
				data: donation,
			},
			{ status: 201 }
		)
	} catch (error) {
		console.error('Error creating donation:', error)
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to record donation',
			},
			{ status: 500 }
		)
	}
}

// PUT update donation
export async function PUT(request: Request) {
	try {
		const body = await request.json();
		const { donate_id, amount, tx_hash, user_id, charity_id } = body;

		if (!donate_id) {
			return NextResponse.json(
				{ error: "Donation ID is required" },
				{ status: 400 }
			);
		}

		const updatedDonation = await prisma.donation.update({
			where: {
				donate_id: donate_id,
			},
			data: {
				amount,
				tx_hash,
				user_id,
				charity_id,
			},
			include: {
				user: true,
				charity: true,
			},
		});

		return NextResponse.json(updatedDonation);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to update donation" },
			{ status: 500 }
		);
	}
}

// DELETE donation
export async function DELETE(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const donate_id = searchParams.get("donate_id");

		if (!donate_id) {
			return NextResponse.json(
				{ error: "Donation ID is required" },
				{ status: 400 }
			);
		}

		await prisma.donation.delete({
			where: {
				donate_id: donate_id,
			},
		});

		return NextResponse.json({ message: "Donation deleted successfully" });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to delete donation" },
			{ status: 500 }
		);
	}
}
