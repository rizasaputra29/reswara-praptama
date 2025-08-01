// components/TransitionProvider.tsx
"use client";

import { AnimatePresence, motion, Variant, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React from 'react';

interface TransitionProviderProps {
  children: React.ReactNode;
}

const TransitionProvider: React.FC<TransitionProviderProps> = ({ children }) => {
  const pathname = usePathname();

  // Varian animasi yang simpel dan elegan
  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      y: 0, // Mulai sedikit di bawah
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0, // Durasi lebih cepat untuk nuansa elegan
      }
    },
    animate: {
      opacity: 1,
      y: 0, // Bergeser ke posisi normal
      transition: {
        type: "tween",
        ease: "easeOut", // Easing yang mulus
        duration: 0, // Durasi sedikit lebih lama untuk saat masuk
      }
    },
    exit: {
      opacity: 0,
      y: 0, // Bergeser sedikit ke atas saat keluar
      transition: {
        type: "tween",
        ease: "easeIn", // Easing yang mulus saat keluar
        duration: 0, // Durasi lebih cepat untuk saat keluar
      }
    },
  };

  return (
    <AnimatePresence mode="sync"> {/* Mode "sync" agar animasi masuk dan keluar berjalan bersamaan */}
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        style={{
          position: "absolute",
          width: "100%",
          height: "100vh", // Memastikan div menutupi seluruh tinggi viewport
          backgroundColor: "#0B3055", // Tetap gunakan background biru gelap saat transisi
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default TransitionProvider;