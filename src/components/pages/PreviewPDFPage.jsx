import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf.js";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "../common/swiper.css";
import { Skeleton } from "@heroui/react";
import HoverSwiper from "../common/Slider2";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export default function PdfSlider({ pdfUrl, width = 300, scale = 1.5 }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [canvases, setCanvases] = useState([]);

  useEffect(() => {
    if (!pdfUrl) return;
    
    let cancelled = false;

    pdfjsLib
      .getDocument({ 
        url: pdfUrl,
        cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/",
        cMapPacked: true,
      })
      .promise.then((doc) => {
        if (cancelled) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdfDoc || numPages === 0) return;

    let cancelled = false;

    const renderAllPages = async () => {
      const canvasImages = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const vp0 = page.getViewport({ scale: 1 });
        const actualScale = (width / vp0.width) * scale;
        const viewport = page.getViewport({ 
          scale: actualScale,
          dpi: 300 
        });

        // Create canvas with higher resolution
        const canvas = document.createElement("canvas");
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        const context = canvas.getContext("2d");
        context.scale(outputScale, outputScale);
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          intent: "display",
          imageLayer: true,
          enableWebGL: true,
        };

        await page.render(renderContext).promise;

        // Use PNG format for better quality
        canvasImages.push(canvas.toDataURL("image/png", 1.0));
      }

      if (!cancelled) {
        setCanvases(canvasImages);
      }
    };

    renderAllPages();

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, numPages, width, scale]);


  return (
    <HoverSwiper slides={canvases}/>
    // <div
    //   className="w-full"
    //   ref={containerRef}
    //   onMouseEnter={handleMouseEnter}
    //   onMouseLeave={handleMouseLeave}
    // >
    //   {canvases.length > 0 ? (
    //     <Swiper
    //       className="mySwiper"
    //       slidesPerView={1}
    //       loop={false}
    //       autoplay={{
    //         delay: 1000,
    //         disableOnInteraction: false,
    //       }}
    //       modules={[Autoplay]}
    //       onSwiper={(swiper) => {
    //         swiperRef.current = swiper;
    //         swiper.autoplay.stop();
    //       }}
    //       allowTouchMove={false}
    //     >
    //       {canvases.map((dataUrl, index) => (
    //         <SwiperSlide key={index}>
    //           <img
    //             src={dataUrl}
    //             alt={`PDF Page ${index + 1}`}
    //             className="w-full"
    //             style={{
    //               imageRendering: "crisp-edges", 
    //             }}
    //           />
    //         </SwiperSlide>
    //       ))}
    //     </Swiper>
    //   ) : (
    //     <Skeleton className="rounded-lg">
    //       <div className="h-32 rounded-lg bg-default-300" />
    //     </Skeleton>
    //   )}
    // </div>
  );
}