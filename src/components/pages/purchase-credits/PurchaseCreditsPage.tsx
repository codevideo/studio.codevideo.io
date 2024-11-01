import * as React from 'react';

export interface IPurchaseCreditsPageProps {
}

interface PricingOption {
    credits: number;
    price: number;
    time: string;
}

const pricingOptions: PricingOption[] = [
    { credits: 50, price: 5, time: '5 minutes' },
    { credits: 100, price: 10, time: '10 minutes' },
    { credits: 300, price: 30, time: '30 minutes' },
    { credits: 600, price: 60, time: '1 hour' },
    { credits: 2000, price: 100, time: '2.5 hours' },
];

export function PurchaseCreditsPage(props: IPurchaseCreditsPageProps) {
    const handlePurchase = async (credits: number, price: number) => {
        // TODO: Implement Stripe checkout integration
        console.log(`Purchasing ${credits} credits for $${price}`);
    };
    
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center mb-2">Purchase Credits</h1>
            <p className="text-xl text-gray-600 text-center mb-12">
                Get credits for video generation at the best prices
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {pricingOptions.map(({ credits, price, time }) => (
                    <div
                        key={credits}
                        className="flex flex-col justify-between bg-white rounded-lg shadow-md p-6 hover:-translate-y-1 transition-transform duration-200 ease-in-out min-h-[320px]"
                    >
                        <div className="flex flex-col items-center text-center flex-grow">
                            <h2 className="text-3xl font-bold mb-2">{credits} Credits</h2>
                            <h3 className="text-4xl font-bold text-blue-600 mb-4">${price}</h3>
                            <p className="text-gray-600">
                                Approximately {time} of video content
                            </p>
                        </div>
                        
                        <div className="mt-6 w-full">
                            <button
                                onClick={() => handlePurchase(credits, price)}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}