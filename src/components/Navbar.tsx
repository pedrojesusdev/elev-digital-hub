import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md text-foreground border-b border-border shadow-lg transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight hover:text-primary transition-all duration-300 hover:scale-105">
            Elev Business
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#sobre"
              className={`hover:text-foreground transition-all duration-300 hover:scale-110 text-muted-foreground ${
                location.pathname === "/" ? "" : "hidden"
              }`}
            >
              Sobre Nós
            </a>
            <a
              href="#servicos"
              className={`hover:text-foreground transition-all duration-300 hover:scale-110 text-muted-foreground ${
                location.pathname === "/" ? "" : "hidden"
              }`}
            >
              Serviços
            </a>
            <Link
              to="/contact"
              className="hover:text-foreground transition-all duration-300 hover:scale-110 text-muted-foreground"
            >
              Contato
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 border border-foreground rounded hover:bg-foreground hover:text-background transition-all duration-300 hover:scale-105"
            >
              Área Administrativa
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden hover:text-muted-foreground transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 animate-fade-in">
            <a
              href="#sobre"
              className={`hover:text-muted-foreground transition-colors ${
                location.pathname === "/" ? "" : "hidden"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre Nós
            </a>
            <a
              href="#servicos"
              className={`hover:text-muted-foreground transition-colors ${
                location.pathname === "/" ? "" : "hidden"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Serviços
            </a>
            <Link
              to="/contact"
              className="hover:text-foreground transition-all duration-300 text-muted-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            <Link
              to="/login"
              className="hover:text-muted-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Área Administrativa
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
