import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RocketLaunchButton = () => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <a
      onClickCapture={handleClick}
      className="m-3 relative inline-flex items-center justify-center w-full max-w-[18rem] h-14 sm:h-16 bg-Orange text-white rounded-md overflow-hidden font-semibold group cursor-pointer"
    >
      <span className="relative z-10 transition-opacity duration-700">
        Let's Begin
      </span>

      <img
        src="/assets/images/caret_2.png"
        alt="rocket"
        className="absolute w-16 h-16 z-20 left-0 bottom-0 transform transition-transform duration-1000 ease-linear group-hover:translate-x-[220px]"
      />
    </a>
  );
};

export default RocketLaunchButton;


