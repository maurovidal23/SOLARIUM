const BODY_ZONE_LABELS = {
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

export const PRESETS = [
  {
    key: 'full',
    label: '☀️ Full',
    desc: 'Todo el cuerpo',
    zones: Object.keys(BODY_ZONE_LABELS),
  },
  {
    key: 'shirtless',
    label: '👕 Sin camiseta',
    desc: 'Torso, brazos, cara',
    zones: ['face', 'neck', 'shoulders', 'chest', 'abdomen', 'arms', 'forearms', 'hands', 'upper_back', 'lower_back'],
  },
  {
    key: 'dressed',
    label: '🧥 Vestido',
    desc: 'Solo cara, cuello y manos',
    zones: ['face', 'neck', 'hands'],
  },
  {
    key: 'shorts',
    label: '🩳 Con shorts',
    desc: 'Piernas y pies expuestos',
    zones: ['face', 'neck', 'hands', 'forearms', 'shins', 'feet'],
  },
];

export default BODY_ZONE_LABELS;
