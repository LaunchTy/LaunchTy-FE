import { NextRequest, NextResponse } from 'next/server'
import prismaClient from '@/prisma'

export async function POST(req: NextRequest) {
	console.log('=== Admin Evidence Action API Call Started ===')

	try {
		const body = await req.json()
		const { evidence_id, action } = body

		console.log('Received action data:', {
			evidence_id,
			action,
		})

		if (!evidence_id || !['approve', 'deny'].includes(action)) {
			return NextResponse.json(
				{
					success: false,
					error: 'Invalid data. Evidence ID and action (approve/deny) are required.',
				},
				{ status: 400 }
			)
		}

		// Check if evidence exists
		const existingEvidence = await prismaClient.evidence.findUnique({
			where: { evidence_id },
			include: { charity: true },
		})

		if (!existingEvidence) {
			return NextResponse.json(
				{
					success: false,
					error: 'Evidence not found with given ID.',
				},
				{ status: 404 }
			)
		}

		// Update evidence status
		const updatedEvidence = await prismaClient.evidence.update({
			where: { evidence_id },
			data: { status: action },
		})

		// If approved, add the evidence images to the charity's evidence array
		if (action === 'approve') {
			const currentCharityEvidence = existingEvidence.charity.evidence || []
			const updatedCharityEvidence = [
				...currentCharityEvidence,
				...existingEvidence.evidence_images,
			]

			await prismaClient.charity.update({
				where: { charity_id: existingEvidence.charity_id },
				data: { evidence: updatedCharityEvidence },
			})

			console.log(
				`Evidence approved and added to charity ${existingEvidence.charity_id}`
			)
		}

		console.log(`Evidence ${evidence_id} ${action} successfully`)

		return NextResponse.json({
			success: true,
			message: `Evidence ${action} successfully`,
			data: updatedEvidence,
		})
	} catch (error) {
		console.error('Error updating evidence:', error)
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
						: 'Failed to update evidence',
			},
			{ status: 500 }
		)
	} finally {
		console.log('=== Admin Evidence Action API Call Ended ===')
	}
} 