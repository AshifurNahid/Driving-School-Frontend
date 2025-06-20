
import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { useUser } from "@/contexts/UserContext";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";

const ContactPage = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {user ? <RoleBasedNavigation /> : <PublicHeader />}
      <main className="flex-grow">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
