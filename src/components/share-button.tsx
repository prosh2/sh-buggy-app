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
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center space-x-2 px-2 bg-${color}-500 text-white rounded w-[35vw]`}
    >
      {children}
      <span className="text-sm">{label}</span>
    </a>
  );
}
