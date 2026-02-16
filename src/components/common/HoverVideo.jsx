// import React, { useRef, useState, useEffect } from 'react';

// const HoverVideo = ({ videoUrl, posterUrl }) => {
//     const videoRef = useRef(null);
//     const containerRef = useRef(null);
//     const [isHovered, setIsHovered] = useState(false);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [isMobile, setIsMobile] = useState(false);

//     useEffect(() => {
//         const checkIsMobile = () => {
//             setIsMobile(window.innerWidth <= 768);
//         };
//         checkIsMobile();
//         window.addEventListener('resize', checkIsMobile);
//         return () => window.removeEventListener('resize', checkIsMobile);
//     }, []);

//     const handleMouseEnter = () => {
//         if (!isMobile && videoRef.current) {
//             videoRef.current.play();
//             setIsHovered(true);
//         }
//     };

//     const handleMouseLeave = () => {
//         if (!isMobile && videoRef.current) {
//             videoRef.current.pause();
//             videoRef.current.currentTime = 0;
//             setIsHovered(false);
//         }
//     };

//     const handleClick = () => {
//         if (isMobile && videoRef.current) {
//             if (isPlaying) {
//                 videoRef.current.pause();
//                 videoRef.current.currentTime = 0;
//                 setIsPlaying(false);
//             } else {
//                 videoRef.current.play();
//                 setIsPlaying(true);
//             }
//         }
//     };

//     const handleContextMenu = (e) => {
//         e.preventDefault();
//     };

//     // Reset video when scrolled out of view
//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             ([entry]) => {
//                 if (!entry.isIntersecting && videoRef.current) {
//                     videoRef.current.pause();
//                     videoRef.current.currentTime = 0;
//                     setIsPlaying(false);
//                     setIsHovered(false);
//                 }
//             },
//             { threshold: 0.3 }
//         );

//         if (containerRef.current) {
//             observer.observe(containerRef.current);
//         }

//         return () => {
//             if (containerRef.current) {
//                 observer.unobserve(containerRef.current);
//             }
//         };
//     }, []);

//     return (
//         <div
//             className="relative"
//             ref={containerRef}
//             onMouseEnter={handleMouseEnter}
//             onMouseLeave={handleMouseLeave}
//             onClick={handleClick}
//         >
//             <video
//                 ref={videoRef}
//                 className="w-full h-auto rounded-lg"
//                 src={videoUrl}
//                 poster={posterUrl}
//                 muted
//                 preload="metadata"
//                 style={{
//                     display: isHovered || isPlaying ? 'block' : 'none',
//                 }}
//                 onContextMenu={handleContextMenu}
//                 playsInline
//             >
//                 Your browser does not support the video tag.
//             </video>

//             {!isHovered && !isPlaying && (
//                 <img
//                     src={posterUrl}
//                     alt="Video Thumbnail"
//                     className="w-full h-auto rounded-lg"
//                 />
//             )}
//         </div>
//     );
// };

// export default HoverVideo;
import React, { useRef, useState, useEffect } from 'react';
import { BsPlayCircleFill } from "react-icons/bs";
import { ENV_VAR } from './../../utils/envVariables';
const HoverVideo = ({ videoUrl, posterUrl }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const handleMouseEnter = () => {
        if (!isMobile && videoRef.current) {
            videoRef.current.play();
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsHovered(false);
        }
    };

    const handleClick = () => {
        if (isMobile && videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting && videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                    setIsPlaying(false);
                    setIsHovered(false);
                }
            },
            { threshold: 0.3 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <div
            className="relative w-full min-h-102.5"
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {/* Play Icon Overlay */}
            {!isHovered && !isPlaying && (
                <div className="bg-black/20 absolute inset-0 text-Orange flex items-center justify-center z-10 transition-opacity duration-300">
                    <BsPlayCircleFill size={70} />
                </div>
            )}

            {/* Video */}
            <video
                ref={videoRef}
                className="w-full h-auto rounded-lg"
                src={ENV_VAR.API_URL + videoUrl}
                poster={ENV_VAR.API_URL + posterUrl}
                muted
                preload="metadata"
                style={{
                    display: isHovered || isPlaying ? 'block' : 'none',
                }}
                onContextMenu={handleContextMenu}
                playsInline
            />

            {/* Thumbnail Fallback */}
            {!isHovered && !isPlaying && posterUrl && (
                <img
                    // src={posterUrl || `https://res.cloudinary.com/dreandu19/video/upload/so_5/${getCloudinaryPublicId(videoUrl)}.jpg`}
                    src={ENV_VAR.API_URL + posterUrl}
                    alt="Video Thumbnail"
                    className="w-full h-auto rounded-lg"
                />
            )}
        </div>
    );
};

export default HoverVideo;
