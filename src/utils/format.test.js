import { describe, it, expect } from 'vitest';
import {
  formatDuration,
  formatBodyParts,
  getIntensityColor,
  getIntensityLabel,
} from './format';

describe('formatDuration', () => {
  it('shows seconds, minutes, and hours at the right thresholds', () => {
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(45)).toBe('45s');
    expect(formatDuration(60)).toBe('1m 00s');
    expect(formatDuration(125)).toBe('2m 05s');
    expect(formatDuration(3600)).toBe('1h 00m');
    expect(formatDuration(3660)).toBe('1h 01m');
  });
});

describe('formatBodyParts', () => {
  it('maps canonical zone keys to localized labels', () => {
    expect(formatBodyParts(['face', 'upper_back'])).toBe('Cara, Espalda alta');
  });

  it('returns an empty string for no parts and falls back for unknown keys', () => {
    expect(formatBodyParts([])).toBe('');
    expect(formatBodyParts(null)).toBe('');
    expect(formatBodyParts(['unknown'])).toBe('unknown');
  });
});

describe('intensity presentation', () => {
  it('localizes known intensity levels', () => {
    expect(getIntensityLabel('low')).toBe('Baja');
    expect(getIntensityLabel('medium')).toBe('Media');
    expect(getIntensityLabel('high')).toBe('Alta');
  });

  it('maps levels to the palette colors and defaults safely', () => {
    expect(getIntensityColor('low')).toBe('#22c55e');
    expect(getIntensityColor('medium')).toBe('#f59e0b');
    expect(getIntensityColor('high')).toBe('#ef4444');
    expect(getIntensityColor('unexpected')).toBe('#f59e0b');
  });
});
