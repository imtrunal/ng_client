// import { BsFacebook } from "react-icons/bs";


// function Footer() {
//     return (
//         <footer className="bg-[#252849] text-white py-5">
//             <div className="container mx-auto flex flex-col md:flex-row flex-wrap items-center justify-between px-[9%] gap-6 md:gap-0 text-sm">
//                 {/* Logo */}
//                 <div className="text-xl font-semibold flex items-center space-x-1">
//                     {/* <span className="text-Orange italic font-bold">PEBISNIS</span>
//                     <span className="italic font-bold text-white">ULUNG</span>
//                     <span className="text-Orange font-bold">.</span> */}
//                     <img src="/assets/images/Logo 1.png" className="w-32" alt="" />
//                 </div>

//                 {/* Middle Text */}
//                 <div className="flex items-center flex-wrap justify-center gap-2 text-center">
//                     <span className="hidden md:inline-block border-l border-gray-500 h-8 mr-2"></span>
//                     <p>
//                         Design & Develop by
//                         <a href="https://sughosh.dev/" className="font-bold text-[#FFC107] ml-1" target="_blank">
//                             Sughosh Technolab.
//                         </a>
//                     </p>
//                 </div>

//                 {/* Links and Social Icons */}
//                 <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
//                     <div className="flex gap-4">
//                         <a href="#" className="hover:text-white">Privacy Policy</a>
//                         <a href="#" className="hover:text-white">Terms</a>
//                         <a href="#" className="hover:text-white">Get in Touch</a>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                         <a href={`https://api.whatsapp.com/send?phone=${whatsAppNumber}}&text=Hello`} target="_blank" className="bg-white rounded-md p-1.5 text-Orange hover:scale-110 transition">
//                             <IoLogoWhatsapp size={20} />
//                         </a>
//                         <a href="#" className="bg-white rounded-md p-1.5 text-Orange hover:scale-110 transition">
//                             <FaSquareInstagram size={20} />
//                         </a>
//                     </div>
//                 </div>
//             </div>
//         </footer>

//     );
// }

// export default Footer;


import { FaSquareInstagram } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import { useMenu } from "../common/MenuProvider";
import { useNavigate } from "react-router-dom";
import { ENV_VAR } from "../../utils/envVariables";

const Footer = () => {
    const menuItems = useMenu();
    const navigate = useNavigate();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    const handleNavigate = (route) => {
        if (route) {
            navigate(`/catalog${route}`);
        }
        scrollToTop();
    };
    return (
        <footer className="bg-DarkBlue text-white py-3 px-5 sm:px-10 md:px-20 mt-5">
            <div className="flex flex-wrap justify-between max-w-7xl mx-auto mt-10 gap-y-6">
                <div className="m-5 w-full flex justify-center md:block md:w-auto">
                    <img src="/assets/images/Logo 1.png" className="w-48" alt="" />
                </div>

                <div className="w-full md:w-1/6 text-center md:text-left">
                    <h2 className="text-2xl mb-3 font-bold">Graphics</h2>
                    <ul className="text-sm space-y-2 mt-7">
                        {menuItems
                            .find(item => item.name === "Graphics")
                            ?.subcategories.map(sub => (
                                <li key={sub.route} className="cursor-pointer text-base/7 hover:text-Orange">
                                    <a
                                        onClick={() => handleNavigate(`/graphics/${sub.route}`)}                                    >
                                        {sub.title}
                                    </a>
                                </li>
                            ))}
                    </ul>
                </div>

                <div className="w-full md:w-1/6 text-center md:text-left">
                    <h2 className="text-2xl mb-3 font-bold">Gifting</h2>
                    <ul className="text-sm space-y-2 mt-7">
                        {menuItems
                            .find(item => item.name === "Gifting")
                            ?.subcategories.map(sub => (
                                <li key={sub.route} className="cursor-pointer text-base/7 hover:text-Orange">
                                    <a onClick={() => handleNavigate(`/gifting/${sub.route}`)}>{sub.title}</a>
                                </li>
                            ))}
                    </ul>
                </div>

                <div className="w-full md:w-1/6 text-center md:text-left">
                    <h2 className="text-2xl mb-3 font-bold">Digital</h2>
                    <ul className="text-sm space-y-2 mt-7">
                        {menuItems
                            .find(item => item.name === "Digital")
                            ?.subcategories.map(sub => (
                                <li key={sub.route} className="cursor-pointer text-base/7 hover:text-Orange">
                                    <a onClick={() => handleNavigate(`/digital/${sub.route}`)}>{sub.title}</a>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>

            <div className="text-white flex flex-col md:flex-row justify-between items-center mt-6 text-center text-sm gap-y-4">
                <div className="flex flex-col md:flex-row items-center space-x-6">
                    <p>Design & Develop by<a href="https://sughosh.dev/" className="font-bold text-[#FFC107]" target="_blank"> Sughosh Technolab.</a></p>
                    <div className="flex space-x-6 text-gray-600">
                        <a href="#" className="cursor-pointer">Privacy</a>
                        <a href="#" className="cursor-pointer">Terms of use</a>
                    </div>
                </div>

                <div className="flex gap-2 ">
                    <a href={`https://wa.me/${ENV_VAR.whatsappNumber}`} target="_blank" className="bg-white rounded-md p-1.5 text-Orange hover:scale-110 transition">
                        <IoLogoWhatsapp size={20} />
                    </a>
                    <a href="https://www.instagram.com/nirmanamgraphics/" target="_blank" className="bg-white rounded-md p-1.5 text-Orange hover:scale-110 transition">
                        <FaSquareInstagram size={20} />
                    </a>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
