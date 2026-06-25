"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import AmbientBackground from "./AmbientBackground";
import Cursor from "./Cursor";

// Bot-proof email: base64 encoded dev@themckinleys.ca
const EMAIL_B64 = "ZGV2QHRoZW1ja2lubGV5cy5jYQ==";

function decodeEmail() {
  if (typeof window === "undefined") return "#";
  return "mailto:" + atob(EMAIL_B64);
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// Stagger children animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: EASE_OUT_EXPO },
  },
};

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

// Parallax hook
function useParallax(strength = 10) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 40, stiffness: 80 });
  const springY = useSpring(mouseY, { damping: 40, stiffness: 80 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      mouseX.set(cx * strength);
      mouseY.set(cy * strength);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY, strength]);

  return { x: springX, y: springY };
}

export default function LandingPage() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("#");
  const titleParallax = useParallax(6);
  const subtitleParallax = useParallax(3);
  const btnParallax = useParallax(2);

  useEffect(() => {
    setReady(true);
    setEmail(decodeEmail());
  }, []);

  if (!ready) return null;

  return (
    <>
      <Cursor />
      <AmbientBackground />

      <main className="fixed inset-0 flex flex-col" role="main">
        {/* Name — top left */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.05, ease: "easeOut" }}
          className="absolute top-8 left-10 z-10 select-none"
        >
          <span
            className="text-[11px] tracking-[0.22em] text-[#111111] uppercase font-medium"
            style={{ letterSpacing: "0.22em" }}
          >
            micah mckinley
          </span>
        </motion.header>

        {/* Availability dot — top right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
          className="absolute top-[30px] right-10 z-10 flex items-center gap-2"
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-[6px] h-[6px] rounded-full bg-emerald-500 block"
          />
          <span className="text-[11px] tracking-[0.12em] text-[#6B6B6B] uppercase font-medium">
            Available
          </span>
        </motion.div>

        {/* Hero — center */}
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto"
          >
            {/* Eyebrow */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center gap-3">
                <div className="h-px w-8 bg-[#EAEAEA]" />
                <span className="text-[11px] tracking-[0.25em] text-[#6B6B6B] uppercase font-medium">
                  Developer & Designer
                </span>
                <div className="h-px w-8 bg-[#EAEAEA]" />
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.div
              variants={itemVariants}
              style={{ x: titleParallax.x, y: titleParallax.y }}
            >
              <h1
                className="text-[clamp(2.6rem,6.5vw,5.25rem)] text-[#111111] font-light leading-[1.07] tracking-[-0.03em] mb-7"
                style={{ fontVariantNumeric: "oldstyle-nums" }}
              >
                Digital experiences
                <br />
                <em
                  className="not-italic font-light"
                  style={{
                    background: "linear-gradient(135deg, #111111 0%, #4A5568 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  built to feel effortless.
                </em>
              </h1>
            </motion.div>

            {/* Supporting text */}
            <motion.div
              variants={itemVariants}
              style={{ x: subtitleParallax.x, y: subtitleParallax.y }}
              className="mb-14"
            >
              <p className="text-[17px] text-[#6B6B6B] font-light leading-relaxed tracking-[-0.01em]">
                Precision-crafted interfaces where every detail is earned, not assumed.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={itemVariants}
              style={{ x: btnParallax.x, y: btnParallax.y }}
            >
              <CtaButton href={email} />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom strip */}
        <motion.footer
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-0 right-0 flex justify-between items-end px-10"
        >
          <span className="text-[10px] tracking-[0.18em] text-[#C0C0C0] uppercase">
            © 2025
          </span>
          <div className="flex items-center gap-8">
            <FooterLink href="https://github.com">GitHub</FooterLink>
            <FooterLink href="https://linkedin.com">LinkedIn</FooterLink>
          </div>
        </motion.footer>
      </main>
    </>
  );
}

function CtaButton({ href }: { href: string }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  return (
    <motion.a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
      animate={{
        scale: clicked ? 0.975 : 1,
      }}
      transition={{ duration: 0.12, ease: [0.23, 1, 0.32, 1] }}
      className="relative inline-flex items-center gap-3 px-8 py-[15px] rounded-full select-none no-underline group"
      aria-label="Start a project — email Micah McKinley"
      style={{
        background: hovered
          ? "#111111"
          : "rgba(17,17,17,0.05)",
        border: "1px solid",
        borderColor: hovered ? "transparent" : "rgba(17,17,17,0.12)",
        transition: "background 0.32s cubic-bezier(0.23,1,0.32,1), border-color 0.32s ease, box-shadow 0.32s ease",
        boxShadow: hovered
          ? "0 12px 40px rgba(17,17,17,0.18), 0 2px 8px rgba(17,17,17,0.08)"
          : "0 1px 3px rgba(17,17,17,0.04)",
      }}
      data-hover="true"
    >
      <span
        className="text-[13px] font-medium tracking-[0.06em] uppercase"
        style={{
          color: hovered ? "#FFFFFF" : "#111111",
          transition: "color 0.28s ease",
        }}
      >
        Start a project
      </span>
      <motion.span
        animate={{
          x: hovered ? 3 : 0,
          opacity: hovered ? 1 : 0.4,
        }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="text-[10px]"
        style={{ color: hovered ? "#FFFFFF" : "#111111" }}
        aria-hidden="true"
      >
        →
      </motion.span>
    </motion.a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-[10px] tracking-[0.18em] uppercase no-underline"
      style={{
        color: hovered ? "#111111" : "#C0C0C0",
        transition: "color 0.2s ease",
      }}
      data-hover="true"
    >
      {children}
    </a>
  );
}
