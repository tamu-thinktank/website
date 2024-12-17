// pages/design-challenges.tsx

import React from 'react';
import AppHeader from "@/components/AppHeader"; // Adjust path if needed
import AppFooter from "@/components/AppFooter"; // Adjust path if needed

const DesignChallenges: React.FC = () => {
    return (
        <>
            <AppHeader />
            <main className="flex items-center justify-start h-screen bg-gray-900 p-8">
                <h1 className="text-6xl font-bold text-white">Design Challenges</h1>
            </main>
            <AppFooter />
        </>
    );
};

export default DesignChallenges;
