import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Onboarding from './Onboarding';
import { useProfileStore } from '../../store/profileStore';

beforeEach(() => {
  window.localStorage.clear();
  useProfileStore.getState().resetProfile();
});

describe('Onboarding persistence warning', () => {
  it('warns that a profile may remain on the device when deletion fails', () => {
    useProfileStore.getState().completeOnboarding({ city: 'Test city' });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    useProfileStore.getState().resetProfile();

    render(<Onboarding />);
    expect(screen.queryByRole('status')).not.toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent(/no se pudo borrar el perfil guardado/i);
    expect(screen.getByRole('status')).toHaveTextContent(/podría seguir en el dispositivo/i);
    expect(screen.getByRole('status')).not.toHaveTextContent('Test city');
  });

  it('shows a localized, accessible warning when the profile cannot be saved', () => {
    useProfileStore.setState({ persistenceWarning: true });

    render(<Onboarding />);
    const warning = screen.queryByRole('status');
    expect(warning).not.toBeNull();
    expect(warning).toHaveTextContent(/no se pudo guardar el perfil/i);
  });

  it('does not show a persistence warning when saving succeeds', () => {
    render(<Onboarding />);
    fireEvent.click(screen.getByRole('button', { name: /empezar gratis/i }));

    expect(useProfileStore.getState().profile.onboardingComplete).toBe(true);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
