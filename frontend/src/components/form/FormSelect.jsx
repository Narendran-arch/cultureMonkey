export default function FormSelect({
  label,
  name,
  value,
  onChange,
  error,
  inputRef,
  options = [],
  placeholder = "Select option",
}) {
  const selectClass = `
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
      <select
        ref={inputRef}
        name={name}
        value={value}
        onChange={onChange}
        className={selectClass}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
