import BODY_ZONE_LABELS from './bodyZones';

const ZONE_FILL = '#475569';
const ZONE_STROKE = '#64748b';
const ZONE_SELECTED_FILL = '#f59e0b';
const ZONE_SELECTED_STROKE = '#fde68a';

// One accessible primitive for every body-zone region.
// - interactive (default): a keyboard/pointer selectable region that exposes a
//   localized name and its pressed state, shared by both body views.
// - interactive={false}: a decorative, non-focusable region used by analytics.
export default function BodyZone({
  zone,
  selectedZones = [],
  onToggleZone,
  interactive = true,
  children,
  className = '',
}) {
  const selected = selectedZones.includes(zone);
  const label = BODY_ZONE_LABELS[zone] || zone;

  const paint = {
    fill: selected ? ZONE_SELECTED_FILL : ZONE_FILL,
    stroke: selected ? ZONE_SELECTED_STROKE : ZONE_STROKE,
    strokeWidth: 2,
    opacity: selected ? 0.96 : 0.68,
  };

  if (!interactive) {
    return (
      <g aria-hidden="true" {...paint}>
        {children}
      </g>
    );
  }

  const toggle = () => onToggleZone?.(zone);

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={selected}
      onClick={(event) => {
        event.stopPropagation();
        toggle();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      }}
      className={`cursor-pointer outline-none transition duration-150 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 focus-visible:drop-shadow-[0_0_4px_rgba(252,211,77,0.7)] ${className}`}
      {...paint}
    >
      {children}
    </g>
  );
}
