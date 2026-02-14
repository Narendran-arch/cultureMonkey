export default function StatCard({ icon, value, label, valueColor }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
      {/* Icon */}
      <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
        {icon}
      </div>

      {/* Content */}
      <div>
        <div className="text-4xl font-semibold text-gray-900">
          {value}
        </div>
        <div
          className={`text-sm font-medium ${
            valueColor ?? "text-gray-500"
          }`}
        >
          {label}
        </div>
      </div>
    </div>
  );
}