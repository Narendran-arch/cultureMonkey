export default function Badge({ active }) {
  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        active
          ? "bg-blue-100 text-blue-600"
          : "bg-gray-200 text-gray-600"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}
