import { describe, it, expect } from 'vitest';
import BODY_ZONE_LABELS, { PRESETS, ZONE_GROUPS } from './bodyZones';

// The 13 canonical zone IDs are a data contract: stored IndexedDB sessions keep
// these keys, and the design explicitly forbids a migration. Locking the exact
// set here means a rename or dropped zone fails loudly instead of silently
// orphaning user history.
const CANONICAL_ZONES = [
  'face',
  'neck',
  'shoulders',
  'chest',
  'abdomen',
  'arms',
  'forearms',
  'hands',
  'thighs',
  'shins',
  'feet',
  'upper_back',
  'lower_back',
];

const LOCALIZED_LABELS = {
  face: 'Cara',
  neck: 'Cuello',
  shoulders: 'Hombros',
  chest: 'Pecho',
  abdomen: 'Abdomen',
  arms: 'Brazos',
  forearms: 'Antebrazos',
  hands: 'Manos',
  thighs: 'Muslos',
  shins: 'Piernas',
  feet: 'Pies',
  upper_back: 'Espalda alta',
  lower_back: 'Espalda baja',
};

describe('canonical body-zone contract', () => {
  it('exposes exactly the 13 preserved zone IDs with localized labels', () => {
    expect(Object.keys(BODY_ZONE_LABELS).sort()).toEqual([...CANONICAL_ZONES].sort());
    CANONICAL_ZONES.forEach((zone) => {
      expect(BODY_ZONE_LABELS[zone]).toBe(LOCALIZED_LABELS[zone]);
    });
  });

  it('describes only broad body parts, never muscle anatomy or fitness concepts', () => {
    const labels = Object.values(BODY_ZONE_LABELS).join(' ');
    expect(labels).not.toMatch(/b[ií]ceps|tr[ií]ceps|pectoral|cu[aá]driceps|abdominales/i);
    expect(labels).not.toMatch(/\bgrow\b|\bdefine\b|\bexclude\b/i);
  });

  it('keeps every preset and group scoped to canonical zones', () => {
    const canonical = new Set(CANONICAL_ZONES);

    PRESETS.forEach((preset) => {
      expect(preset.zones.length).toBeGreaterThan(0);
      preset.zones.forEach((zone) => expect(canonical.has(zone)).toBe(true));
    });

    ZONE_GROUPS.forEach((group) => {
      expect(group.zones.length).toBeGreaterThan(0);
      group.zones.forEach((zone) => expect(canonical.has(zone)).toBe(true));
    });
  });

  it('keeps the full-body preset equal to all 13 zones', () => {
    const full = PRESETS.find((preset) => preset.key === 'full');
    expect(full).toBeTruthy();
    expect([...full.zones].sort()).toEqual([...CANONICAL_ZONES].sort());
  });

  it('assigns every canonical zone to exactly one broad group', () => {
    const grouped = ZONE_GROUPS.flatMap((group) => group.zones);
    expect([...grouped].sort()).toEqual([...CANONICAL_ZONES].sort());
  });
});
