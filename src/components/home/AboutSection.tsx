const AboutSection = () => {
  return (
    <section className="py-24 bg-background" id="sobre">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 transition-all duration-500 hover:scale-105 hover:text-foreground cursor-default">
            Sobre nós
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed transition-all duration-500 hover:scale-105 hover:text-foreground hover:drop-shadow-lg cursor-default">
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
