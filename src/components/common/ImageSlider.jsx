import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './swiper.css'
import { Autoplay } from 'swiper/modules';

const ImageSlider = ({ images }) => {
    return (
        (images ?
            <Swiper
                className="mySwiper"
                slidesPerView={1}
                spaceBetween={10}
                // onSlideChange={() => console.log('slide change')}
                // onSwiper={(swiper) => console.log(swiper)}
                loop
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
            >
                {images.map((img, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <img src={img} alt={`Slide ${index + 1}`} className="w-full object-v shadow-lg px-5" />
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            : <p className='flex justify-center items-center'>No Images</p>)
    );
};


export default ImageSlider;