import { NextRequest, NextResponse } from 'next/server'
import prismaClient from '@/prisma'

export async function POST(req: NextRequest) {
	console.log('=== Evidence Creation API Call Started ===')

	try {
		const body = await req.json()
		const { evidence_images, charity_id } = body

		console.log('Received evidence data:', {
			charity_id,
			evidence_images: Array.isArray(evidence_images)
				? `${evidence_images.length} images`
				: 'Not array',
		})

		if (!evidence_images || !charity_id) {
			const missingFields = []
			if (!evidence_images) missingFields.push('Evidence Images')
			if (!charity_id) missingFields.push('Charity ID')

			return NextResponse.json(
				{
					success: false,
					error: `Missing required fields: ${missingFields.join(', ')}`,
				},
				{ status: 400 }
			)
		}

		// Check if charity exists
		const existingCharity = await prismaClient.charity.findUnique({
			where: { charity_id },
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

		// Ensure evidence_images is properly formatted as array
		const evidenceImagesArray = Array.isArray(evidence_images)
			? (evidence_images as string[])
			: [evidence_images]

		// Create evidence entry with pending status
		const evidence = await prismaClient.evidence.create({
			data: {
				evidence_images: evidenceImagesArray,
				charity_id,
				status: 'pending', // Default status for admin approval
			},
		})

		console.log('Evidence created successfully:', evidence.evidence_id)

		return NextResponse.json(
			{ success: true, data: evidence },
			{ status: 201 }
		)
	} catch (error) {
		console.error('Error creating evidence:', error)
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
						: 'Failed to create evidence',
			},
			{ status: 500 }
		)
	} finally {
		console.log('=== Evidence Creation API Call Ended ===')
	}
} 