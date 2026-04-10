/**
 * Front view of human body as interactive SVG zones.
 * Symmetric: clicking one side selects both (e.g. "arms" highlights left+right).
 */
export default function BodyFront({ selectedZones, onToggleZone }) {
  const isSelected = (zone) => selectedZones.includes(zone);
  const fill = (zone) => isSelected(zone) ? '#f59e0b' : '#334155';
  const stroke = (zone) => isSelected(zone) ? '#fbbf24' : '#475569';
  const opacity = (zone) => isSelected(zone) ? 0.85 : 0.5;

  const handleClick = (zone) => (e) => {
    e.stopPropagation();
    onToggleZone(zone);
  };

  const zoneProps = (zone) => ({
    fill: fill(zone),
    stroke: stroke(zone),
    strokeWidth: '1.5',
    opacity: opacity(zone),
    onClick: handleClick(zone),
    className: 'cursor-pointer transition-all duration-200 hover:opacity-80',
  });

  return (
    <svg viewBox="0 0 200 420" className="w-full h-full max-h-[340px]" xmlns="http://www.w3.org/2000/svg">
      {/* Head / Face */}
      <ellipse cx="100" cy="38" rx="24" ry="30" {...zoneProps('face')} />

      {/* Neck */}
      <rect x="90" y="66" width="20" height="16" rx="4" {...zoneProps('neck')} />

      {/* Shoulders (symmetric) */}
      <path d="M66,88 Q66,78 78,82 L90,84 L90,100 L66,100 Z" {...zoneProps('shoulders')} />
      <path d="M134,88 Q134,78 122,82 L110,84 L110,100 L134,100 Z" {...zoneProps('shoulders')} />

      {/* Chest */}
      <rect x="78" y="82" width="44" height="44" rx="4" {...zoneProps('chest')} />

      {/* Abdomen */}
      <path d="M78,126 L122,126 L118,186 Q100,194 82,186 Z" {...zoneProps('abdomen')} />

      {/* Arms (symmetric) */}
      <rect x="48" y="100" width="20" height="52" rx="8" {...zoneProps('arms')} />
      <rect x="132" y="100" width="20" height="52" rx="8" {...zoneProps('arms')} />

      {/* Forearms (symmetric) */}
      <rect x="44" y="154" width="18" height="52" rx="7" {...zoneProps('forearms')} />
      <rect x="138" y="154" width="18" height="52" rx="7" {...zoneProps('forearms')} />

      {/* Hands (symmetric) */}
      <ellipse cx="53" cy="218" rx="10" ry="12" {...zoneProps('hands')} />
      <ellipse cx="147" cy="218" rx="10" ry="12" {...zoneProps('hands')} />

      {/* Thighs (symmetric) */}
      <path d="M82,190 L98,190 L94,272 L76,272 Z" {...zoneProps('thighs')} />
      <path d="M102,190 L118,190 L124,272 L106,272 Z" {...zoneProps('thighs')} />

      {/* Shins (symmetric) */}
      <rect x="74" y="276" width="20" height="60" rx="8" {...zoneProps('shins')} />
      <rect x="106" y="276" width="20" height="60" rx="8" {...zoneProps('shins')} />

      {/* Feet (symmetric) */}
      <ellipse cx="84" cy="350" rx="14" ry="10" {...zoneProps('feet')} />
      <ellipse cx="116" cy="350" rx="14" ry="10" {...zoneProps('feet')} />
    </svg>
  );
}
