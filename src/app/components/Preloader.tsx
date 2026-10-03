import { useEffect, useState } from "react";
import logo from "../../imports/iptm-nepal_logo.webp";

const Preloader = () => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let removeTimer: ReturnType<typeof setTimeout> | undefined;

    // Keep preloader visible for a short, smooth period
    const timer = setTimeout(() => {
      setFadeOut(true);

      // Remove completely after fade animation
      removeTimer = setTimeout(() => {
        setVisible(false);
      }, 500);
    }, 1600);

    return () => {
      clearTimeout(timer);
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading IPTM Nepal"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">
        {/* IPTM Nepal Logo */}
        <div className="iptm-logo-wrap">
          <span className="iptm-logo-halo" aria-hidden="true" />
          <img
            src={logo}
            alt="IPTM Nepal"
            className="iptm-logo h-28 w-28 rounded-2xl object-cover sm:h-32 sm:w-32"
            draggable={false}
          />
        </div>

        {/* Loading Line */}
        <div className="mt-7 h-[3px] w-32 overflow-hidden rounded-full bg-gray-200">
          <div className="preloader-line h-full" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;