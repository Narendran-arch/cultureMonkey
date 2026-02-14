export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "hover:bg-gray-100",
    danger: "text-red-600 hover:bg-red-50",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
