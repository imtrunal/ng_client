import React from "react";
import Marquee from "react-fast-marquee";

const logos = Array.from({ length: 24 }, (_, i) => `/assets/images/client logo/c${i + 1}.png`);

export default function LogoMarquee() {
  return (
    <div className="bg-white py-6 mt-6">
      <Marquee gradient={false} speed={50} className="flex items-center">
        {logos.concat(logos).map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`logo-${index}`}
            className="w-24 md:w-36 mx-5 md:mx-10 filter-none md:grayscale hover:filter-none transition-all"
          />
        ))}
      </Marquee>
    </div>
  );
}
