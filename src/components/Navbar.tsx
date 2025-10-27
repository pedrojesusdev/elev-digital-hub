import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Elev Business
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                isActive("/") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Início
            </Link>
            <Link
              to="/lead"
              className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                isActive("/lead") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Contato
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Área Administrativa
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-3 animate-fade-in">
            <Link
              to="/"
              className="block text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/lead"
              className="block text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                Área Administrativa
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
