'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Transaction } from '@/interface/interface'

interface TransactionTableProps {
	transactionData: Transaction[]
	currentTransactionPage: number
	setCurrentTransactionPage: (page: number | ((prev: number) => number)) => void
	transactionsPerPage?: number
}

const TransactionTable: React.FC<TransactionTableProps> = ({
	transactionData,
	currentTransactionPage,
	setCurrentTransactionPage,
	transactionsPerPage = 10,
}) => {
	// Transaction pagination logic
	const totalTransactionPages = Math.ceil(
		transactionData.length / transactionsPerPage
	)
	const startTransactionIndex =
		(currentTransactionPage - 1) * transactionsPerPage
	const currentTransactions = transactionData.slice(
		startTransactionIndex,
		startTransactionIndex + transactionsPerPage
	)

	return (
		<div className="flex flex-col w-full px-6 pb-6">
			<div className="overflow-x-auto overflow-hidden rounded-lg">
				<div className="min-w-full overflow-hidden">
					<table className="w-full text-white text-sm">
						<thead>
							<tr className="border-b border-gray-600">
								<th className="text-left py-3 px-2 font-semibold">
									Transaction Hash
								</th>
								<th className="text-left py-3 px-2 font-semibold">Amount</th>
								<th className="text-left py-3 px-2 font-semibold">Name</th>
								<th className="text-left py-3 px-2 font-semibold">Date</th>
							</tr>
						</thead>
						<tbody>
							<AnimatePresence mode="wait">
								{currentTransactions.map((transaction, index) => (
									<motion.tr
										key={`${currentTransactionPage}-${index}`}
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
											<div className="flex items-center gap-2">
												<span className="font-mono text-xs">
													{transaction.tx_hash
														? `${transaction.tx_hash.slice(
																0,
																6
															)}...${transaction.tx_hash.slice(-4)}`
														: 'N/A'}
												</span>
												{transaction.tx_hash && (
													<motion.button
														whileHover={{ scale: 1.1 }}
														whileTap={{ scale: 0.95 }}
														onClick={() => {
															if (
																typeof navigator !== 'undefined' &&
																navigator.clipboard
															) {
																navigator.clipboard.writeText(
																	transaction.tx_hash || ''
																)
															}
														}}
														className="p-1 hover:bg-gray-700 rounded transition-colors"
														title="Copy transaction hash"
													>
														<svg
															className="w-3 h-3"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M8 5H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 012 2v2M8 5l8 0v0a2 2 0 012 2m0 0v8a2 2 0 01-2 2H10a2 2 0 01-2-2V9a2 2 0 012-2h4z"
															/>
														</svg>
													</motion.button>
												)}
											</div>
										</td>
										<td className="py-3 px-2 font-semibold text-green-400">
											{transaction.amount.toLocaleString()} GLMR
										</td>
										<td className="py-3 px-2 truncate max-w-32">
											{transaction.name}
										</td>
										<td className="py-3 px-2 text-gray-300">
											{new Date(transaction.datetime).toLocaleDateString(
												'en-US',
												{
													month: 'short',
													day: 'numeric',
													year: 'numeric',
												}
											)}
										</td>
									</motion.tr>
								))}
							</AnimatePresence>
							{transactionData.length === 0 && (
								<motion.tr
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.5 }}
								>
									<td colSpan={4} className="text-center py-6 text-gray-400">
										No transactions available.
									</td>
								</motion.tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Pagination for Transaction Table */}
			{transactionData.length > transactionsPerPage && (
				<motion.div
					className="flex overflow-hidden items-center justify-between mt-4 px-2"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.5 }}
				>
					<div className="text-sm text-gray-400">
						Showing {startTransactionIndex + 1} to{' '}
						{Math.min(
							startTransactionIndex + transactionsPerPage,
							transactionData.length
						)}{' '}
						of {transactionData.length} transactions
					</div>
					<div className="flex items-center justify-center gap-2 p-4">
						{/* Previous Button */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() =>
								setCurrentTransactionPage((prev) => Math.max(prev - 1, 1))
							}
							disabled={currentTransactionPage === 1}
							className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
							style={{
								background:
									currentTransactionPage === 1
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
								{ length: totalTransactionPages },
								(_, i) => i + 1
							).map((page) => {
								const isActive = page === currentTransactionPage
								const isNearActive =
									Math.abs(page - currentTransactionPage) <= 2
								const isFirstOrLast =
									page === 1 || page === totalTransactionPages

								// Show ellipsis for pages that are far from current page
								if (
									!isNearActive &&
									!isFirstOrLast &&
									totalTransactionPages > 7
								) {
									if (page === 2 && currentTransactionPage > 4) {
										return (
											<span key={page} className="px-2 py-2 text-gray-400">
												...
											</span>
										)
									}
									if (
										page === totalTransactionPages - 1 &&
										currentTransactionPage < totalTransactionPages - 3
									) {
										return (
											<span key={page} className="px-2 py-2 text-gray-400">
												...
											</span>
										)
									}
									if (page !== 2 && page !== totalTransactionPages - 1) {
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
										onClick={() => setCurrentTransactionPage(page)}
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
							onClick={() =>
								setCurrentTransactionPage((prev) =>
									Math.min(prev + 1, totalTransactionPages)
								)
							}
							disabled={currentTransactionPage === totalTransactionPages}
							className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
							style={{
								background:
									currentTransactionPage === totalTransactionPages
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

export default TransactionTable
