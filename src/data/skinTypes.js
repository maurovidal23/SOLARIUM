// Canonical skin-type options and labels, shared by onboarding and the profile
// summaries so stored keys (e.g. "medium") are never shown as raw English text.
export const SKIN_TYPES = [
  { key: 'fair', label: 'Clara', desc: 'Me quemo con facilidad' },
  { key: 'medium', label: 'Media', desc: 'Me adapto de forma gradual' },
  { key: 'dark', label: 'Oscura', desc: 'Rara vez me quemo' },
];

export const SKIN_TYPE_LABELS = Object.fromEntries(
  SKIN_TYPES.map(({ key, label }) => [key, label]),
);
