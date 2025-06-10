import { useRef, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import Select from 'react-select'
import AttachmentUpload from "../common/AttachmentUpload";
import { toast } from 'sonner';
import { useMenu } from "../common/MenuProvider";
import { ENV_VAR } from "../../utils/envVariables";
import axios from "axios";

function ContactUs() {
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        message: '',
    });

    const [isDisabled, setIsDisabled] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [subCategories, setFilteredSubCategories] = useState(null);
    const menuItems = useMenu();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (file) => {
        console.log(file);

        setSelectedFile(file);
    };

    const customStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: 'rgba(241, 139, 53, 0.1)',
            borderColor: 'none',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(241, 139, 53, 0.3)' : 'none',
            cursor: 'pointer',
            padding: '0.4rem',
            '&:hover': {
                borderColor: '#F18B35',
            },
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? '#F18B35'
                : state.isFocused
                    ? 'rgba(241, 139, 53, 0.1)'
                    : 'white',
            color: state.isSelected ? 'white' : '#1B3A54',
            cursor: 'pointer',
        }),
        menu: (base) => ({
            ...base,
            zIndex: 20,
        }),
    };

    const mainCategoryOptions = menuItems.map(item => ({
        value: item.name,
        label: item.name,
    }));

    const subCategoryOptions = menuItems.flatMap(item =>
        item.subcategories.map(sub => ({
            value: sub.title,
            label: sub.title,
            icon: sub.icon,
            category: item.name
        }))
    );

    const handleSubCategories = (category) => {
        setSelectedCategory(category);
        setSelectedSubCategory(null);

        if (!category) {
            setFilteredSubCategories([]);
            setIsDisabled(true);
            return;
        }

        const filteredSubCategories = subCategoryOptions.filter(
            item => item.category === category.value
        );

        setFilteredSubCategories(filteredSubCategories);
        setIsDisabled(filteredSubCategories.length === 0);
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            toast.error("Please enter your full name.");
            return false;
        }

        if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile)) {
            toast.error("Please enter a valid 10-digit mobile number.");
            return false;
        }

        if (!selectedCategory) {
            toast.error("Please select a category.");
            return false;
        }

        if (!selectedSubCategory) {
            toast.error("Please select a sub category.");
            return false;
        }

        if (!formData.message.trim()) {
            toast.error("Please enter your message.");
            return false;
        }

        return true;
    };


    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('attachedFiles', file);

        try {
            const response = await axios.post(`${ENV_VAR.API_URL}/upload`, formData);

            if (response.status!==200) {
                throw new Error('Upload failed');
            }

            const data = await response.data;            
            return data.data.url; // Assuming your API returns { url: '...' }
        } catch (error) {
            toast.error("File upload failed. Please try again.");
            console.error('Upload error:', error);
            return null;
        }
    };


    const handleSendToWhatsApp = async () => {
        if (!validateForm()) return;

        setIsUploading(true);
        let attachmentUrl = null;

        // Upload file if one was selected
        if (selectedFile) {
            attachmentUrl = await uploadFile(selectedFile);
            if (!attachmentUrl) {
                setIsUploading(false);
                return; // Don't proceed if upload failed
            }
        }

        const phoneNumber = ENV_VAR.whatsappNumber;
        const category = selectedCategory?.label || '';
        const subCategory = selectedSubCategory?.label || '';

        let message = `Hello,

I am interested in your services and would like to inquire further.

📂*Category:* ${category}  
📂*Sub-Category:* ${subCategory}

👤*Name:* ${formData.fullName}  
📞*Mobile:* ${formData.mobile}

📝*Message:*  
${formData.message}`;

        // Add attachment URL if available
        if (attachmentUrl) {
            message += `\n\n📎*Attachment:* ${attachmentUrl}`;
        }

        message += `\n\nThank you for your time!  
I look forward to your response.`;

console.log("sasasasasa",message);


        const isMobile = /iPhone|Android/i.test(navigator.userAgent);
        const url = isMobile
            ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
            : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

        setIsUploading(false);
        window.open(url, '_blank');
    };

    //     const handleSendToWhatsApp = () => {
    //     if (!validateForm()) return;

    //     const phoneNumber = whatsAppNumber;
    //     const category = selectedCategory?.label || '';
    //     const subCategory = selectedSubCategory?.label || '';

    //     const message = `Hello,

    // I am interested in your services and would like to inquire further.

    // 📂*Category:* ${category}  
    // 📂*Sub-Category:* ${subCategory}

    // 👤*Name:* ${formData.fullName}  
    // 📞*Mobile:* ${formData.mobile}

    // 📝*Message:*  
    // ${formData.message}

    // Thank you for your time!  
    // I look forward to your response.`;

    //     // Use wa.me link universally — WhatsApp handles app/web routing
    //     const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    //     window.open(url, '_blank');
    // };

    return (
        <div className="relative hero px-1 md:pl-[3%] pb-0 mx-[2%] text-Orange md:-mt-14" id="contactUs">
            <div className="flex flex-col md:flex-row items-center md:items-center gap-5 md:gap-0">
                <div className="relative w-full md:w-1/2 flex justify-center items-center">
                    <img
                        className="w-full max-w-md md:max-w-[600px]"
                        src="/assets/images/ContactUs.png"
                        alt="Hero Banner"
                    />
                </div>

                <div className="p-4 sm:p-6 md:p-8 -mt-4 w-full md:w-1/2">
                    <p className="text-Orange text-sm font-semibold mb-3">CONTACT US</p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-DarkBlue mb-6 sm:mb-8">
                        Let’s Collaborate Now!
                    </h2>

                    <form className="flex flex-col gap-3">
                        <label className="text-DarkBlue font-bold text-base" htmlFor="fullName">
                            Full Name
                            <input
                                className="mt-2 p-3 pl-5 outline-none bg-Orange/10 text-DarkBlue font-normal text-base w-full rounded"
                                type="text"
                                name="fullName"
                                placeholder="Input Your Name"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </label>

                        <label className="text-DarkBlue font-bold text-base w-full" htmlFor="mobile">
                            Mobile
                            <input
                                className="mt-2 p-3 pl-5 outline-none bg-Orange/10 text-DarkBlue font-normal text-base w-full rounded"
                                type="number"
                                name="mobile"
                                placeholder="Input Your mobile"
                                value={formData.mobile}
                                maxLength={10}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{0,10}$/.test(value)) {
                                        setFormData({ ...formData, mobile: value });
                                    }
                                }} />
                        </label>

                        <div className="flex flex-col gap-3">
                            <label className="w-full text-DarkBlue font-bold text-base" htmlFor="">
                                Select Category
                                <Select value={selectedCategory} className="mt-2 font-normal" styles={customStyles} options={mainCategoryOptions} onChange={(e) => {
                                    handleSubCategories(e);
                                }} isClearable />
                            </label>


                            <label className="w-full text-DarkBlue font-bold text-base" htmlFor="">
                                Select Sub Category
                                <Select value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e)} className="mt-2 font-normal" styles={customStyles} options={subCategories} isDisabled={isDisabled} isClearable />
                            </label>
                        </div>


                        <label className="text-DarkBlue font-bold text-base" htmlFor="message">
                            Message
                            <textarea
                                className="mt-2 p-3 pl-5 outline-none bg-Orange/10 text-DarkBlue font-normal text-base w-full h-28 resize-none rounded"
                                name="message"
                                placeholder="Write Message..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </label>

                        <AttachmentUpload onFileChange={handleFileChange} />

                        <div className="flex justify-center md:justify-start mt-7 mb-5">
                            <button
                                onClick={handleSendToWhatsApp}
                                disabled={isUploading}
                                className={`cursor-pointer bg-Orange hover:bg-Orange/90 border-2 text-white px-12 p-4 rounded-full font-semibold shadow-2xl shadow-Orange/30 transition-all duration-500 hover:duration-100 ease-in-out ${isUploading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isUploading ? 'Uploading...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
}

export default ContactUs;



