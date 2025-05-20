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
        <div className="w-full h-screen bg-DarkBlue flex justify-center items-center relative flex-col gap-16 pt-20">

            <img
                className="w-48 object-contain"
                src="/assets/images/Logo.png"
                alt="Logo"
            />
            <div className='w-[10%]' ref={animationContainer}></div>
        </div>
    );
};

export default SplashScreen;
