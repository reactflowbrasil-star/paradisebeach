import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, MapPin, TrendingUp, Gem, Star, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-beach.jpg";
import sunsetImg from "@/assets/beach-sunset.jpg";
import { properties } from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";
import SectionTitle from "@/components/SectionTitle";

const benefits = [
  { icon: Gem, title: "Exclusividade", desc: "Imóveis selecionados e curados para os mais exigentes." },
  { icon: Shield, title: "Segurança", desc: "Transações seguras com assessoria jurídica completa." },
  { icon: TrendingUp, title: "Rentabilidade", desc: "Alto potencial de valorização em localizações premium." },
  { icon: MapPin, title: "Localização", desc: "As praias mais paradisíacas do litoral brasileiro." },
];

const testimonials = [
  { name: "Marina Oliveira", role: "Empresária", text: "A Paradise Beach transformou meu sonho em realidade. O atendimento foi impecável do início ao fim.", rating: 5 },
  { name: "Carlos Mendes", role: "Investidor", text: "Profissionalismo e exclusividade. Encontraram a villa perfeita em Trancoso para minha família.", rating: 5 },
  { name: "Fernanda Costa", role: "Arquiteta", text: "Uma curadoria excepcional de propriedades. Cada imóvel é uma obra de arte à beira-mar.", rating: 5 },
];

export default function Index() {
  const featured = properties.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Villa de luxo à beira-mar com piscina infinita ao pôr do sol"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/30 to-foreground/60" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="text-gold text-sm font-semibold uppercase tracking-[0.3em] mb-4 block">Imobiliária de Luxo</span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Seu Paraíso<br />à Beira-Mar
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
              Descubra propriedades exclusivas nas praias mais deslumbrantes do Brasil. Viva o estilo de vida que você sempre sonhou.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/venda"
                className="bg-gradient-gold text-gold-foreground px-8 py-4 rounded-full font-semibold text-lg hover:shadow-gold hover:scale-105 transition-all"
              >
                Ver Imóveis à Venda
              </Link>
              <Link
                to="/aluguel"
                className="border-2 border-primary-foreground/40 text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-foreground/10 transition-all"
              >
                Imóveis para Alugar
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Benefits */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionTitle label="Excelência" title="Por que Paradise Beach?" subtitle="Mais de uma década de expertise em imóveis de alto padrão no litoral brasileiro." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card p-8 rounded-lg shadow-card text-center hover:shadow-luxury transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center mx-auto mb-5">
                  <b.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3 text-foreground">{b.title}</h3>
                <p className="text-muted-foreground text-sm">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-sand">
        <div className="container mx-auto px-4">
          <SectionTitle label="Portfólio" title="Imóveis em Destaque" subtitle="Propriedades excepcionais selecionadas para você." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/venda"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:shadow-luxury hover:scale-105 transition-all"
            >
              Ver Todos os Imóveis <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionTitle label="Depoimentos" title="O Que Nossos Clientes Dizem" subtitle="A satisfação dos nossos clientes é o nosso maior patrimônio." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card p-8 rounded-lg shadow-card"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-foreground mb-6 italic leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative py-24 overflow-hidden">
        <img src={sunsetImg} alt="Pôr do sol na praia" className="absolute inset-0 w-full h-full object-cover" loading="lazy" width={1920} height={800} />
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <SectionTitle label="Newsletter" title="Receba Novidades Exclusivas" subtitle="Cadastre-se e seja o primeiro a conhecer nossos lançamentos e oportunidades únicas." light />
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-6 py-4 rounded-full bg-card/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-gold"
              aria-label="Email para newsletter"
            />
            <button
              type="submit"
              className="bg-gradient-gold text-gold-foreground px-8 py-4 rounded-full font-semibold hover:shadow-gold transition-all"
            >
              Inscrever-se
            </button>
          </form>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6">
              Pronto para Encontrar<br />seu Paraíso?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              Nossa equipe de especialistas está pronta para ajudá-lo a encontrar a propriedade dos seus sonhos.
            </p>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 bg-gradient-gold text-gold-foreground px-10 py-4 rounded-full font-semibold text-lg hover:shadow-gold hover:scale-105 transition-all"
            >
              Entre em Contato <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
