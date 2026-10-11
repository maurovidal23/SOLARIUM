import BODY_ZONE_LABELS from '../components/body/bodyZones';

export const TOTAL_BODY_ZONES = Object.keys(BODY_ZONE_LABELS).length;

// Aggregates stored sessions into body-zone analytics.
//
// - totalExposureSeconds: every session counted exactly once, regardless of how
//   many zones it touched. This is the real exposure time shown as "Total".
// - zoneMinutesByKey: per-zone accumulation; a single session's duration counts
//   toward each of its selected zones, so this is a separate (and larger) metric.
// - coveragePercent: distinct active zones / 13, rounded to an integer.
//
// Unknown stored zone keys are ignored so legacy/corrupt data cannot skew the map.
export function calculateBodyZoneMetrics(sessions = []) {
  const zoneMinutesByKey = {};
  Object.keys(BODY_ZONE_LABELS).forEach((zone) => {
    zoneMinutesByKey[zone] = 0;
  });

  let totalExposureSeconds = 0;
  const activeZoneSet = new Set();

  sessions.forEach((session) => {
    const duration = Number.isFinite(session?.duration) && session.duration >= 0 ? session.duration : 0;
    totalExposureSeconds += duration;

    const parts = Array.isArray(session?.body_parts) ? session.body_parts : [];
    parts.forEach((zone) => {
      if (typeof zone !== 'string' || !Object.hasOwn(zoneMinutesByKey, zone)) return;
      zoneMinutesByKey[zone] += duration / 60;
      activeZoneSet.add(zone);
    });
  });

  const activeZones = Array.from(activeZoneSet);
  const coveragePercent = Math.round((activeZones.length / TOTAL_BODY_ZONES) * 100);

  return { totalExposureSeconds, zoneMinutesByKey, activeZones, coveragePercent };
}
