import { motion } from "framer-motion";
import {
  ReactNode,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// written mostly by chatgpt, so cool
export default function UnderlineContainer({
  itemRefs,
  selectedItem,
  children,
}: {
  itemRefs: RefObject<Record<string, HTMLButtonElement | null>>;
  selectedItem: string;
  children: ReactNode;
}) {
  const [underline, setUnderline] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null); // the scrollable element
  const rafRef = useRef<number | null>(null);

  const updateUnderline = () => {
    const container = containerRef.current;
    const scroll = scrollRef.current;
    const node = selectedItem ? itemRefs.current[selectedItem] : null;
    if (!container || !scroll || !node) return;

    // measure rects in viewport and compute left relative to wrapper
    const containerRect = container.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();

    const left = nodeRect.left - containerRect.left;
    const width = nodeRect.width;

    setUnderline({ left, width });
  };

  // keep updating while user scrolls and on resize or element size changes
  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateUnderline);
    };

    const ro = new ResizeObserver(() => {
      // re-measure if sizes change
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateUnderline);
    });
    scroll.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // observe scroll container, wrapper, and items
    ro.observe(scroll);
    if (containerRef.current) ro.observe(containerRef.current);
    Object.values(itemRefs.current).forEach((el) => el && ro.observe(el));

    // cleanup
    return () => {
      scroll.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [selectedItem]);

  useLayoutEffect(() => {
    updateUnderline();
  }, [selectedItem]);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto no-scrollbar">
        {children}
      </div>
      <motion.div
        layout
        transition={{
          duration: 0.1,
          type: "spring",
          stiffness: 800,
          damping: 40,
        }}
        style={{
          position: "relative",
          bottom: 0,
          left: underline.left,
          width: underline.width,
          height: 3,
          borderRadius: 2,
          backgroundColor: "#ffffffff",
        }}
      />
    </div>
  );
}
