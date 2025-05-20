import { ImQuotesLeft } from "react-icons/im";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import { useState } from "react";

function Testimonial() {
    const [activeIndex, setActiveIndex] = useState(0);

    const reviews = [
        {
            text: "High-quality designs, prompt service, and friendly staff. Highly recommended for all types of invitation cards, videos, and custom festival cards, particularly for businesses.",
            name: "Ravindra Naskrani",
        },
        {
            text: "I really had a great experience with nirman graphics as they have variety of designs and they also provide good quality and variety of designs!!",
            name: "Muskan Somani",
        },
        {
            text: "Amazing experience from the work they had done good quality of the product highly professional in ther work and cery poleite behaviour with their customers and affordable prices",
            name: "ANKUR PAREEK",
        },
        {
            text: "Very Beautiful And All Unic Design 💫💖 It's Nice Performance Nirmanam Shop 🤞🏻🫶🏻",
            name: "Vishv Katrodiya",
        },
        {
            text: "Best place to Boost your brand with creative products",
            name: "Akash Borad",
        },
    ];

    return (
        <div className="flex flex-col w-full mt-20 px-5 md:px-[9%]">
            <div className="flex flex-col gap-3">
                <p className="text-lg text-Orange">TESTIMONIAL</p>
                <h1 className="text-3xl font-bold md:w-1/4 w-full leading-tight tracking-wide mb-10 md:m-0">
                    What Our Customer's Say
                </h1>
            </div>

            <div className="mt-10 relative w-full flex flex-col items-center">
                <img
                    className="w-full h-auto sm:max-w-[90%] object-fill"
                    src="/assets/images/map.png"
                    alt="testimonial-map"
                />

                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
                    <div className="w-full md:w-full p-2">
                        <Swiper
                            effect={'coverflow'}
                            coverflowEffect={{
                                rotate: 0,
                                stretch: 0,
                                depth: 500,
                                modifier: 1,
                                slideShadows: false,
                            }}
                            centeredSlides={true}
                            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                            onSwiper={(swiper) => setActiveIndex(swiper.activeIndex)}
                            // slidesPerView={2}
                            className="mySwiper"
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                    spaceBetween: 0,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 5,
                                },
                                1024: {
                                    slidesPerView: 2,
                                    spaceBetween: 10,
                                },
                            }}
                            loop
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            modules={[
                                EffectCoverflow,
                                Autoplay
                            ]}
                        >
                            {reviews.map((review, index) => (
                                <SwiperSlide key={index} className="bg-transparent px-5">
                                    {({ isActive }) => (
                                        <div
                                            className={`bg-gray-100 px-6 md:px-10 py-6 shadow-md rounded-md flex flex-col gap-3 z-50 transition-all duration-300 ${isActive ? 'blur-none scale-100 opacity-100' : 'blur-[2px] scale-95'
                                                }`}
                                        >
                                            <ImQuotesLeft color="#F18B35" size={30} />
                                            <p className="text-sm md:text-base">{review.text}</p>
                                            <div className="flex items-center gap-4 mt-5">
                                                <p className="w-10 h-10 md:w-12 md:h-12 bg-Orange rounded-full flex justify-center items-center text-lg md:text-xl font-bold text-[#1B3A54]">
                                                    {review.name.charAt(0).toUpperCase()}
                                                </p>
                                                <div className="flex flex-col gap-1">
                                                    <h1 className="text-base md:text-lg font-bold text-[#1B3A54]">
                                                        {review.name}
                                                    </h1>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </SwiperSlide>
                            ))}


                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Testimonial;