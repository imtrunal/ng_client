import axios from "axios";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { ENV_VAR } from "../../utils/envVariables";


export default function LogoMarquee() {
  const [logos, setLogos] = useState([]);
  const fetchAllCilientLogos = async () => {
    const response = await axios.get(`${ENV_VAR.API_URL}/clients`);
    setLogos(response.data.data);
  };
  useEffect(() => {
    fetchAllCilientLogos();
  }, [])

  if (logos.length === 0) return null;
  
  return (
    <div className="bg-white py-6 mt-6">
      <Marquee gradient={false} speed={50} className="flex items-center">
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo.link}
            alt={`logo-${index}`}
            className="w-24 md:w-36 mx-5 md:mx-10 filter-none md:grayscale hover:filter-none transition-all"
          />
        ))}
      </Marquee>
    </div>
  );
}
