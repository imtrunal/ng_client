import Review from "../ReviewPage";
import { MdKeyboardDoubleArrowRight, MdOutlineArrowForwardIos } from "react-icons/md";
import RocketLaunchButton from "../common/SlideButton";

function LandingPage() {
    return (
        <>
            {/* <nav className="flex items-center justify-end bg-[#1B3A54] p-2 text-white">
                <a href="#contact" className="flex items-center  text-[#1B3A54] font-bold hover:text-[#163345] bg-white p-3 rounded-md">Let’s Begin <MdKeyboardDoubleArrowRight className="text-2xl" />
                </a>
            </nav> */}
            <div className="min-h-screen flex flex-col items-center bg-DarkBlue w-full gap-5">
                <img src="/assets/images/Logo 1.png" className="w-40 mt-10 " alt="Logo" />
                <Review />
                <RocketLaunchButton />
                
            </div>
        </>
    );
}

export default LandingPage;