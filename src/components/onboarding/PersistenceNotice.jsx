import { useProfileStore } from '../../store/profileStore';

// Storage failures remain visible inside onboarding and in the app shell.
export default function PersistenceNotice() {
  const persistenceWarning = useProfileStore((state) => state.persistenceWarning);
  const profileDeletionWarning = useProfileStore((state) => state.profileDeletionWarning);

  if (!persistenceWarning && !profileDeletionWarning) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto mt-3 w-full max-w-lg rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-xs font-medium leading-relaxed text-amber-100"
    >
      {profileDeletionWarning
        ? 'No se pudo borrar el perfil guardado. Podría seguir en el dispositivo.'
        : 'No se pudo guardar el perfil. Seguirá disponible hasta que cierres la app.'}
    </div>
  );
}
