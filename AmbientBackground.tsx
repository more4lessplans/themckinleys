"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function AmbientBackground() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { damping: 50, stiffness: 60, mass: 1.5 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 60, mass: 1.5 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Base */}
      <div className="absolute inset-0 bg-[#FAFAFA]" />

      {/* Primary orb — follows mouse subtly */}
      <motion.div
        style={{
          x: springX,
          y: springY,
        }}
        className="absolute"
        aria-hidden="true"
      >
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.55, 0.65, 0.55],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "min(70vw, 700px)",
            height: "min(70vw, 700px)",
            translate: "-50% -50%",
            background:
              "radial-gradient(ellipse at center, rgba(218, 225, 255, 0.7) 0%, rgba(245, 247, 255, 0.3) 50%, transparent 75%)",
          }}
          className="rounded-full"
        />
      </motion.div>

      {/* Secondary orb — opposite drift */}
      <motion.div
        animate={{
          x: ["58vw", "62vw", "56vw", "60vw"],
          y: ["20vh", "24vh", "18vh", "22vh"],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
        style={{
          width: "min(45vw, 480px)",
          height: "min(45vw, 480px)",
          background:
            "radial-gradient(ellipse at center, rgba(220, 240, 255, 0.5) 0%, transparent 70%)",
        }}
        className="absolute rounded-full"
      />

      {/* Tertiary accent — bottom */}
      <motion.div
        animate={{
          x: ["15vw", "20vw", "12vw"],
          y: ["68vh", "72vh", "65vh"],
          scale: [1, 1.12, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
        style={{
          width: "min(35vw, 350px)",
          height: "min(35vw, 350px)",
          background:
            "radial-gradient(ellipse at center, rgba(232, 220, 255, 0.35) 0%, transparent 65%)",
        }}
        className="absolute rounded-full"
      />

      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  );
}
