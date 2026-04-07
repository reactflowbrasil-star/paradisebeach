import { Link } from "react-router-dom";
import { Bed, Bath, Maximize, MapPin, Heart } from "lucide-react";
import { Property, formatPrice } from "@/data/properties";
import { motion } from "framer-motion";

interface Props {
  property: Property;
  index?: number;
}

export default function PropertyCard({ property, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link
        to={`/imovel/${property.id}`}
        className="group block bg-card rounded-lg overflow-hidden shadow-card hover:shadow-luxury transition-all duration-500 hover:-translate-y-1"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            loading="lazy"
            width={800}
            height={600}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {property.listing === "venda" ? "Venda" : "Aluguel"}
            </span>
            {property.featured && (
              <span className="bg-gradient-gold text-gold-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Destaque
              </span>
            )}
          </div>
          <button
            className="absolute top-4 right-4 w-9 h-9 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
            aria-label="Favoritar"
            onClick={(e) => e.preventDefault()}
          >
            <Heart size={16} className="text-foreground" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
            <MapPin size={12} />
            <span>{property.location}, {property.city} — {property.state}</span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <p className="text-2xl font-bold text-primary mb-4">
            {formatPrice(property.price, property.priceLabel)}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1"><Bed size={14} /> {property.bedrooms}</span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1"><Bath size={14} /> {property.bathrooms}</span>
            )}
            <span className="flex items-center gap-1"><Maximize size={14} /> {property.area}m²</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
