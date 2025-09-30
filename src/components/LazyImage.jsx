import { useEffect, useRef, useState } from "react";
import { optimizeCloudinaryUrl } from "../utils/shared/uiComponents";

const LazyImage = ({
  src,
  alt,
  className,
  placeholderColor = "bg-gray-200",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef();

  useEffect(() => {
    if (src) {
      // Create an Intersection Observer to lazy load images
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Optimize the image URL if it's from Cloudinary
              const optimizedSrc = optimizeCloudinaryUrl(src);

              const img = new Image();

              img.src = optimizedSrc;
              img.onload = () => {
                setIsLoaded(true);
                setIsLoading(false);
              };
              img.onerror = () => {
                setIsLoading(false);
              };

              // Stop observing this element
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "50px", // Load images when they're 50px away from viewport
        },
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      // Cleanup observer on unmount
      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    } else {
      setIsLoading(false);
    }
  }, [src]);

  // Use optimized URL for display
  const displaySrc = optimizeCloudinaryUrl(src);

  return (
    <div
      ref={imgRef}
      className={`${className} relative overflow-hidden ${placeholderColor}`}
    >
      {isLoading && (
        <div className={`absolute inset-0 ${placeholderColor} animate-pulse`} />
      )}
      {isLoaded && (
        <img
          src={displaySrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

export default LazyImage;
