export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  inputRef,
}) {
  const inputClass = `
    w-full border rounded-lg px-3 py-2 text-sm outline-none transition
    ${
      error
        ? "border-red-500 focus:ring-2 focus:ring-red-500"
        : "focus:ring-2 focus:ring-blue-500"
    }
  `;

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={inputClass}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
