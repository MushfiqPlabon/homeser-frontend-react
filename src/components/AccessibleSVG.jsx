const AccessibleSVG = ({
  children,
  title,
  className = "",
  role = "img",
  ariaLabel,
  ...props
}) => {
  // Generate a unique ID for the title element
  const titleId = `svg-title-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      className={className}
      role={role}
      aria-labelledby={titleId}
      aria-label={ariaLabel}
      {...props}
    >
      <title id={titleId}>{title}</title>
      {children}
    </svg>
  );
};

export default AccessibleSVG;
