import React, { useState } from "react";
import axios from "axios";
import { ENV_VAR } from '../utils/envVariables';

const EKLGPage = () => {
    const [uniqueText, setuniqueText] = useState("");
    const [EKLG17Text, setEKLG17Text] = useState([]);
    // Function to handle transliteration on spacebar press
    const handleKeyPress = async (event) => {
        if (event.key === " " || event.key === "Enter") {
            event.preventDefault(); // Prevents default behavior (e.g., new line on Enter)

            let words = uniqueText.trim().split(" ");
            let lastWord = words[words.length - 1];

            if (!lastWord) return;

            try {
                let response = await axios.get(`${ENV_VAR.API_URL}/transliterate?text=${lastWord}`);
                let data = await response.data.data;
                console.log(data);

                if (data) {
                    words[words.length - 1] = data;
                    let updatedText = words.join(" ") + (event.key === " " ? " " : ""); // Add space only if Space was pressed
                    setuniqueText(updatedText);
                }
            } catch (error) {
                console.error("Translation error:", error);
            }
        }
    };

    const handleEKLG17Convert = async () => {
        try {
            const response = await axios.post(`${ENV_VAR.API_URL}/eklg17-convert`, {
                text: uniqueText,
            });
            setEKLG17Text(response.data.data);
        } catch (error) {
            console.error("Conversion error:", error);
            setEKLG17Text("Conversion failed");
        }
    };
    const handleUniqueConvert = async () => {
        try {
            const response = await axios.post(`${ENV_VAR.API_URL}/unique-convert`, {
                text: EKLG17Text,
            });
            setuniqueText(response.data.data);
        } catch (error) {
            console.error("Conversion error:", error);
            setuniqueText("Conversion failed");
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen px-4 md:px-8 -mb-5 mt-10 md:mt-0">
            <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl mb-10 md:mb-0">

                <div className="flex-1 bg-white rounded-lg shadow-lg">
                    <div className="bg-Orange text-white px-4 py-2 rounded-t-lg flex justify-between items-center">
                        <span className="font-semibold">Gujarati</span>
                        <select className="bg-white text-black px-2 py-1 rounded">
                            <option>Unicode</option>
                        </select>
                        <span className="font-semibold">Text</span>
                    </div>
                    <textarea
                        className="w-full h-112.5 p-3 border rounded-b-lg focus:outline-none text-lg resize-none"
                        placeholder="Type here..."
                        value={uniqueText}
                        onChange={(e) => setuniqueText(e.target.value)}
                        onKeyDown={handleKeyPress}
                    ></textarea>
                </div>

                <div className="flex md:flex-col flex-row gap-6 items-center justify-center">
                    <button
                        className="bg-Orange text-white px-4 py-3 rounded-lg shadow-lg"
                        onClick={handleEKLG17Convert}
                    >
                        →
                    </button>
                    <button
                        className="bg-Orange text-white px-4 py-3 rounded-lg shadow-lg"
                        onClick={handleUniqueConvert}
                    >
                        ←
                    </button>
                </div>

                <div className="flex-1 bg-white rounded-lg shadow-lg">
                    <div className="bg-Orange text-white px-4 py-2 rounded-t-lg flex justify-between items-center">
                        <span className="font-semibold">Gujarati</span>
                        <select className="bg-white text-black px-2 py-1 rounded">
                            <option>EKLG 17</option>
                        </select>
                        <span className="font-semibold">Text</span>
                    </div>
                    <textarea
                        className="w-full h-112.5 p-3 border rounded-b-lg focus:outline-none text-lg resize-none"
                        placeholder="Type here..."
                        value={EKLG17Text}
                        onChange={(e) => setEKLG17Text(e.target.value)}
                    ></textarea>
                </div>

            </div>
        </div>

    );
};

export default EKLGPage;
