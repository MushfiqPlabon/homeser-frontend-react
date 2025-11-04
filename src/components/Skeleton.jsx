const Skeleton = ({
  variant = "text",
  width = "100%",
  height,
  className = "",
  animation = true,
}) => {
  const baseClasses = `bg-gray-200 ${animation ? "animate-pulse" : ""}`;

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  const variantClasses = {
    text: "rounded-md",
    circle: "rounded-full",
    rect: "rounded-xs",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;
