import React, { useEffect, useState } from 'react';
import Review from '../ReviewPage';

const getRandomDelay = () => {
    // Random delay between 30s and 60s
    return Math.floor(Math.random() * (60000 - 30000)) + 30000;
};

const RatingPopup = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [hasRated, setHasRated] = useState(
        () => localStorage.getItem('hasRated') === 'true'
    );

    useEffect(() => {
        if (hasRated) return;

        const firstTimeout = setTimeout(() => {
            setShowPopup(true);
        }, 10000); // show after 10s

        return () => clearTimeout(firstTimeout);
    }, [hasRated]);

    useEffect(() => {
        if (hasRated || showPopup) return;

        const delay = getRandomDelay();
        const randomTimeout = setTimeout(() => {
            setShowPopup(true);
        }, delay);

        return () => clearTimeout(randomTimeout);
    }, [showPopup, hasRated]);

    const handleRating = () => {
        localStorage.setItem('hasRated', 'true');
        setHasRated(true);
        setShowPopup(false);
    };

    const handleClose = () => {
        setShowPopup(false);
    };

    return (
        <>
            {showPopup && (
                <>
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <code>X</code>
                        <Review />
                    </div>
                </>
                // <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                //     <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
                //         <h2 className="text-lg font-semibold mb-4">Rate our product</h2>
                //         <p className="mb-4">We’d love to hear your feedback!</p>
                //         <div className="flex justify-center space-x-2 mb-4">
                //             {[1, 2, 3, 4, 5].map((star) => (
                //                 <button
                //                     key={star}
                //                     onClick={handleRating}
                //                     className="text-yellow-500 text-xl"
                //                 >
                //                     ★
                //                 </button>
                //             ))}
                //         </div>
                //         <button
                //             onClick={handleClose}
                //             className="text-sm text-gray-600 underline"
                //         >
                //             Maybe later
                //         </button>
                //     </div>
                // </div>
            )}
        </>
    );
};

export default RatingPopup;
