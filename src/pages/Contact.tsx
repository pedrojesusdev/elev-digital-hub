import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/home/ContactSection";

const Contact = () => {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <div className="pt-24">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
