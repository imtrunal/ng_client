import React from "react";

const ScrollLink = (props) => {
    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // smooth scrolling
        });
    };

    return (
        <a href="#" onClick={handleScrollToTop} {...props}>
            Scroll to Top
        </a>
    );
};

export default ScrollLink;
