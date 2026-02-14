import { Building2, UserPlus, SlidersHorizontal } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <Building2 size={20} />,
      step: "STEP 01",
      title: "Create a Company",
      description:
        "Set up your organizational entity with address, metadata, and location auto-mapping.",
    },
    {
      icon: <UserPlus size={20} />,
      step: "STEP 02",
      title: "Add & Assign Users",
      description:
        "Onboard users and assign them to the right company with a single action.",
    },
    {
      icon: <SlidersHorizontal size={20} />,
      step: "STEP 03",
      title: "Manage & Control",
      description:
        "Activate, deactivate, migrate, or restructure — all from one unified view.",
    },
  ];

  return (
    <section className="bg-[#F8FAFC] py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        {/* Label */}
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-600 uppercase mb-4">
          How It Works
        </p>

        {/* Heading */}
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-16">
          Three steps to full control
        </h2>

        {/* Steps */}
        <div className="relative grid gap-12 md:grid-cols-3">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-gray-200"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative text-center px-6">
              {/* Icon Circle */}
              <div className="relative z-10 mx-auto w-16 h-16 flex items-center justify-center rounded-full border-2 border-emerald-400 bg-white text-emerald-600 mb-6">
                {step.icon}
              </div>

              {/* Step Label */}
              <p className="text-xs font-semibold tracking-widest text-emerald-600 mb-2">
                {step.step}
              </p>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
