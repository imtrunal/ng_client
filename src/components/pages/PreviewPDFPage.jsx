import HoverSwiper from "../common/Slider2";
import { Skeleton } from "@heroui/react";

export default function PdfSlider({ totalPages, pdfUrl }) {
  const skeletonHeight = "h-96"; // Ensure this matches what's used in HoverSwiper

  if (!pdfUrl || !totalPages) {
    return (
      <Skeleton className="rounded-lg">
        <div className={`${skeletonHeight} rounded-lg bg-default-300`} />
      </Skeleton>
    );
  }

  const imageUrls = Array.from({ length: totalPages }, (_, i) => {
    const page = i + 1;
    const transformation = `f_webp,fl_awebp,q_auto/pg_${page}`;
    return pdfUrl.replace('/upload/', `/upload/${transformation}/`);
  });

  return (
    <HoverSwiper
      slides={imageUrls}
      className="w-full h-full"
      slideClassName="w-full h-full"
      autoplayDelay={1000}
      skeletonHeight={skeletonHeight} 
    />
  );
}
