import { useRef, useState } from "react";
import { FaCircleCheck, FaSquareInstagram } from "react-icons/fa6";
import Select from 'react-select'
import AttachmentUpload from "../common/AttachmentUpload";
import { toast } from 'sonner';
import { useMenu } from "../common/MenuProvider";
import { ENV_VAR } from "../../utils/envVariables";
import { GrLocation } from "react-icons/gr";
import { FiPhone } from "react-icons/fi";
import { AiTwotoneMail } from "react-icons/ai";
import { TbWorld } from "react-icons/tb";
import { IoLogoWhatsapp } from "react-icons/io5";
import ContactUs from "../layouts/ContactUs";
import WhyChooseUs from "../layouts/WhyChooseUs";

function LetsTalk() {
    return (
        <div className="relative px-4 md:px-[3%] py-8 mx-auto max-w-7xl" id="contactUs">
            <div className="w-full rounded-md overflow-hidden mb-28">
                {/* <img
                    src="https://placehold.co/1100x400?text=Banner"
                    alt="Contact us banner"
                    className="w-full h-full object-cover"
                /> */}
                <WhyChooseUs />
            </div>

            <ContactUs />

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold text-DarkBlue mb-4">Our Location</h3>
                        <div className="rounded-xl overflow-hidden shadow-lg h-96">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2833.244153669902!2d72.8523934!3d21.2103836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f2bb4e46dbd%3A0xea6678d5723af6!2sNirmanam%20Graphics!5e1!3m2!1sen!2sin!4v1747990523639!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>

                    <div className="col-span-1 mt-10">
                        <h3 className="text-2xl font-bold text-DarkBlue mb-4">Contact Details</h3>

                        <div className="flex flex-col lg:flex-row lg:justify-start lg:items-start gap-8">
                            {/* Address */}
                            <div className="flex items-start w-full lg:w-[40%]">
                                <div className="flex-shrink-0 bg-Orange/10 p-3 rounded-lg">
                                    <GrLocation className="text-Orange text-2xl" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-semibold text-DarkBlue">Address</h4>
                                    <p className="mt-1 text-gray-600 leading-loose">
                                        U.G.-7, M.J.HOUSE, near M D Tower, near MINI BAZAR, Mohan ni Chawl, Mini Bazar, Laxman Nagar, Varachha, Surat, Gujarat 395006
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start w-full lg:w-auto">
                                <div className="flex-shrink-0 bg-Orange/10 p-3 rounded-lg">
                                    <FiPhone className="text-Orange text-2xl" />
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg font-semibold text-DarkBlue">Phone</h4>
                                    <p className="mt-1 text-gray-600">
                                        <a href={`tel:+${ENV_VAR.whatsappNumber}`} className="hover:text-Orange transition">+{ENV_VAR.whatsappNumber}</a><br />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LetsTalk;



