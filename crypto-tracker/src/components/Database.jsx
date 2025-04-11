import React from 'react';

function Database() {
    return (
        <div className="min-h-screen bg-[#0864c7] px-4 py-10">
            {/* */}
            <h1 className="text-white text-4xl font-semibold text-center mb-6 drop-shadow">
                Entire Cryptocurrency Database
            </h1>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-700 text-lg">
                    This is where the full list of cryptocurrencies will be displayed.
                </p>
                <p className="text-gray-500 mt-2">
                    (Coming soon!)
                </p>
            </div>
        </div>
    );
}

export default Database;
