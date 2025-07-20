"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "lucide-react";

const ScrollTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleScrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    return (
        <button onClick={handleScrollTop} className={isVisible ? "fixed bottom-5 right-5 z-50 p-2 bg-gray-700/50 backdrop-blur-md rounded-full hover:bg-gray-700/70 transition-all duration-300" : "hidden"}>
            <ArrowUpIcon className="w-6 h-6" />
        </button>
    );
};

export default ScrollTopButton;