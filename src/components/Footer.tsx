import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Elev Business</h3>
            <p className="text-sm opacity-80">
              Elevando sua empresa com tecnologia
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              to="/contact"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              Contato
            </Link>
            <Link
              to="/login"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              Área Administrativa
            </Link>
            <Link
              to="/politica-privacidade"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              Política de Privacidade
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-foreground/20 text-center text-sm opacity-60">
          © {new Date().getFullYear()} Elev Business. Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
