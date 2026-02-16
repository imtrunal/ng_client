import React, { useEffect, useState } from 'react';
import Review from '../ReviewPage';

const getRandomDelay = () => {
    return Math.floor(Math.random() * (30 * 60 * 1000 - 10 * 60 * 1000)) + 10 * 60 * 1000;
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
        }, 30000); // show after 10s

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
                <div className="fixed top-0 left-0 w-full h-full bg-black/50 bg-opacity-50 flex items-center justify-center z-100 overscroll-none">
                    <Review close={handleClose} rated={handleRating} />
                </div>
            )}
        </>
    );
};

export default RatingPopup;
