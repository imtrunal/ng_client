import React, { useEffect, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf.js";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";
import HoverSwiper from "../common/Slider2";
import { Skeleton } from "@heroui/react";

// 1. ADD THESE CACHE FUNCTIONS AT THE TOP OF THE FILE (right after imports)
const getPdfCache = () => {
  try {
    const cache = localStorage.getItem('pdfCache');
    return cache ? new Map(JSON.parse(cache)) : new Map();
  } catch (e) {
    console.warn("Failed to read PDF cache", e);
    return new Map();
  }
};

const savePdfCache = (cache) => {
  try {
    localStorage.setItem('pdfCache', JSON.stringify(Array.from(cache.entries())));
  } catch (e) {
    console.warn("Failed to save PDF cache", e);
  }
};

const memoryCache = new Map();
const MAX_MEMORY_CACHE_SIZE = 20;
// END OF CACHE FUNCTIONS

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export default function PdfSlider({ pdfUrl, width = 300, scale = 1.5 }) {
  const [canvases, setCanvases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 2. REPLACE YOUR EXISTING renderPdf FUNCTION WITH THIS:
  const renderPdf = useCallback(async (url) => {
    if (!url) return;
    
    // Check memory cache first
    if (memoryCache.has(url)) {
      setCanvases(memoryCache.get(url));
      return;
    }
    
    // Check persistent cache
    const persistentCache = getPdfCache();
    if (persistentCache.has(url)) {
      const cachedData = persistentCache.get(url);
      memoryCache.set(url, cachedData);
      setCanvases(cachedData);
      return;
    }

    setIsLoading(true);
    
    try {
      const doc = await pdfjsLib.getDocument({ 
        url,
        cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/",
        cMapPacked: true,
      }).promise;

      const canvasImages = [];
      const numPages = Math.min(doc.numPages, 5);

      for (let i = 1; i <= numPages; i++) {
        const page = await doc.getPage(i);
        const vp0 = page.getViewport({ scale: 1 });
        const actualScale = (width / vp0.width) * scale;
        const viewport = page.getViewport({ 
          scale: actualScale,
          dpi: 144
        });

        const canvas = document.createElement("canvas");
        const outputScale = 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        const context = canvas.getContext("2d");
        context.scale(outputScale, outputScale);
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
          intent: "display"
        }).promise;

        canvasImages.push(canvas.toDataURL("image/webp", 0.7)); // Changed to webp
      }

      // Store in caches
      memoryCache.set(url, canvasImages);
      if (memoryCache.size > MAX_MEMORY_CACHE_SIZE) {
        memoryCache.delete(memoryCache.keys().next().value);
      }
      
      const persistentCache = getPdfCache();
      persistentCache.set(url, canvasImages);
      savePdfCache(persistentCache);

      setCanvases(canvasImages);
    } catch (error) {
      console.error("PDF rendering error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [width, scale]);

  // 3. KEEP YOUR EXISTING useEffect AND RENDER CODE
  useEffect(() => {
    renderPdf(pdfUrl);
  }, [pdfUrl, renderPdf]);

  if (isLoading) {
    return (
      <Skeleton className="rounded-lg">
        <div className="h-32 rounded-lg bg-default-300" />
      </Skeleton>
    );
  }

  return <HoverSwiper slides={canvases} />;
}