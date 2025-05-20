export const prompt = (rating) => `Write a review for the Graphics company, Write ${rating}/5 star review. 50 words review for the Google Review. make sure to give result in plaintext not markdown. and remove extra text like "Okay, here's a 3-star Google review:",just give direct review text only`;

// utils/pdfUtils.js
export const getFirstPagePreviewUrl = (pdfUrl) => {
  // For Cloudinary PDFs, we can use their transformation API
  if (pdfUrl.includes('res.cloudinary.com')) {
    // Insert transformation to get first page as image
    return pdfUrl.replace('/upload/', '/upload/pg_1/');
  }
  // Fallback for non-Cloudinary PDFs (would need a different solution)
  return pdfUrl;
};