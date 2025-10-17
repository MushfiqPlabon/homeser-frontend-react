import { motion } from "framer-motion";

const FadeTransition = ({ children, className = "", duration = 0.3 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeTransition;
