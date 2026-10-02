import { useEffect, useState } from "react";

const Preloader = () => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Keep preloader visible for a short, smooth period
    const timer = setTimeout(() => {
      setFadeOut(true);

      // Remove completely after fade animation
      setTimeout(() => {
        setVisible(false);
      }, 500);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">

        {/* DCP Logo */}
        <div className="flex items-center">

          {/* D */}
          <div className="preloader-box preloader-box-1">
            <span>D</span>
          </div>

          {/* C */}
          <div className="preloader-box preloader-box-2">
            <span>C</span>
          </div>

          {/* P */}
          <div className="preloader-box preloader-box-3">
            <span>P</span>
          </div>

        </div>

        {/* Company Name */}
        <div className="mt-5 overflow-hidden">
          <p className="preloader-title">
            Diksha Consulting &amp; Projects
          </p>
        </div>

        {/* Loading Line */}
        <div className="mt-5 h-[3px] w-32 overflow-hidden rounded-full bg-gray-200">
          <div className="preloader-line h-full" />
        </div>

      </div>
    </div>
  );
};

export default Preloader;