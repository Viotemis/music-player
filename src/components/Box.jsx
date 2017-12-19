import React from "react";
import { motion } from 'framer-motion';

export default function Box({ children, className = "", title, ...props }) {
  return (
    <motion.div className={"px-6 bg-white rounded-2xl box-shadow-lg transition-all duration-300 " + className} {...props}>
      {title && (
        <div className="py-6 text-xl font-bold">
          {title}
        </div>
      )}
      {children}
    </motion.div>
  );
}