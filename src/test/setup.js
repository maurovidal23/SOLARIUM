import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// React Testing Library auto-cleanup is enabled via Vitest globals, but we make
// it explicit so DOM nodes never leak between tests when globals are disabled.
afterEach(() => {
  cleanup();
});
