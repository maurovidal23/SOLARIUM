import { describe, it, expect } from 'vitest';
import { calculateBodyZoneMetrics, TOTAL_BODY_ZONES } from './bodyZoneMetrics';

describe('body-zone metric aggregation', () => {
  it('counts a multi-zone session once for the total while accumulating each zone', () => {
    const metrics = calculateBodyZoneMetrics([
      { duration: 10 * 60, body_parts: ['face', 'chest', 'arms', 'thighs'] },
      { duration: 5 * 60, body_parts: [] },
    ]);

    // The "Total" is real exposure time: 10m + 5m, not 4 zones * 10m + 5m.
    expect(metrics.totalExposureSeconds).toBe(15 * 60);
    expect(metrics.zoneMinutesByKey.face).toBe(10);
    expect(metrics.zoneMinutesByKey.chest).toBe(10);
    expect(metrics.zoneMinutesByKey.arms).toBe(10);
    expect(metrics.zoneMinutesByKey.thighs).toBe(10);
    expect(metrics.zoneMinutesByKey.hands).toBe(0);
  });

  it('documents the 13-zone denominator while counting distinct active zones', () => {
    const metrics = calculateBodyZoneMetrics([
      { duration: 60, body_parts: ['face'] },
      { duration: 60, body_parts: ['face', 'hands'] },
    ]);

    expect(TOTAL_BODY_ZONES).toBe(13);
    expect(metrics.activeZones.sort()).toEqual(['face', 'hands']);
    // 2 / 13 rounded to an integer.
    expect(metrics.coveragePercent).toBe(15);
  });

  it('ignores unknown zone keys and returns zeroed metrics for no sessions', () => {
    const metrics = calculateBodyZoneMetrics([
      { duration: 120, body_parts: ['face', 'not-a-zone'] },
    ]);

    expect(metrics.activeZones).toEqual(['face']);
    expect(metrics.zoneMinutesByKey['not-a-zone']).toBeUndefined();

    const empty = calculateBodyZoneMetrics();
    expect(empty.totalExposureSeconds).toBe(0);
    expect(empty.activeZones).toEqual([]);
    expect(empty.coveragePercent).toBe(0);
    expect(Object.keys(empty.zoneMinutesByKey)).toHaveLength(TOTAL_BODY_ZONES);
  });
});

describe('body-zone metric input validation', () => {
  it('ignores inherited property names and non-string zone keys', () => {
    const metrics = calculateBodyZoneMetrics([
      { duration: 60, body_parts: ['face', 'constructor', 'toString', '__proto__', 'unknown', null, ['hands']] },
    ]);

    expect(metrics.activeZones).toEqual(['face']);
    expect(metrics.coveragePercent).toBe(8);
    expect(Object.keys(metrics.zoneMinutesByKey)).toHaveLength(13);
    expect(metrics.zoneMinutesByKey.face).toBe(1);
    expect(metrics.zoneMinutesByKey.hands).toBe(0);
  });

  it('does not let malformed durations corrupt totals', () => {
    const sessions = [-60, Infinity, NaN, '60', null].map((duration) => ({
      duration,
      body_parts: ['face'],
    }));
    sessions.push({ duration: 120, body_parts: ['face'] });

    const metrics = calculateBodyZoneMetrics(sessions);
    expect(metrics.totalExposureSeconds).toBe(120);
    expect(metrics.zoneMinutesByKey.face).toBe(2);
  });
});
