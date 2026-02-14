import { Building2, Users, Repeat, MapPin } from "lucide-react";

export default function CoreCapabilitiesSection() {
  const features = [
    {
      icon: <Building2 size={20} />,
      title: "Company Management",
      description:
        "Create, organize, and maintain company profiles with structured address and metadata.",
    },
    {
      icon: <Users size={20} />,
      title: "User Lifecycle",
      description:
        "Add, activate, deactivate, or remove users with full control over their status.",
    },
    {
      icon: <Repeat size={20} />,
      title: "User Migration",
      description:
        "Seamlessly move users between companies without data loss or duplication.",
    },
    {
      icon: <MapPin size={20} />,
      title: "Location Mapping",
      description:
        "Auto-resolve company addresses to coordinates for visual geographic context.",
    },
  ];

  return (
    <section className="bg-[#F8FAFC] py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        {/* Small Label */}
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-600 uppercase mb-4">
          Core Capabilities
        </p>

        {/* Heading */}
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-12">
          Everything you need to manage at scale
        </h2>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-6 text-left shadow-sm hover:shadow-md transition duration-300"
            >
              {/* Icon */}
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-5">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
