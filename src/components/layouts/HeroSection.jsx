
import { PiSealCheckDuotone, PiSealCheckFill } from "react-icons/pi";
import { HiPlayCircle } from "react-icons/hi2";

function HeroSection(params) {
    return (
        <div className="hero bg-gradient-to-t from-Orange/10 to-white px-4 md:pl-[9%] pb-14 mx-4 mt-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0">
          
          <div className="flex flex-col gap-8 max-w-xl w-full md:pr-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-md text-Orange font-semibold">
              <PiSealCheckDuotone size={20} />
              Best Business Platform - World Record 2021
            </div>
      
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              Reach Your{' '}
              <span className="relative inline-block">
                <span className="relative inline-block">Business</span>
                <img src="/assets/images/underLine.svg" className="absolute -bottom-5 left-0 w-full" alt="" />
              </span>
              <span className="block mt-5">Goals in Record Time</span>
            </h1>
      
            <p className="text-gray-600 text-base mx-auto md:mx-0 w-[90%] md:w-[80%] leading-loose">
              Support small business and join the nationwide movement to encourage commercial support
              for the millions of minority owned businesses helping world economy.
            </p>
      
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 mt-10 justify-center md:justify-start">
              <a href="#" className="
                bg-Orange hover:bg-Orange/90 border-2    
                text-white px-12 p-4 rounded-full font-semibold shadow-2xl shadow-Orange/30 
                transition-all duration-500 hover:duration-100 ease-in-out">
                Get Started
              </a>
              <a href="#" className="flex items-center justify-center gap-2 text-gray-800 font-medium hover:underline cursor-pointer">
                <HiPlayCircle size={20} />
                Watch Video
              </a>
            </div>
          </div>
      
          <div className="relative w-full max-w-md md:max-w-[570px] -mt-10 md:-mt-16 mx-auto md:mx-0">
            <img
              className="w-full"
              src="/assets/images/HeroBanner.png"
              alt="Hero Banner"
            />
          </div>
      
        </div>
      </div>


    );
}

export default HeroSection;