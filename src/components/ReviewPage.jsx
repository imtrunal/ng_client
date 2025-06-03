import React, { useState } from "react";
import { toast } from "sonner";
import { FaStar } from "react-icons/fa";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion } from 'framer-motion';
import { prompt } from "../utils/Prompt";
import { MdClose } from "react-icons/md";

const Review = ({ close, rated }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GENAI_KEY);
    const googleReviewLink =
        "https://search.google.com/local/writereview?placeid=ChIJvW3ktCtP4DsR9jpy1Xhm6gA";

    const progressWidth = (rating / 5) * 100 || 0;
    const progressColor = rating >= 4 ? "bg-green-500" : rating === 3 ? "bg-yellow-500" : "bg-red-500";

    const textMap = ["Bad", "Poor", "Average", "Good", "Excellent"];
    const selectedText = rating > 0 ? textMap[rating - 1] : "Nothing";

    const copyToClipboard = async (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }

        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
    };

    const handleSubmit = async () => {
        if (rating === 0 || review.trim() === "") {
            toast.error("Please provide a rating and review before submitting.");
            return;
        }

        try {
            await copyToClipboard(review);
            toast.success("Review copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy review.");
            console.error("Clipboard error:", error);
        }
        setTimeout(() => {
            toast.info("Redirecting to Google Review...");
            setTimeout(() => {
                window.open(googleReviewLink, "_blank");
            }, 1500);
        }, 1000);
        rated();
    };

    const generateReview = async () => {
        setLoading(true);
        if (rating === 0) return;
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent(prompt(rating < 3 ? 3 : rating));
            const response = result.response;
            const text = response.text();
            setReview(text);
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            console.log(error)
            console.log("Something Went Wrong");
        }
    }

    return (
        // <div className="w-full bg-[#1B3A54] flex min-h-max justify-center px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="relative w-10/12 sm:w-8/12 md:w-6/12 lg:w-4/12 max-w-screen-xl bg-white shadow-lg rounded-lg p-6 md:p-8 flex flex-col gap-6">

            <button className="absolute top-2 right-2" onClick={close}>
                <MdClose fontSize={20} />
            </button>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${progressColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressWidth}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>

            <div className="flex flex-col gap-6 w-full">
                <div className="w-full text-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">How would you rate our services?</h3>
                    <img src={`/assets/gif/emoji_2_${rating}.gif`} className="w-20 h-20 mx-auto" />
                    <p className="text-gray-600">{selectedText}</p>
                    <div className="flex gap-3 justify-center text-4xl my-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`cursor-pointer transition-transform duration-200 ${star <= rating ? "text-yellow-400 scale-125" : "text-gray-300"}`}
                                onClick={() => setRating(star)}
                            >
                                <FaStar />
                            </span>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <textarea
                        className="w-full h-36 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                        placeholder="Write your review here or generate..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    ></textarea>
                    <div className="flex gap-2 mt-4 flex-col md:flex-row">
                        <button
                            className={`w-full py-2 rounded-md transition ${review === "" || rating === 0 ? 'bg-gray-400 text-white' : 'bg-[#1B3A54] text-white hover:bg-[#19486e]'}`}
                            onClick={handleSubmit}
                            disabled={review === "" || rating === 0}
                        >
                            Send Google Review
                        </button>
                        <button
                            className={`w-full py-2 rounded-md transition ${rating === 0 ? 'bg-gray-400 text-white' : 'bg-[#1B3A54] text-white hover:bg-[#19486e]'}`}
                            onClick={generateReview}
                            disabled={rating === 0}
                        >
                            {loading ? 'Generating...' : 'Generate Review'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Review;
