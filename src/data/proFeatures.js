import { Bell, Download, MapPin, Sparkles } from 'lucide-react';

// Canonical "Pro" roadmap catalogue shared by the Settings and Insights pages.
// Kept as a single source so the two screens cannot drift apart.
export const PRO_FEATURES = [
  {
    Icon: MapPin,
    title: 'Índice UV por ubicación',
    desc: 'Riesgo estimado según hora, lugar y clima.',
  },
  {
    Icon: Bell,
    title: 'Alertas inteligentes',
    desc: 'Avisos para parar, rotar zonas o cumplir objetivo.',
  },
  {
    Icon: Sparkles,
    title: 'Perfil personal',
    desc: 'Tipo de piel, rutina, objetivos y zonas prioritarias.',
  },
  {
    Icon: Download,
    title: 'Exportación avanzada',
    desc: 'CSV/PDF para seguimiento personal o profesional.',
  },
];
