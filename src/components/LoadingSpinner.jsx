const LoadingSpinner = ({ size = "md", className = "" }) => {
  // Define size classes
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-2",
    xl: "h-16 w-16 border-4",
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <output
      className={`animate-spin rounded-full border-b-2 border-primary-600 ${spinnerSize} ${className}`}
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </output>
  );
};

export default LoadingSpinner;
