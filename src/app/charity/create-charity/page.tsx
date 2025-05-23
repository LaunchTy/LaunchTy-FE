'use client'
import CreateCharity from './createCharity'
import { useCharityStore } from '@/store/charity/CreateCharityStore'
import React from 'react'

export default function CreateCharityPage() {
	const resetStore = useCharityStore((state) => state.resetStore);

	// Reset store when component mounts
	React.useEffect(() => {
		resetStore();
	}, [resetStore]);

	return <CreateCharity />
}
