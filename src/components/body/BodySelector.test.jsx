import { useState } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BodySelector from './BodySelector';
import BODY_ZONE_LABELS, { PRESETS, ZONE_GROUPS } from './bodyZones';

const ZONE_LABELS = Object.values(BODY_ZONE_LABELS);

function ControlledSelector({ initialZones = [] }) {
  const [zones, setZones] = useState(initialZones);
  return <BodySelector selectedZones={zones} onChangeZones={setZones} />;
}

function selectedButtons(label) {
  return screen.queryAllByRole('button', { name: label });
}

describe('BodySelector two-sided body map', () => {
  it('renders front and back maps together with all 13 localized zones', () => {
    render(<ControlledSelector />);

    ZONE_LABELS.forEach((label) => {
      expect(selectedButtons(label).length).toBeGreaterThan(0);
    });

    // Front-only and back-only zones must be present at the same time.
    expect(selectedButtons('Pecho').length).toBeGreaterThan(0);
    expect(selectedButtons('Espalda alta').length).toBeGreaterThan(0);
    expect(selectedButtons('Espalda baja').length).toBeGreaterThan(0);
  });

  it('does not render muscle anatomy or fitness-builder concepts', () => {
    render(<ControlledSelector />);

    expect(
      screen.queryByText(/b[ií]ceps|tr[ií]ceps|pectoral|cu[aá]driceps|abdominales/i),
    ).toBeNull();
    expect(screen.queryByText(/\bgrow\b|\bdefine\b|\bexclude\b/i)).toBeNull();
  });

  it('updates the selected-zone summary when a region is tapped', () => {
    render(<ControlledSelector />);

    const before = selectedButtons('Cara');
    expect(before.length).toBeGreaterThan(0);
    before.forEach((button) => expect(button).toHaveAttribute('aria-pressed', 'false'));

    fireEvent.click(before[0]);

    const after = selectedButtons('Cara');
    expect(after.length).toBeGreaterThan(0);
    after.forEach((button) =>
      expect(button).toHaveAttribute('aria-pressed', 'true'),
    );
    // The selected-zone chip carries the localized label.
    expect(screen.getByText('Cara')).toBeInTheDocument();

    fireEvent.click(selectedButtons('Cara')[0]);

    selectedButtons('Cara').forEach((button) =>
      expect(button).toHaveAttribute('aria-pressed', 'false'),
    );
  });

  it('toggles the same canonical zone from either map', () => {
    render(<ControlledSelector />);

    const arms = selectedButtons('Brazos');
    expect(arms.length).toBeGreaterThanOrEqual(2);

    fireEvent.click(arms[0]);
    selectedButtons('Brazos').forEach((button) =>
      expect(button).toHaveAttribute('aria-pressed', 'true'),
    );

    fireEvent.click(selectedButtons('Brazos')[1]);
    selectedButtons('Brazos').forEach((button) =>
      expect(button).toHaveAttribute('aria-pressed', 'false'),
    );
  });

  it('applies exposure presets', () => {
    render(<ControlledSelector />);

    const full = PRESETS.find((preset) => preset.key === 'full');
    fireEvent.click(screen.getByRole('button', { name: new RegExp(full.label) }));

    ZONE_LABELS.forEach((label) => {
      selectedButtons(label).forEach((button) =>
        expect(button).toHaveAttribute('aria-pressed', 'true'),
      );
    });
  });

  it('toggles broad zone groups', () => {
    render(<ControlledSelector />);

    const legs = ZONE_GROUPS.find((group) => group.key === 'legs');
    fireEvent.click(screen.getByRole('button', { name: new RegExp(legs.label) }));

    legs.zones.forEach((zone) => {
      selectedButtons(BODY_ZONE_LABELS[zone]).forEach((button) =>
        expect(button).toHaveAttribute('aria-pressed', 'true'),
      );
    });
  });
});

describe('BodySelector keyboard and chip accessibility', () => {
  it('toggles a body zone with Enter and Space', () => {
    render(<ControlledSelector />);

    fireEvent.keyDown(selectedButtons('Cara')[0], { key: 'Enter' });
    selectedButtons('Cara').forEach((button) =>
      expect(button).toHaveAttribute('aria-pressed', 'true'),
    );

    fireEvent.keyDown(selectedButtons('Cara')[0], { key: ' ' });
    selectedButtons('Cara').forEach((button) =>
      expect(button).toHaveAttribute('aria-pressed', 'false'),
    );
  });

  it('removes a selected zone through its labeled chip control', () => {
    render(<ControlledSelector initialZones={['face']} />);

    expect(selectedButtons('Cara')[0]).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: /quitar cara/i }));

    selectedButtons('Cara').forEach((button) =>
      expect(button).toHaveAttribute('aria-pressed', 'false'),
    );
  });
});
