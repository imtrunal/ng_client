import HoverSwiper from "../common/Slider2";
import { Skeleton } from "@heroui/react";
import { useMemo } from "react";

export default function PdfSlider({ totalPages, pdfUrl }) {
  const skeletonHeight = "h-96"; // Ensure this matches what's used in HoverSwiper

  // Memoize the image URLs generation to prevent unnecessary recalculations
  const imageUrls = useMemo(() => {
    if (!pdfUrl || !totalPages) return [];
    
    const baseUrl = pdfUrl.split('/upload/')[0];
    const filePath = pdfUrl.split('/upload/')[1];
    
    return Array.from({ length: totalPages }, (_, i) => {
      return `${baseUrl}/upload/f_webp,fl_awebp,q_auto/pg_${i + 1}/${filePath}`;
    });
  }, [pdfUrl, totalPages]);

  if (!pdfUrl || !totalPages) {
    return (
      <Skeleton className="rounded-lg">
        <div className={`${skeletonHeight} rounded-lg bg-default-300`} />
      </Skeleton>
    );
  }

  return (
    <HoverSwiper
      slides={imageUrls}
      className="w-full h-full"
      slideClassName="w-full h-full"
      autoplayDelay={1000}
      skeletonHeight={skeletonHeight}
      lazyLoad={true} // Enable lazy loading if available in HoverSwiper
    />
  );
}