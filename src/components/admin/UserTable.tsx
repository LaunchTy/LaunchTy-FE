'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface User {
	user_id: string
	wallet_address: string
	user_name: string
	create_date: string
	charity_count: number
	deposit_count: number
	donation_count: number
	launchpad_count: number
}

interface Pagination {
	currentPage: number
	totalPages: number
	totalUsers: number
	hasNextPage: boolean
	hasPrevPage: boolean
}

const UserTable: React.FC = () => {
	const [users, setUsers] = useState<User[]>([])
	const [pagination, setPagination] = useState<Pagination | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
	const usersPerPage = 10

	const fetchUsers = async (page: number = 1) => {
		setLoading(true)
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: usersPerPage.toString(),
			})

			const response = await axios.get(`/api/admin/users?${params}`)
			if (response.data.success) {
				setUsers(response.data.data.users)
				setPagination(response.data.data.pagination)
			}
		} catch (error) {
			console.error('Error fetching users:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchUsers(currentPage)
	}, [currentPage])

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage)
	}

	const copyToClipboard = async (address: string) => {
		try {
			await navigator.clipboard.writeText(address)
			setCopiedAddress(address)
			setTimeout(() => setCopiedAddress(null), 2000)
		} catch (error) {
			console.error('Failed to copy address:', error)
		}
	}

	const truncateAddress = (address: string) => {
		if (address === 'N/A') return address
		return `${address.slice(0, 6)}...${address.slice(-4)}`
	}

	if (loading) {
		return (
			<div className="flex justify-center items-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
			</div>
		)
	}

	return (
		<div className="flex flex-col w-full px-6 pb-6">
			<div className="overflow-x-auto overflow-hidden rounded-lg">
				<div className="min-w-full overflow-hidden">
					<table className="w-full text-white text-sm">
						<thead>
							<tr className="border-b border-gray-600">
								<th className="text-center py-3 px-2 font-semibold">
									Wallet Address
								</th>
							</tr>
						</thead>
						<tbody>
							<AnimatePresence mode="wait">
								{users.map((user, index) => (
									<motion.tr
										key={`${currentPage}-${index}`}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{
											duration: 0.4,
											delay: index * 0.02,
											ease: 'easeOut',
										}}
										className="border-b border-gray-700"
										whileHover={{
											backgroundColor: 'rgba(147, 51, 234, 0.4)',
											transition: { duration: 0 },
										}}
									>
										<td className="py-3 px-2">
											<div className="flex items-center justify-center gap-2">
												<span className="font-mono text-xs">
													{/* {truncateAddress(user.wallet_address)} */}
													{user.wallet_address === 'N/A'
														? 'N/A'
														: user.wallet_address}
												</span>
												{user.wallet_address !== 'N/A' && (
													<motion.button
														whileHover={{ scale: 1.1 }}
														whileTap={{ scale: 0.95 }}
														onClick={() => copyToClipboard(user.wallet_address)}
														className="p-1 hover:bg-gray-700 rounded transition-colors"
														title="Copy address"
													>
														{copiedAddress === user.wallet_address ? (
															<Check className="w-3 h-3 text-green-500" />
														) : (
															<Copy className="w-3 h-3 text-gray-400" />
														)}
													</motion.button>
												)}
											</div>
										</td>
									</motion.tr>
								))}
							</AnimatePresence>
							{users.length === 0 && (
								<motion.tr
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.5 }}
								>
									<td colSpan={1} className="text-center py-6 text-gray-400">
										No users found
									</td>
								</motion.tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Pagination */}
			{pagination && pagination.totalPages > 1 && (
				<motion.div
					className="flex overflow-hidden items-center justify-between mt-4 px-2"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.5 }}
				>
					<div className="text-sm text-gray-400">
						Showing {(pagination.currentPage - 1) * usersPerPage + 1} to{' '}
						{Math.min(
							pagination.currentPage * usersPerPage,
							pagination.totalUsers
						)}{' '}
						of {pagination.totalUsers} users
					</div>
					<div className="flex items-center justify-center gap-2 p-4">
						{/* Previous Button */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => handlePageChange(pagination.currentPage - 1)}
							disabled={!pagination.hasPrevPage}
							className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
							style={{
								background: !pagination.hasPrevPage
									? 'linear-gradient(135deg, #6B7280, #9CA3AF)'
									: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
							}}
						>
							<ChevronLeft className="w-4 h-4" />
							<span className="hidden sm:inline">Previous</span>
						</motion.button>

						{/* Page Numbers */}
						<div className="flex items-center gap-1">
							{Array.from(
								{ length: pagination.totalPages },
								(_, i) => i + 1
							).map((page) => {
								const isActive = page === pagination.currentPage
								const isNearActive =
									Math.abs(page - pagination.currentPage) <= 2
								const isFirstOrLast =
									page === 1 || page === pagination.totalPages

								// Show ellipsis for pages that are far from current page
								if (
									!isNearActive &&
									!isFirstOrLast &&
									pagination.totalPages > 7
								) {
									if (page === 2 && pagination.currentPage > 4) {
										return (
											<span key={page} className="px-2 py-2 text-gray-400">
												...
											</span>
										)
									}
									if (
										page === pagination.totalPages - 1 &&
										pagination.currentPage < pagination.totalPages - 3
									) {
										return (
											<span key={page} className="px-2 py-2 text-gray-400">
												...
											</span>
										)
									}
									if (page !== 2 && page !== pagination.totalPages - 1) {
										return null
									}
								}

								return (
									<motion.button
										key={page}
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.95 }}
										transition={{
											duration: 0.2,
											delay: page * 0.05,
										}}
										onClick={() => handlePageChange(page)}
										className={`min-w-[40px] h-10 rounded-lg font-medium transition-all duration-300 transform shadow-md hover:shadow-lg ${
											isActive
												? 'text-white scale-110 shadow-lg ring-2 ring-white ring-opacity-50'
												: 'text-gray-100 hover:text-white border border-gray-500 hover:border-transparent bg-gray-800/50 hover:bg-transparent'
										}`}
										style={{
											background: isActive
												? 'linear-gradient(135deg, #A855F7, #3B82F6)'
												: undefined,
										}}
										onMouseEnter={(e) => {
											if (!isActive) {
												e.currentTarget.style.background =
													'linear-gradient(135deg, #A855F7, #3B82F6)'
											}
										}}
										onMouseLeave={(e) => {
											if (!isActive) {
												e.currentTarget.style.background =
													'rgba(31, 41, 55, 0.5)'
											}
										}}
									>
										{page}
									</motion.button>
								)
							})}
						</div>

						{/* Next Button */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => handlePageChange(pagination.currentPage + 1)}
							disabled={!pagination.hasNextPage}
							className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
							style={{
								background: !pagination.hasNextPage
									? 'linear-gradient(135deg, #6B7280, #9CA3AF)'
									: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
							}}
						>
							<span className="hidden sm:inline">Next</span>
							<ChevronRight className="w-4 h-4" />
						</motion.button>
					</div>
				</motion.div>
			)}
		</div>
	)
}

export default UserTable
