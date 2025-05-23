import React, { useState } from 'react';
import Button from '@/components/UI/button/Button';

interface Donor {
    ranking: number;
    name: string;
    date: string;
    amount: number;
    currency: string;
}

interface DonorsTableProps {
    donors: Donor[];
}

const DonorsTable: React.FC<DonorsTableProps> = ({ donors }) => {
    const [showAll, setShowAll] = useState(false);
    const displayedDonors = showAll ? donors : donors.slice(0, 5);
    const hasMoreDonors = donors.length > 5;

    return (
        <div className="w-full rounded-xl glass-component-1 p-8">
            <h2 className="text-2xl font-bold mb-6">Top Donors</h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="text-left py-4 px-4">Ranking</th>
                            <th className="text-left py-4 px-4">Donor</th>
                            <th className="text-left py-4 px-4">Date</th>
                            <th className="text-right py-4 px-4">Amount</th>
                            <th className="text-left py-4 px-4">Currency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedDonors.map((donor) => (
                            <tr key={donor.ranking} className="border-b border-gray-700 hover:bg-gray-700/30">
                                <td className="py-4 px-4">#{donor.ranking}</td>
                                <td className="py-4 px-4">{donor.name}</td>
                                <td className="py-4 px-4">{donor.date}</td>
                                <td className="py-4 px-4 text-right">{donor.amount.toLocaleString()}</td>
                                <td className="py-4 px-4">{donor.currency}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {hasMoreDonors && !showAll && (
                <div className="flex justify-center mt-6">
                    <Button
                        className="bg-gradient text-white px-[5rem] py-3 rounded-full hover:opacity-90 transition-all duration-300"
                        onClick={() => setShowAll(true)}
                    >
                        Show More
                    </Button>
                </div>
            )}
        </div>
    );
};

export default DonorsTable; 