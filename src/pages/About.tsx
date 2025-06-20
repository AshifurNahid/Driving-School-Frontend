
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import { useUser } from "@/contexts/UserContext";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";

const AboutPage = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {user ? <RoleBasedNavigation /> : <PublicHeader />}
      <main className="flex-grow">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
