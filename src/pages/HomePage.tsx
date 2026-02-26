import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Target, MapPin, Phone, Instagram } from "lucide-react";
import pizzaHero from "@/assets/pizza-hero-new.png";
// Logo removed
import AdminNavButton from "@/components/AdminNavButton";

const HomePage = () => {
  const handleScrollToContact = () => {
    const contactSection = document.getElementById("contato");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF8F3]">
      {/* Background decorative pizza triangles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        {/* Row 1 */}
        <svg className="absolute top-[5%] left-[5%] w-16 h-16 text-secondary/20" viewBox="0 0 60 60">
          <polygon points="30,5 55,55 5,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="35" r="3" fill="currentColor" />
          <circle cx="22" cy="45" r="2" fill="currentColor" />
          <circle cx="38" cy="45" r="2" fill="currentColor" />
        </svg>
        <svg className="absolute top-[8%] left-[25%] w-14 h-14 text-secondary/15" viewBox="0 0 60 60">
          <polygon points="30,5 55,55 5,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="35" r="3" fill="currentColor" />
          <circle cx="22" cy="45" r="2" fill="currentColor" />
          <circle cx="38" cy="45" r="2" fill="currentColor" />
        </svg>
        <svg className="absolute top-[5%] left-[45%] w-16 h-16 text-secondary/20" viewBox="0 0 60 60">
          <polygon points="30,5 55,55 5,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="35" r="3" fill="currentColor" />
          <circle cx="22" cy="45" r="2" fill="currentColor" />
          <circle cx="38" cy="45" r="2" fill="currentColor" />
        </svg>
        <svg className="absolute top-[10%] left-[65%] w-12 h-12 text-secondary/15" viewBox="0 0 60 60">
          <polygon points="30,5 55,55 5,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="35" r="3" fill="currentColor" />
          <circle cx="22" cy="45" r="2" fill="currentColor" />
          <circle cx="38" cy="45" r="2" fill="currentColor" />
        </svg>
        <svg className="absolute top-[5%] left-[85%] w-14 h-14 text-secondary/20" viewBox="0 0 60 60">
          <polygon points="30,5 55,55 5,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="35" r="3" fill="currentColor" />
          <circle cx="22" cy="45" r="2" fill="currentColor" />
          <circle cx="38" cy="45" r="2" fill="currentColor" />
        </svg>
        {/* Row 2 */}
        <svg className="absolute top-[20%] left-[10%] w-12 h-12 text-secondary/15" viewBox="0 0 60 60">
          <polygon points="30,5 55,55 5,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="35" r="3" fill="currentColor" />
          <circle cx="22" cy="45" r="2" fill="currentColor" />
          <circle cx="38" cy="45" r="2" fill="currentColor" />
        </svg>
        <svg className="absolute top-[22%] left-[35%] w-16 h-16 text-secondary/20" viewBox="0 0 60 60">
          <polygon points="30,5 55,55 5,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="35" r="3" fill="currentColor" />
          <circle cx="22" cy="45" r="2" fill="currentColor" />
          <circle cx="38" cy="45" r="2" fill="currentColor" />
        </svg>
        <svg className="absolute top-[18%] left-[55%] w-14 h-14 text-secondary/15" viewBox="0 0 60 60">
          <polygon points="30,5 55,55 5,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="35" r="3" fill="currentColor" />
          <circle cx="22" cy="45" r="2" fill="currentColor" />
          <circle cx="38" cy="45" r="2" fill="currentColor" />
        </svg>
        <svg className="absolute top-[25%] left-[78%] w-12 h-12 text-secondary/20" viewBox="0 0 60 60">
          <polygon points="30,5 55,55 5,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="35" r="3" fill="currentColor" />
          <circle cx="22" cy="45" r="2" fill="currentColor" />
          <circle cx="38" cy="45" r="2" fill="currentColor" />
        </svg>
        {/* Row 3 */}
        <svg className="absolute top-[38%] left-[3%] w-14 h-14 text-secondary/20" viewBox="0 0 60 60">
          <polygon points="30,5 55,55 5,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="35" r="3" fill="currentColor" />
          <circle cx="22" cy="45" r="2" fill="currentColor" />
          <circle cx="38" cy="45" r="2" fill="currentColor" />
        </svg>
        <svg className="absolute top-[40%] left-[22%] w-12 h-12 text-secondary/15" viewBox="0 0 60 60">
          <polygon points="30,5 55,55 5,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="35" r="3" fill="currentColor" />
          <circle cx="22" cy="45" r="2" fill="currentColor" />
          <circle cx="38" cy="45" r="2" fill="currentColor" />
        </svg>
        <svg className="absolute top-[35%] left-[42%] w-16 h-16 text-secondary/20" viewBox="0 0 60 60">
          <polygon points="30,5 55,55 5,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="35" r="3" fill="currentColor" />
          <circle cx="22" cy="45" r="2" fill="currentColor" />
          <circle cx="38" cy="45" r="2" fill="currentColor" />
        </svg>
        <svg className="absolute top-[42%] left-[68%] w-14 h-14 text-secondary/15" viewBox="0 0 60 60">
          <polygon points="30,5 55,55 5,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="35" r="3" fill="currentColor" />
          <circle cx="22" cy="45" r="2" fill="currentColor" />
          <circle cx="38" cy="45" r="2" fill="currentColor" />
        </svg>
        <svg className="absolute top-[38%] left-[90%] w-12 h-12 text-secondary/20" viewBox="0 0 60 60">
          <polygon points="30,5 55,55 5,55" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="30" cy="35" r="3" fill="currentColor" />
          <circle cx="22" cy="45" r="2" fill="currentColor" />
          <circle cx="38" cy="45" r="2" fill="currentColor" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 lg:px-16">
        <div className="flex items-center gap-3">
          {/* Logo removed */}
          <span className="font-display text-2xl font-bold text-secondary">Pizzaria</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
            Início
          </Link>
          <Link to="/pedidos" className="text-foreground hover:text-primary transition-colors font-medium">
            Serviços
          </Link>
          <Link to="/pedidos" className="text-foreground hover:text-primary transition-colors font-medium">
            Cardápio
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <AdminNavButton />
          <Button
            onClick={handleScrollToContact}
            className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-6"
          >
            Contato
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex items-center px-8 lg:px-16 py-16 min-h-[70vh]">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto w-full">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in">
            <p className="text-primary font-serif italic text-xl tracking-wide">Conheça</p>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-secondary leading-tight tracking-tight">
              A MELHOR PIZZA<br />DA CIDADE <span className="text-4xl">🍕</span>
            </h1>

            <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
              Lorem ipsum <span className="text-primary font-semibold">dolor</span> sit amet, consectetur adipiscing elit. Integer egestas nisl nec libero fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer egestas nisl nec libero fermentum.
            </p>

            {/* Service Options */}
            <div className="flex items-center gap-6 py-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-secondary" />
                </div>
                <span className="font-medium text-foreground">À La Carte</span>
              </div>

              <div className="w-12 h-0.5 bg-secondary/30" />

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-secondary" />
                </div>
                <span className="font-medium text-foreground">Rodízio</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/pedido-rapido">
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg"
                >
                  Pedir Agora
                </Button>
              </Link>
              <Link to="/pedidos">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg font-semibold"
                >
                  Mais Opções
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Pizza Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <img
                src={pizzaHero}
                alt="Pizza deliciosa"
                className="w-[400px] lg:w-[550px] object-contain animate-float-pizza"
              />
              {/* Decorative shadow/base */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-6 bg-secondary/30 rounded-full blur-xl" />
            </div>
          </div>
        </div>

        {/* Smoother Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[80px] md:h-[100px]"
          >
            <path
              d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
              className="fill-secondary"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 bg-secondary py-16 overflow-hidden">
        {/* Decorative triangles */}
        <div className="absolute top-0 left-8 w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[70px] border-b-primary/30 transform -translate-y-1/2" />
        <div className="absolute top-0 right-8 w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[70px] border-b-primary/30 transform -translate-y-1/2" />

        <div className="max-w-5xl mx-auto px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <p className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary">+500</p>
              <p className="text-white/90 text-sm md:text-base font-semibold tracking-wider">CLIENTES</p>
            </div>
            <div className="space-y-2">
              <p className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary">+30</p>
              <p className="text-white/90 text-sm md:text-base font-semibold tracking-wider">SABORES</p>
            </div>
            <div className="space-y-2">
              <p className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary">+5</p>
              <p className="text-white/90 text-sm md:text-base font-semibold tracking-wider">ANOS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="relative z-10 bg-[#FDF8F3] py-20 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-primary font-medium italic text-lg mb-2">Por que escolher a</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary">
              Nossa Pizzaria?
            </h2>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Massa Artesanal */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-5xl mb-4 block">🍕</span>
              <h3 className="font-display text-xl font-bold text-secondary mb-3">Massa Artesanal</h3>
              <p className="text-muted-foreground leading-relaxed">
                Preparada diariamente com ingredientes selecionados e fermentação natural de 48 horas.
              </p>
            </div>

            {/* Forno a Lenha */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-5xl mb-4 block">🔥</span>
              <h3 className="font-display text-xl font-bold text-secondary mb-3">Forno a Lenha</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sabor autêntico italiano com o toque defumado especial do nosso forno tradicional.
              </p>
            </div>

            {/* Entrega Expressa */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-5xl mb-4 block">🚀</span>
              <h3 className="font-display text-xl font-bold text-secondary mb-3">Entrega Expressa</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sua pizza quentinha em até 45 minutos ou a próxima é por nossa conta!
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link to="/pedidos">
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-10 py-6 text-lg font-semibold"
              >
                Ver Cardápio Completo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contato" className="relative z-10 bg-secondary py-16 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            {/* Location */}
            <div className="space-y-4">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Localização</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Rua Logo Ali, 423<br />
                Monte Alto - SP
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Telefone</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                (16) 99999-9999<br />
                WhatsApp disponível
              </p>
            </div>

            {/* Instagram */}
            <div className="space-y-4">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
                <Instagram className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Instagram</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                @pizzaria<br />
                Siga-nos nas redes!
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-12 pt-8 border-t border-white/20">
            <p className="text-white/60 text-sm">
              © 2026 Pizzaria. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
