const AboutSection = () => {
  return (
    <section className="py-24 bg-background" id="sobre">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center animate-slide-up transition-all duration-500 hover:scale-105 cursor-pointer group">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 group-hover:text-foreground transition-colors">
            Sobre nós
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed group-hover:text-foreground group-hover:drop-shadow-lg transition-all">
            A Elev Business nasceu para simplificar a gestão e o marketing de
            empresas através de tecnologia e automação. Nossa missão é elevar
            resultados com eficiência e inovação.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
