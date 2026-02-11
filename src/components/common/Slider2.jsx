// import React, { useRef, useEffect, useState, useCallback } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay } from 'swiper/modules';
// import { Skeleton } from '@heroui/react';
// import 'swiper/css';
// import './swiper.css';

// const HoverSwiper = ({
//   slides = [],
//   autoplayDelay = 1000,
//   allowTouchMove = false,
//   className = "",
//   slideClassName = "",
//   skeletonHeight = "h-52",
// }) => {
//   const swiperRef = useRef(null);
//   const containerRef = useRef(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isInView, setIsInView] = useState(false);
//   const resizeTimeoutRef = useRef(null);

//   // Debounced mobile check
//   const checkIfMobile = useCallback(() => {
//     if (resizeTimeoutRef.current) {
//       clearTimeout(resizeTimeoutRef.current);
//     }

//     resizeTimeoutRef.current = setTimeout(() => {
//       setIsMobile(window.innerWidth <= 768);
//     }, 100);
//   }, []);

//   // Check if mobile on mount and set up resize listener
//   useEffect(() => {
//     checkIfMobile();
//     window.addEventListener('resize', checkIfMobile);
//     return () => {
//       window.removeEventListener('resize', checkIfMobile);
//       if (resizeTimeoutRef.current) {
//         clearTimeout(resizeTimeoutRef.current);
//       }
//     };
//   }, [checkIfMobile]);

//   // Set up Intersection Observer for mobile only
//   useEffect(() => {
//     if (!containerRef.current || !isMobile) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setIsInView(entry.isIntersecting);

//         if (entry.isIntersecting) {
//           swiperRef.current?.autoplay?.start();
//         } else {
//           swiperRef.current?.autoplay?.stop();
//           swiperRef.current?.slideTo(0);
//         }
//       },
//       {
//         threshold: 0.5,
//         rootMargin: '0px 0px -50px 0px'
//       }
//     );

//     observer.observe(containerRef.current);

//     return () => {
//       if (containerRef.current) {
//         observer.unobserve(containerRef.current);
//       }
//     };
//   }, [isMobile]);

//   // Memoized event handlers
//   const handleMouseEnter = useCallback(() => {
//     if (isMobile) return;
//     swiperRef.current?.autoplay?.start();
//   }, [isMobile]);

//   const handleMouseLeave = useCallback(() => {
//     if (isMobile) return;
//     swiperRef.current?.autoplay?.stop();
//     swiperRef.current?.slideTo(0);
//   }, [isMobile]);

//   // Image optimization - lazy loading and decoding
//   const renderSlide = (slide, index) => {
//     if (typeof slide === 'string') {
//       return (
//         <img
//           src={slide}
//           alt={`Slide ${index + 1}`}
//           className="w-full"
//           style={{ imageRendering: "crisp-edges" }}
//           loading="lazy"
//           decoding="async"
//         />
//       );
//     }
//     return slide;
//   };

//   return (
//     <div
//       ref={containerRef}
//       className={`w-full ${className}`}
//       onMouseEnter={!isMobile ? handleMouseEnter : undefined}
//       onMouseLeave={!isMobile ? handleMouseLeave : undefined}
//     >
//       {slides.length > 0 ? (
//         <Swiper
//           className="mySwiper"
//           slidesPerView={1}
//           loop={false}
//           autoplay={{
//             delay: autoplayDelay,
//             disableOnInteraction: false,
//           }}
//           modules={[Autoplay]}
//           onSwiper={(swiper) => {
//             swiperRef.current = swiper;
//             swiper.autoplay.stop();
//           }}
//           allowTouchMove={isMobile ? true : allowTouchMove}
//           speed={500} // Smoother transition
//           resistanceRatio={0.7} // Better feel when dragging
//           watchSlidesProgress={true}
//         >
//           {slides.map((slide, index) => (
//             <SwiperSlide key={index} className={slideClassName}>
//               {renderSlide(slide, index)}
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       ) : (
//         <Skeleton className="rounded-lg">
//           <div className={`w-full ${skeletonHeight} rounded-lg bg-default-300`} />
//         </Skeleton>
//       )}
//     </div>
//   );
// };

// export default React.memo(HoverSwiper);


import React, { useRef, useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Skeleton } from "@heroui/react";
import "swiper/css";
import "./swiper.css";
import { ENV_VAR } from "../../utils/envVariables";

const HoverSwiper = ({
  slides = [],
  getSlideUrl, // NEW: function to generate image URL by index
  autoplayDelay = 1000,
  allowTouchMove = false,
  className = "",
  slideClassName = "",
  skeletonHeight = "h-52",
}) => {
  const swiperRef = useRef(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const resizeTimeoutRef = useRef(null);

  const checkIfMobile = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = setTimeout(() => {
      setIsMobile(window.innerWidth <= 768);
    }, 100);
  }, []);

  useEffect(() => {
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [checkIfMobile]);

  useEffect(() => {
    if (!containerRef.current || !isMobile) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          swiperRef.current?.autoplay?.start();
        } else {
          swiperRef.current?.autoplay?.stop();
          swiperRef.current?.slideTo(0);
        }
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [isMobile]);

  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    swiperRef.current?.autoplay?.start();
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    swiperRef.current?.autoplay?.stop();
    swiperRef.current?.slideTo(0);
  }, [isMobile]);

  const renderSlide = (slide, index) => {
    const src = typeof slide === "string" ? slide : getSlideUrl?.(slide);

    if (!src) return null;

    return (
      <img
        src={ENV_VAR.API_URL+src}
        alt={`Slide ${index + 1}`}
        className="w-full"
        style={{ imageRendering: "crisp-edges" }}
        loading="lazy"
        decoding="async"
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className={`w-full ${className}`}
      onMouseEnter={!isMobile ? handleMouseEnter : undefined}
      onMouseLeave={!isMobile ? handleMouseLeave : undefined}
    >
      {slides.length > 0 ? (
        <Swiper
          className="mySwiper"
          slidesPerView={1}
          loop={false}
          autoplay={{
            delay: autoplayDelay,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            swiper.autoplay.stop();
          }}
          allowTouchMove={isMobile ? true : allowTouchMove}
          speed={500}
          resistanceRatio={0.7}
          watchSlidesProgress={true}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className={slideClassName}>
              {renderSlide(slide, index)}
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Skeleton className="rounded-lg">
          <div className={`w-full ${skeletonHeight} rounded-lg bg-default-300`} />
        </Skeleton>
      )}
    </div>
  );
};

export default React.memo(HoverSwiper);
