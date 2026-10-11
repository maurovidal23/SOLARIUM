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

export const ZONE_GROUPS = [
  {
    key: 'upper',
    label: 'Tren superior',
    zones: ['face', 'neck', 'shoulders', 'chest', 'abdomen', 'upper_back', 'lower_back'],
  },
  {
    key: 'arms',
    label: 'Brazos y manos',
    zones: ['arms', 'forearms', 'hands'],
  },
  {
    key: 'legs',
    label: 'Piernas y pies',
    zones: ['thighs', 'shins', 'feet'],
  },
];

export const PRESETS = [
  {
    key: 'full',
    label: 'Cuerpo completo',
    desc: 'Todas las zonas expuestas',
    zones: Object.keys(BODY_ZONE_LABELS),
  },
  {
    key: 'shirtless',
    label: 'Sin camiseta',
    desc: 'Torso, espalda, brazos, cara y manos',
    zones: ['face', 'neck', 'shoulders', 'chest', 'abdomen', 'arms', 'forearms', 'hands', 'upper_back', 'lower_back'],
  },
  {
    key: 'dressed',
    label: 'Vestido',
    desc: 'Cara, cuello y manos',
    zones: ['face', 'neck', 'hands'],
  },
  {
    key: 'shorts',
    label: 'Shorts',
    desc: 'Cara, cuello, manos, antebrazos, piernas y pies',
    zones: ['face', 'neck', 'hands', 'forearms', 'shins', 'feet'],
  },
];

export default BODY_ZONE_LABELS;
