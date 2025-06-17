import { NextResponse } from 'next/server'
import prismaClient from '@/prisma'

const prisma = prismaClient

export async function POST(request: Request) {
	try {
		const { wallet_address } = await request.json()

		if (!wallet_address) {
			return NextResponse.json(
				{ message: 'Wallet address is required' },
				{ status: 400 }
			)
		}

		// First get the user_id from wallet_address
		const user = await prisma.user.findUnique({
			where: {
				wallet_address: wallet_address,
			},
		})

		if (!user) {
			return NextResponse.json(
				{ message: 'User not found' },
				{ status: 404 }
			)
		}

		// Get all donations with charity details for this user
		const donations = await prisma.donation.findMany({
			where: {
				user_id: user.user_id,
			},
			include: {
				charity: {
					include: {
						donations: true
					}
				},
			},
			orderBy: {
				datetime: 'desc',
			},
		})

		// Transform the data to include status based on dates
		const transformedDonations = donations.map((donation) => {
			const now = new Date()
			const startDate = new Date(donation.charity.charity_start_date)
			const endDate = new Date(donation.charity.charity_end_date)

			let status: 'upcoming' | 'ongoing' | 'finished' = 'finished'
			if (now < startDate) status = 'upcoming'
			else if (now >= startDate && now <= endDate) status = 'ongoing'

			// Calculate total donation amount for this charity
			const totalDonationAmount = donation.charity.donations.reduce(
				(sum, d) => sum + d.amount,
				0
			)

			return {
				charity_id: donation.charity.charity_id,
				charity_name: donation.charity.charity_name,
				charity_short_des: donation.charity.charity_short_des,
				charity_logo: donation.charity.charity_logo,
				charity_token_symbol: donation.charity.charity_token_symbol,
				donation_amount: donation.amount,
				donation_date: donation.datetime,
				charity_start_date: donation.charity.charity_start_date,
				charity_end_date: donation.charity.charity_end_date,
				status: status,
				tx_hash: donation.tx_hash,
				total_donation_amount: totalDonationAmount
			}
		})

		return NextResponse.json(
			{
				message: 'Donations fetched successfully',
				data: transformedDonations,
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error fetching donations:', error)
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		)
	}
} 