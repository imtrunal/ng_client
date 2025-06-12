import { FaCircleCheck } from "react-icons/fa6";
import ImageSlider from "../common/ImageSlider";
import { useEffect, useState } from "react";
import { ENV_VAR } from "../../utils/envVariables";
import axios from "axios";

function WhyChooseUs() {
    const [banners, setBanners] = useState([]);
    const fetchBanners = async () => {
        try {
            const response = await axios.get(`${ENV_VAR.API_URL}/banners`);
            const responseData = response.data;
            const bannerLinks = responseData.data
                .filter(i => new Date(i.startDate) <= new Date() && new Date(i.endDate) >= new Date())
                .map(item => item.banner);
            setBanners(bannerLinks);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, [])

    return (
        <div className="hero flex justify-center items-center">
            {/* <ImageSlider images={["assets/images/slider banner/1.jpg", "assets/images/slider banner/2.jpg", "assets/images/slider banner/3.jpg"]} /> */}
            <ImageSlider images={banners} />
            {/* <img src="/assets/images/fff.png" alt="" /> */}
            {/* <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-0">

                <div className="relative mb-6 md:mb-0">
                    <img
                        className="w-full max-w-md md:max-w-[570px]"
                        src="/assets/images/ChooseBanner.png"
                        alt="Hero Banner"
                    />
                </div>

                <div className="md:pl-[9%] flex flex-col gap-6 max-w-xl w-full md:pr-10 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-md text-Orange font-semibold">
                        WHY CHOOSE US
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white leading-loose">
                        Take on any Challenge of <br className="hidden md:block" /> the Digital World
                    </h1>

                    <ul className="flex flex-col gap-5 text-gray-300 text-base items-center md:items-start">
                        <li className="flex items-center gap-2"><FaCircleCheck />Corporate Financial Advisory</li>
                        <li className="flex items-center gap-2"><FaCircleCheck />Development of Financial Models</li>
                        <li className="flex items-center gap-2"><FaCircleCheck />Deal Structuring</li>
                    </ul>

                    <div className="flex justify-center md:justify-start mt-8 mb-5">
                        <a href="#" className="
          bg-Orange hover:bg-Orange/90 border-2    
          text-white px-12 p-4 rounded-full font-semibold shadow-2xl shadow-Orange/30 
          transition-all duration-500 hover:duration-100 ease-in-out">
                            Get Started
                        </a >
                    </div>
                </div>

            </div> */}
        </div>

    );
}

export default WhyChooseUs;