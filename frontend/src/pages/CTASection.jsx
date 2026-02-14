import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] py-24 px-6 md:px-12 lg:px-20 text-center text-white overflow-hidden">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl md:text-4xl font-semibold mb-6">
          Ready to take control?
        </h2>

        {/* Subtext */}
        <p className="text-base md:text-lg text-gray-300 mb-10 leading-relaxed">
          Your companies and users are waiting. Start managing your
          organizational structure in one place.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Primary Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 transition px-6 py-3 rounded-xl text-sm font-medium shadow-lg shadow-emerald-500/20"
          >
            Open Dashboard
            <ArrowRight size={16} />
          </button>

          {/* Secondary Button */}
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="px-6 py-3 rounded-xl text-sm font-medium border border-gray-500 text-gray-200 hover:bg-white/10 transition"
          >
            scroll up
          </button>
        </div>
      </div>
    </section>
  );
}
