import React, { useEffect } from "react";
const CarouselMovie = () => {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
            "https://triple-slider.uiinitiative.com/assets/index.000c16e0.css";
        document.head.appendChild(link);
        const preloadLink = document.createElement("link");
        preloadLink.rel = "modulepreload";
        preloadLink.href =
            "https://triple-slider.uiinitiative.com/assets/vendor.3d228fec.js";
        document.head.appendChild(preloadLink);

        const script = document.createElement("script");
        script.type = "module";
        script.crossOrigin = "anonymous";
        script.src =
            "https://triple-slider.uiinitiative.com/assets/index.3ea0cc48.js";
        document.body.appendChild(script);
        const style = document.createElement("style");
        style.innerHTML = `
        .triple-slider-next {
            z-index: -1 !important;
        }
    `;
        document.head.appendChild(style);

        // Cleanup script and links on unmount
        return () => {
            document.head.removeChild(link);
            document.head.removeChild(preloadLink);
            document.body.removeChild(script);
            document.head.removeChild(style);
        };
    }, []);
    const listBanner = [
        "https://cdn.galaxycine.vn/media/2025/8/8/thanh-guom-diet-quy-vo-han-thanh-3_1754666535959.jpg",
        "https://cdn.galaxycine.vn/media/2025/8/8/chot-don-2_1754638315130.jpg",
        "https://cdn.galaxycine.vn/media/2025/8/6/zombie-cung-2048_1754454733363.jpg",
        "https://cdn.galaxycine.vn/media/2025/7/21/mang-me-di-bo-2048_1753070307369.jpg"
    ]
    return (
        <>
            <div id="app">
                {/* Triple slider */}
                <div className="triple-slider">
                    <div className="swiper triple-slider-main">
                        <div className="swiper-wrapper">
                            {listBanner.map((src, index) => (
                                <div className="swiper-slide" key={index}>
                                    <img className="bg-image" src={src} alt="" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CarouselMovie


