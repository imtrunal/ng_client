// // src/components/PdfPreview.jsx
// import React, { useRef, useEffect } from "react";
// // import the ES module build of pdf.js
// import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
// // tell Vite to emit the worker file and give you its URL
// import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// // point pdf.js at its worker
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// export default function PdfPreview({
//   pdfUrl,
//   width = 300,   // desired width of the preview
//   scale = 1.5,   // rendering scale
// }) {
//   const canvasRef = useRef();

//   useEffect(() => {
//     if (!pdfUrl) return;
//     let cancelled = false;

//     const render = async () => {
//       try {
//         // load PDF
//         const pdf = await pdfjsLib.getDocument({ url: pdfUrl }).promise;
//         const page = await pdf.getPage(1);

//         // figure out correct scale so width matches prop
//         const viewport0 = page.getViewport({ scale: 1 });
//         const actualScale = (width / viewport0.width) * scale;
//         const viewport = page.getViewport({ scale: actualScale });

//         // size canvas
//         const canvas = canvasRef.current;
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;
//         const ctx = canvas.getContext("2d");

//         // render page
//         await page.render({ canvasContext: ctx, viewport }).promise;
//       } catch (err) {
//         console.error("PDF render error:", err);
//       }
//     };

//     render();

//     return () => {
//       cancelled = true;
//     };
//   }, [pdfUrl, width, scale]);

//   return (
//     <canvas
//     className="w-full"
//       ref={canvasRef}
//     />
//   );
// }

// src/components/PdfPreview.jsx
import React, { useRef, useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// point pdf.js at its worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export default function PdfPreview({
  pdfUrl,
  width = 300,        // width of the preview in px
  scale = 1.5,        // base scale factor
  hoverInterval = 800 // ms between auto‑slides
}) {
  const canvasRef = useRef();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const intervalRef = useRef();

  // load PDF doc on url change
  useEffect(() => {
    if (!pdfUrl) return;

    let cancelled = false;
    pdfjsLib
      .getDocument({ url: pdfUrl })
      .promise.then((doc) => {
        if (cancelled) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setPageNum(1);
      })
      .catch((err) => console.error(err));

    return () => {
      cancelled = true;
      clearInterval(intervalRef.current);
    };
  }, [pdfUrl]);

  // whenever pageNum changes, re‑render that page
  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;

    pdfDoc.getPage(pageNum).then((page) => {
      if (cancelled) return;
      // compute scale so width matches prop
      const vp0 = page.getViewport({ scale: 1 });
      const actualScale = (width / vp0.width) * scale;
      const viewport = page.getViewport({ scale: actualScale });

      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");

      page.render({ canvasContext: ctx, viewport }).promise.catch(console.error);
    });

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, pageNum, width, scale]);

  // start cycling on hover
  const handleMouseEnter = () => {
    if (numPages < 2) return;
    clearInterval(intervalRef.current);
    let next = 2;
    intervalRef.current = setInterval(() => {
      setPageNum((prev) => {
        const val = next;
        next = next === numPages ? 2 : next + 1;
        return val;
      });
    }, hoverInterval);
  };

  // stop cycling on leave
  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
    setPageNum(1);
  };

  return (
    <div
      className="inline-block"
      style={{ width }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        className="block w-full"
        style={{ border: "1px solid #ddd" }}
      />
    </div>
  );
}
