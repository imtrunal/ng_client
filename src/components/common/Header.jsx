import { MdMenu } from "react-icons/md";
import {
    RiCloseLargeFill,
    RiArrowDownSLine,
} from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
// import { menuItems } from "../../utils/data";
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenu } from './MenuProvider';

function Header() {
    const menuItems = useMenu();

    const [isOpen, setIsOpen] = useState(false);
    const [desktopSubMenuOpen, setDesktopSubMenuOpen] = useState(null);
    const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log("menuItems", menuItems);
        
        const scollHandler = window.addEventListener("scroll", (e) => {
            const topPadding = e.target.scrollingElement.scrollTop;
            if (topPadding > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        });

        return () => {
            window.removeEventListener("scroll", scollHandler);
        }
    }, [])


    // Update your isActiveRoute and isMenuActive functions:
    const isActiveRoute = (mainCategory, subCategory = null) => {
        const pathParts = location.pathname.split('/');
        const currentMainCategory = pathParts[2]; // Gets the part after '/catalog/'
        const queryParams = new URLSearchParams(location.search);
        const currentSubCategory = queryParams.get('category');

        // Check if we're on a catalog page first
        if (pathParts[1] !== 'catalog') return false;

        if (subCategory) {
            return currentMainCategory === mainCategory && currentSubCategory === subCategory;
        }
        // For main category, check if it matches and there's no subcategory selected
        return currentMainCategory === mainCategory && !currentSubCategory;
    };

    // Check if any submenu item is active for a given menu item
    const isMenuActive = (menuItem) => {
        const pathParts = location.pathname.split('/');
        if (pathParts[1] !== 'catalog') return false;

        const currentMainCategory = pathParts[2];
        const queryParams = new URLSearchParams(location.search);
        const currentSubCategory = queryParams.get('category');

        // First check if main category matches
        if (currentMainCategory === menuItem.routePath) {
            // If there's a subcategory, check if it belongs to this menu
            if (currentSubCategory) {
                return menuItem.subcategories.some(sub => sub.route === currentSubCategory);
            }
            return true;
        }
        return false;
    };

    const toggleMobileSubMenu = (category) => {
        setMobileSubMenuOpen(mobileSubMenuOpen === category ? null : category);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setDesktopSubMenuOpen(null);
            }
        };

        const handleScroll = () => {
            setDesktopSubMenuOpen(null);
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    const handleNavigate = (mainCategory, subCategory = null) => {
        setDesktopSubMenuOpen(null);
        if (subCategory) {
            navigate(`/catalog/${mainCategory}/${subCategory}`);
        } else {
            navigate(`/catalog/${mainCategory}`);
        }
        scrollToTop();
    };

    return (
        <nav className={`sticky top-0 flex items-center justify-between px-4 sm:px-6 lg:px-[10%] z-50 p-2 transition-all ${scrolled ? "shadow-md mx-10 bg-white/80 backdrop-blur-[4px]  top-6 rounded-2xl" : ""}`}>
            {/* Logo */}
            <div className="text-xl font-semibold">
                <img
                    onClick={() => {
                        navigate("/home");
                        scrollToTop();
                    }}
                    src="/assets/images/nirmanam logo.svg"
                    className="w-24 md:w-32 cursor-pointer"
                    alt="logo"
                />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-5">
                <ul className="flex space-x-6 lg:space-x-10 text-sm md:text-md text-[#1B3A54] font-medium">
                    <li>
                        <a
                            onClick={() => {
                                navigate("/home")
                                scrollToTop();
                            }}
                            className={`cursor-pointer transition-colors duration-200 ${location.pathname === '/home' ? 'text-Orange' : 'hover:text-Orange'}`}
                        >
                            Home
                        </a>
                    </li>

                    {menuItems.map((item) => (
                        <li
                            key={item.name}
                            className="relative group"
                            onMouseEnter={() => setDesktopSubMenuOpen(item.name)}
                        >
                            <div
                                onClick={() => handleNavigate(item.routePath)}
                                className={`flex items-center cursor-pointer transition-colors duration-200 ${isMenuActive(item) ? 'text-Orange' : 'hover:text-Orange'}`}>
                                {item.name}
                                <RiArrowDownSLine className="ml-1" />
                            </div>

                            {desktopSubMenuOpen === item.name && (
                                <div
                                    className="absolute left-1/2 transform -translate-x-1/2 mt-5 bg-white shadow-xl rounded-xl py-6 px-4 z-20 w-[60vw] max-w-[900px]"
                                    onMouseEnter={() => setDesktopSubMenuOpen(item.name)}
                                    onMouseLeave={() => setDesktopSubMenuOpen(null)}
                                >
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {item.subcategories.map((category, index) => (
                                            <div
                                                onClick={() => handleNavigate(item.routePath, category.route)}
                                                key={index}
                                                className={`shadow cursor-pointer flex items-center space-x-1 p-3 rounded-lg transition-colors duration-200 ${isActiveRoute(item.routePath, category.route) ? 'bg-Orange/20' : 'hover:bg-Orange/20'}`}
                                            >
                                                <div className="text-blue-600 p-2 rounded-md flex-shrink-0">
                                                    <img src={category.icon} className="w-6" alt="" />
                                                </div>
                                                <h4 className="font-semibold">{category.title}</h4>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                    <li>
                        <a
                            // href="/eklg-converter"
                            onClick={() => {
                                navigate("/eklg-converter")
                                scrollToTop();
                            }}
                            className={`cursor-pointer transition-colors duration-200 ${location.pathname === '/eklg-converter' ? 'text-Orange' : 'hover:text-Orange'}`}
                        >
                            EKLG
                        </a>
                    </li>
                    <li>
                        <a
                            href="/home#contactUs"
                            className={`cursor-pointer transition-colors duration-200 ${location.hash === '#contactUs' ? 'text-Orange' : 'hover:text-Orange'}`}
                        >
                            Contact Us
                        </a>
                    </li>
                </ul>

                <a href="/lets-talk" className="border border-Orange text-sm font-semibold text-black px-4 py-1.5 md:px-5 md:py-2 rounded-full hover:bg-Orange/20 transition-colors duration-200">
                    Let's Talk
                </a >
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1 focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <RiCloseLargeFill className="w-6 h-6" />
                    ) : (
                        <MdMenu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-md p-4 z-10 md:hidden flex flex-col items-center gap-4 text-[#1B3A54] font-medium">
                    <ul className="space-y-3 text-center w-full">
                        <li>
                            <a
                                href="/home"
                                className={`block py-2 cursor-pointer transition-colors duration-200 ${location.pathname === '/home' ? 'text-Orange' : 'hover:text-Orange'}`}
                            >
                                Home
                            </a>
                        </li>

                        {menuItems.map((menu) => (
                            <li key={menu.name} className="w-full">
                                <div
                                    className={`block py-2 cursor-pointer transition-colors duration-200 ${isMenuActive(menu) ? 'text-Orange' : 'hover:text-Orange'}`}
                                    onClick={() => toggleMobileSubMenu(menu.name)}
                                >
                                    <div className="flex justify-center items-center">
                                        {menu.name}
                                        <RiArrowDownSLine className="ml-1" />
                                    </div>
                                </div>

                                {mobileSubMenuOpen === menu.name && (
                                    <div className="mt-1 w-full bg-white divide-y divide-gray-100 rounded-lg">
                                        <ul className="py-2 text-sm text-[#1B3A54]">
                                            {menu.subcategories.map((item, index) => (
                                                <li key={index}>
                                                    <a
                                                        href="#"
                                                        className={`block px-4 py-2 transition-colors duration-200 ${isActiveRoute(menu.routePath, item.route) ? 'bg-Orange/20' : 'hover:bg-Orange/20'}`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleNavigate(menu.routePath, item.route);
                                                            setIsOpen(false);
                                                        }}
                                                    >
                                                        {item.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}

                        <li>
                            <a
                                href="/eklg-converter"
                                className={`block py-2 cursor-pointer transition-colors duration-200 ${location.pathname === '/eklg-converter' ? 'text-Orange' : 'hover:text-Orange'}`}
                            >
                                EKLG
                            </a>
                        </li>
                        <li>
                            <a
                                href="#contactUs"
                                className={`block py-2 cursor-pointer transition-colors duration-200 ${location.hash === '#contactUs' ? 'text-Orange' : 'hover:text-Orange'}`}
                            >
                                Contact Us
                            </a>
                        </li>
                    </ul>

                    <a
                        href="/lets-talk"
                        className="border border-Orange text-sm font-semibold text-black px-5 py-2 rounded-full hover:bg-Orange/20 transition-colors duration-200 w-full text-center"
                    >
                        Let's Talk
                    </a>
                </div>
            )}
        </nav>
    );
}

export default Header;