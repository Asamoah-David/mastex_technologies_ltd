"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import * as React from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

/**
 * Reveal-on-scroll wrapper that is resilient by design: it animates when the
 * element scrolls into view, but ALSO guarantees the content becomes visible
 * even if the IntersectionObserver never fires (slow/headless/embedded
 * browsers) and respects prefers-reduced-motion. Content is never left hidden.
 */
function useReveal() {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    if (reduce) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let settled = false;
    const reveal = () => {
      if (!settled) {
        settled = true;
        setShown(true);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          reveal();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    io.observe(el);

    // Safety net — never leave content invisible if the observer doesn't fire.
    const t = window.setTimeout(reveal, 700);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [reduce]);

  return { ref, shown, reduce };
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, shown, reduce } = useReveal();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : "hidden"}
      animate={shown ? "show" : "hidden"}
      variants={fadeUp}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, shown, reduce } = useReveal();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : "hidden"}
      animate={shown ? "show" : "hidden"}
      transition={{ staggerChildren: 0.08 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
