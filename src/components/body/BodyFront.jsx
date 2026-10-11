import BodyZone from './BodyZone';

export default function BodyFront({ selectedZones = [], onToggleZone, interactive = true }) {
  const svgA11y = interactive
    ? {}
    : { role: 'img', 'aria-label': 'Mapa corporal frontal' };

  return (
    <svg
      viewBox="0 0 220 520"
      className="relative z-10 h-full max-h-[390px] w-full"
      xmlns="http://www.w3.org/2000/svg"
      {...svgA11y}
    >
      <defs>
        <linearGradient id="frontCore" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="472" rx="55" ry="12" fill="#020617" opacity="0.45" />

      <BodyZone zone="face" selectedZones={selectedZones} onToggleZone={onToggleZone} interactive={interactive}>
        <path d="M83 48C83 25 95 13 110 13s27 12 27 35c0 21-11 37-27 37S83 69 83 48Z" />
      </BodyZone>

      <BodyZone zone="neck" selectedZones={selectedZones} onToggleZone={onToggleZone} interactive={interactive}>
        <path d="M97 82h26l-2 24H99L97 82Z" />
      </BodyZone>

      <BodyZone zone="shoulders" selectedZones={selectedZones} onToggleZone={onToggleZone} interactive={interactive}>
        <path d="M54 118c12-17 29-24 48-22l-2 34H61c-9 0-13-5-7-12Z" />
        <path d="M166 118c-12-17-29-24-48-22l2 34h39c9 0 13-5 7-12Z" />
      </BodyZone>

      <BodyZone zone="chest" selectedZones={selectedZones} onToggleZone={onToggleZone} interactive={interactive}>
        <path d="M75 116c7-9 22-13 35-13s28 4 35 13l-7 70H82l-7-70Z" />
      </BodyZone>

      <BodyZone zone="abdomen" selectedZones={selectedZones} onToggleZone={onToggleZone} interactive={interactive}>
        <path d="M82 185h56l-5 78c-5 14-16 22-23 22s-18-8-23-22l-5-78Z" />
      </BodyZone>

      <BodyZone zone="arms" selectedZones={selectedZones} onToggleZone={onToggleZone} interactive={interactive}>
        <path d="M55 132c-8 10-14 28-17 48-3 18 6 26 18 20l13-67c-5-4-10-5-14-1Z" />
        <path d="M165 132c8 10 14 28 17 48 3 18-6 26-18 20l-13-67c5-4 10-5 14-1Z" />
      </BodyZone>

      <BodyZone zone="forearms" selectedZones={selectedZones} onToggleZone={onToggleZone} interactive={interactive}>
        <path d="M39 198c-7 18-9 44-5 61 2 9 11 12 17 5 7-19 11-42 11-62-8-4-16-6-23-4Z" />
        <path d="M181 198c7 18 9 44 5 61-2 9-11 12-17 5-7-19-11-42-11-62 8-4 16-6 23-4Z" />
      </BodyZone>

      <BodyZone zone="hands" selectedZones={selectedZones} onToggleZone={onToggleZone} interactive={interactive}>
        <path d="M31 265c-5 11-1 28 11 30 11 1 15-14 11-29-7 4-15 3-22-1Z" />
        <path d="M189 265c5 11 1 28-11 30-11 1-15-14-11-29 7 4 15 3 22-1Z" />
      </BodyZone>

      <BodyZone zone="thighs" selectedZones={selectedZones} onToggleZone={onToggleZone} interactive={interactive}>
        <path d="M86 278c9 5 18 6 24 1l-4 116c-4 8-21 8-26-1l-5-84c-1-17 2-26 11-32Z" />
        <path d="M134 278c-9 5-18 6-24 1l4 116c4 8 21 8 26-1l5-84c1-17-2-26-11-32Z" />
      </BodyZone>

      <BodyZone zone="shins" selectedZones={selectedZones} onToggleZone={onToggleZone} interactive={interactive}>
        <path d="M79 392c8 5 19 5 27 0l-4 70c-6 7-17 7-23 0l-6-55c-1-7 1-12 6-15Z" />
        <path d="M141 392c-8 5-19 5-27 0l4 70c6 7 17 7 23 0l6-55c1-7-1-12-6-15Z" />
      </BodyZone>

      <BodyZone zone="feet" selectedZones={selectedZones} onToggleZone={onToggleZone} interactive={interactive}>
        <path d="M75 462c8 7 21 7 29 0 9 5 16 12 14 20-15 4-35 4-49 0-2-8 1-15 6-20Z" />
        <path d="M145 462c-8 7-21 7-29 0-9 5-16 12-14 20 15 4 35 4 49 0 2-8-1-15-6-20Z" />
      </BodyZone>

      <path
        d="M70 112c13-18 27-25 40-25s27 7 40 25c-7 55-11 107-8 154 5 27 10 57 10 91 0 44-9 85-9 107H77c0-22-9-63-9-107 0-34 5-64 10-91 3-47-1-99-8-154Z"
        fill="url(#frontCore)"
        stroke="#e2e8f0"
        strokeOpacity="0.1"
        strokeWidth="1"
        pointerEvents="none"
      />
    </svg>
  );
}
