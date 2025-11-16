import { motion } from "motion/react";
export default function ShareButton({
  url,
  children,
  label,
  color,
}: {
  url: string;
  children?: React.ReactNode;
  label?: string;
  color?: string;
}) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center px-2 text-white rounded w-[150px] h-10`}
      style={{ backgroundColor: `${color}` }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
    >
      {children}
      <i className="bi text-sm font-sans">{label}</i>
    </motion.a>
  );
}
