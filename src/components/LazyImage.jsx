import { useEffect, useRef, useState } from "react";

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
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
      };
      img.onerror = () => {
        setIsLoading(false);
      };
    } else {
      setIsLoading(false);
    }
  }, [src]);

  return (
    <div
      className={`${className} relative overflow-hidden ${placeholderColor}`}
    >
      {isLoading && (
        <div className={`absolute inset-0 ${placeholderColor} animate-pulse`} />
      )}
      {isLoaded && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;
