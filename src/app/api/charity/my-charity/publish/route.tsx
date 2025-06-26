import { NextResponse } from 'next/server'
import prismaClient from '@/prisma'

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { wallet_address, charity_address, charity_id } = body

		console.log('Wallet address: ', wallet_address)
		console.log('charity ID: ', charity_id)
		console.log('Request body:', body)

		if (!wallet_address || !charity_id) {
			return NextResponse.json(
				{ success: false, error: 'Missing wallet_address or charity_id' },
				{ status: 400 }
			)
		}

		const user = await prismaClient.user.findUnique({
			where: {
				wallet_address,
			},
		})

		if (!user) {
			return NextResponse.json(
				{ success: false, error: 'User not found' },
				{ status: 404 }
			)
		}

		const charity = await prismaClient.charity.findFirst({
			where: {
				charity_id,
				project_owner_id: user.user_id,
				status: 'approve',
			},
		})

		if (!charity) {
			return NextResponse.json(
				{
					success: false,
					error: 'Charity not found or not in approved status',
				},
				{ status: 404 }
			)
		}

		const updated = await prismaClient.charity.update({
			where: {
				charity_id: charity_id,
			},
			data: {
				status: 'publish',
				charity_id: charity_address,
			},
		})

		return NextResponse.json(
			{
				success: true,
				message: 'Charity published successfully',
				project: updated,
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error publishing charity:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
