import { MultiStepContactForm } from "@/components/MultiStepContactForm";
import { useNavigate } from "react-router-dom";

const ContactMultiStep = () => {
  const navigate = useNavigate();

  return (
    <MultiStepContactForm onClose={() => navigate("/")} />
  );
};

export default ContactMultiStep;
