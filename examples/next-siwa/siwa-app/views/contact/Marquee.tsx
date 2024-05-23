import { motion } from "framer-motion";
import styles from "./index.module.css"

const logoVariant = {
  hidden: { x: "0%" }, // Adjust this value to change the starting position
  visible: {
    x: "-100%",
    transition: {
      ease: "linear",
      duration: 50,
      repeat: Infinity,
    },
  },
};

export const Marquee = ({ children }) => (
  <div className={styles.marquee}>
    <motion.div
     className={styles.marqueeTrack}
      variants={logoVariant}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.marqueeContentWrapper}>
        {children}
      </div>
    </motion.div>
  </div>
);
