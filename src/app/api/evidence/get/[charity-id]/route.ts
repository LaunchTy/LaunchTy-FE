import { NextRequest, NextResponse } from 'next/server'
import prismaClient from '@/prisma'

export async function GET(
	req: NextRequest,
	{ params }: { params: { 'charity-id': string } }
) {
	console.log('=== Evidence Get API Call Started ===')
	console.log('Charity ID:', params['charity-id'])

	try {
		const charityId = params['charity-id']

		if (!charityId) {
			return NextResponse.json(
				{
					success: false,
					error: 'Charity ID is required',
				},
				{ status: 400 }
			)
		}

		// Check if charity exists
		const existingCharity = await prismaClient.charity.findUnique({
			where: { charity_id: charityId },
		})

		if (!existingCharity) {
			return NextResponse.json(
				{
					success: false,
					error: 'Charity not found with given ID.',
				},
				{ status: 404 }
			)
		}

		// Get all evidence entries for this charity
		const evidence = await prismaClient.evidence.findMany({
			where: { charity_id: charityId },
			orderBy: {
				evidence_id: 'desc',
			},
		})

		console.log(`Found ${evidence.length} evidence entries for charity ${charityId}`)

		return NextResponse.json(
			{ success: true, data: evidence },
			{ status: 200 }
		)
	} catch (error) {
		console.error('Error fetching evidence:', error)
		console.error('Error details:', {
			message: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : 'No stack trace',
		})
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: 'Failed to fetch evidence',
			},
			{ status: 500 }
		)
	} finally {
		console.log('=== Evidence Get API Call Ended ===')
	}
} 