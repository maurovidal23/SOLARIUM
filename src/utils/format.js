export function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  }
  return `${seconds}s`;
}

export function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getIntensityColor(level) {
  switch (level) {
    case 'low': return '#22c55e';
    case 'medium': return '#f59e0b';
    case 'high': return '#ef4444';
    default: return '#f59e0b';
  }
}

export function getIntensityLabel(level) {
  switch (level) {
    case 'low': return 'Baja';
    case 'medium': return 'Media';
    case 'high': return 'Alta';
    default: return level;
  }
}

const BODY_PART_SHORT = {
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
  upper_back: 'Espalda↑',
  lower_back: 'Espalda↓',
};

export function formatBodyParts(parts) {
  if (!parts || parts.length === 0) return '';
  return parts.map((p) => BODY_PART_SHORT[p] || p).join(', ');
}
