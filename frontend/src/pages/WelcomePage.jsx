import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero-image.png";
import { NavLink } from "react-router-dom";
export default function WelcomePage() {
   const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#131E33] text-white overflow-hidden">
      {/* Subtle grid / stars background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(64,224,208,0.08),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(64,224,208,0.06),transparent_40%)]" />

      {/* NAVBAR */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-16">
        <div className="flex items-center gap-2 ">
          <div className="w-9  h-9 rounded-lg bg-teal-500 flex items-center justify-center">
            <span className="font-bold text-black">CM</span>
          </div>
          <span className="text-lg font-semibold">CultureMonkey</span>
        </div>
        <NavLink to={"/Dashboard"}>
          <div className="hidden hover:cursor-pointer sm:inline-flex bg-teal-500 text-white px-5 py-2 rounded-full font-medium hover:bg-teal-400 transition">
            Dashboard
          </div>
        </NavLink>
      </header>

      {/* HERO */}
      <section className="relative z-10 flex flex-col lg:flex-row items-center gap-16 px-6 pt-12 pb-20 lg:px-16 lg:pt-24">
        {/* LEFT CONTENT */}
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            ENTERPRISE ADMINISTRATION
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
            Manage your <span className="text-teal-400">companies & team</span>{" "}
            with clarity
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white leading-relaxed">
            One unified workspace to organize companies, assign users, and
            maintain complete control over your organizational structure.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
           
              <div  onClick={() => navigate("/dashboard")} className="inline-flex items-center justify-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-400 transition">
                Go to Dashboard
                <ArrowRight size={18} />
              </div>
           
           
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="flex-1 w-full max-w-xl">
          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#0B1228] to-[#050814] p-4 shadow-[0_0_60px_rgba(0,255,200,0.15)]">
            <img
              src={heroImage}
              alt="Product workflow illustration"
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
