import { describe, it, expect } from 'vitest';
import { SKIN_TYPES, SKIN_TYPE_LABELS } from './skinTypes';

// Stored skin type keys (e.g. "medium") must never be shown as raw English text;
// the design fix routed every profile summary through this canonical label map.
describe('skin-type label catalogue', () => {
  it('maps every skin-type key to a distinct localized label', () => {
    expect(SKIN_TYPES.length).toBeGreaterThan(0);

    SKIN_TYPES.forEach(({ key, label }) => {
      expect(SKIN_TYPE_LABELS[key]).toBe(label);
      expect(label).toBeTruthy();
      expect(label).not.toBe(key);
    });
  });

  it('covers the stored profile keys used by the default profile', () => {
    ['fair', 'medium', 'dark'].forEach((key) => {
      expect(SKIN_TYPE_LABELS[key]).toBeTruthy();
    });
  });
});
