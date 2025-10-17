import { motion } from "framer-motion";

// Micro-interaction for buttons
export const AnimatedButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Micro-interaction for cards
export const AnimatedCard = ({ children, className = "", ...props }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Micro-interaction for list items
export const AnimatedListItem = ({
  children,
  index = 0,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        type: "spring",
        stiffness: 100,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Micro-interaction for inputs
export const AnimatedInput = ({ className = "", ...props }) => {
  return (
    <motion.input
      whileFocus={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      className={className}
      {...props}
    />
  );
};

// Micro-interaction for images
export const AnimatedImage = ({ src, alt, className = "", ...props }) => {
  return (
    <motion.img
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      src={src}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

// A general-purpose fade-in animation
export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay,
        duration,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// A general-purpose slide-in animation
export const SlideIn = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  className = "",
}) => {
  const getPosition = () => {
    switch (direction) {
      case "up":
        return { y: 20 };
      case "down":
        return { y: -20 };
      case "left":
        return { x: -20 };
      case "right":
        return { x: 20 };
      default:
        return { y: 20 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getPosition() }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        delay,
        duration,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
