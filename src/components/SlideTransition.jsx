import { motion } from "framer-motion";

const SlideTransition = ({ children, direction = "left", className = "" }) => {
  const variants = {
    hidden: {
      x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
      y: direction === "up" ? -100 : direction === "down" ? 100 : 0,
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    exit: {
      x: direction === "left" ? -50 : direction === "right" ? 50 : 0,
      y: direction === "up" ? -50 : direction === "down" ? 50 : 0,
      opacity: 0,
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SlideTransition;
