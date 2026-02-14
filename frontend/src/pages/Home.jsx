import CoreCapabilitiesSection from "./CoreCapabilitiesSection";
import CTASection from "./CTASection";
import HowItWorksSection from "./HowItWorksSection";
import WelcomePage from "./WelcomePage";

const Home = () => {
  return (
    <div>
      <WelcomePage />
      <CoreCapabilitiesSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
};

export default Home;
