import React, { useEffect, useRef } from 'react';
import Lottie from 'lottie-web';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
    const navigate = useNavigate();
    const animationContainer = useRef(null);

    useEffect(() => {
        Lottie.loadAnimation({
            container: animationContainer.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/assets/lottie/loader2.json',
        });
        setTimeout(() => {
            navigate("/home");
        }, 5000);

        return () => {
            Lottie.destroy();
        };

    }, []);

    return (
        <div className="w-full min-h-screen bg-DarkBlue flex flex-col relative">
            <div className="w-full flex justify-center pt-4 px-2 md:px-0">
                <img
                    className="w-full md:w-1/2 lg:w-1/3"
                    src="/assets/images/Kashtabhanjan dev.png"
                    alt="Kashtabhanjan Dev"
                />
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10">
                <img
                    className="w-48 sm:w-40 md:w-56 object-contain"
                    src="/assets/images/Logo.png"
                    alt="Logo"
                />
                <div
                    className="w-[30%] sm:w-[20%] md:w-[15%] lg:w-[10%]"
                    ref={animationContainer}
                ></div>
            </div>
        </div>
    );
};

export default SplashScreen;
