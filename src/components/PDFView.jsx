import React, { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import { Spinner } from "@heroui/react";
import { useLocation } from "react-router-dom";
import { MdDoNotDisturb } from "react-icons/md";
import { ENV_VAR } from "../utils/envVariables";
import axios from "axios";

const PdfViewer = ({ pdfurl = "" }) => {
    const [pdfUrl, setPdfUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(window.location.search);
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            transformToolbarSlot: (toolbarSlot) => {
                const { Download, Print, ...remainingSlots } = toolbarSlot;
                return remainingSlots;
            },
        },
        // sidebarTabs: (defaultTabs) => defaultTabs,
        // initialTabIndex: 0,
    });

    const getPDF = async () => {
        setLoading(true);
        const getFullUrl = await axios.get(`${ENV_VAR.API_URL}/pdfs/get-url/${pdfurl || queryParams.get('pdf') || location.state?.pdfUrl || JSON.parse(localStorage.getItem("pdfUrl"))}`);
        const data = await getFullUrl.data;
        setPdfUrl(data.data.url);
        setLoading(false);
    }

    useEffect(() => {
        getPDF();
    }, []);

    const updateScale = () => {
        const width = window.innerWidth;
        if (width < 600) {
            return "PageWidth";
        } else if (width < 900) {
            return 0.75;
        } else {
            return 1.5;
        }
    };

    return (
        <div
            className="h-screen flex border-2 justify-center items-center"
        >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                {loading ? (
                    <div className="flex flex-col items-center justify-center">
                        <p className="font-bold">Loading File...</p>
                    </div>
                ) : pdfUrl ? (
                    <Viewer
                        fileUrl={ENV_VAR.API_URL + pdfUrl}
                        plugins={[defaultLayoutPluginInstance]}
                        defaultScale={"PageWidth"}
                    />
                ) : (
                    <p className="flex flex-col text-center items-center gap-1">
                        <MdDoNotDisturb className="text-[#D22B2B] text-3xl" />
                        No PDF file found.
                    </p>
                )}
            </Worker>
        </div>
    );
};

export default PdfViewer;