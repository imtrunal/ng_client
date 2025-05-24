import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Skeleton } from '@heroui/react';
import 'swiper/css';
import './swiper.css';

const HoverSwiper = ({
  slides = [],
  autoplayDelay = 1000,
  allowTouchMove = false,
  className = "",
  slideClassName = "",
  skeletonHeight = "h-32",
}) => {
  const swiperRef = useRef(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Check if mobile on mount
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Set up Intersection Observer for mobile only
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
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isMobile]);

  const handleMouseEnter = () => {
    if (isMobile) return;
    swiperRef.current?.autoplay?.start();
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    swiperRef.current?.autoplay?.stop();
    swiperRef.current?.slideTo(0);
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
            swiper.autoplay.stop(); // Start stopped by default
          }}
          allowTouchMove={isMobile ? true : allowTouchMove}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className={slideClassName}>
              {typeof slide === 'string' ? (
                <img
                  src={slide}
                  alt={`Slide ${index + 1}`}
                  className="w-full"
                  style={{ imageRendering: "crisp-edges" }}
                />
              ) : (
                slide
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Skeleton className="rounded-lg">
          <div className={`${skeletonHeight} rounded-lg bg-default-300`} />
        </Skeleton>
      )}
    </div>
  );
};

export default HoverSwiper;