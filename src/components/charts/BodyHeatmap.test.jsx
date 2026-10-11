import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../../db/sessions', () => ({
  getAllSessions: vi.fn(),
}));

import { getAllSessions } from '../../db/sessions';
import BodyHeatmap from './BodyHeatmap';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('BodyHeatmap', () => {
  it('shows actual exposure time even when all sessions have no zones', async () => {
    getAllSessions.mockResolvedValue([{ id: 1, duration: 5 * 60, body_parts: [] }]);

    render(<BodyHeatmap />);

    await waitFor(() => expect(screen.queryByText(/^Total$/)?.parentElement).toHaveTextContent('5m'));
    expect(screen.getByText(/0% cobertura/i)).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('reports distinct session duration as the total, not the per-zone sum', async () => {
    getAllSessions.mockResolvedValue([
      { id: 1, duration: 10 * 60, body_parts: ['face', 'chest', 'arms', 'thighs'] },
      { id: 2, duration: 5 * 60, body_parts: [] },
    ]);

    render(<BodyHeatmap />);

    const totalNode = await screen.findByText(/total/i);
    expect(totalNode.parentElement).toHaveTextContent('15m');
    expect(totalNode.parentElement).not.toHaveTextContent('40m');
  });

  it('renders both localized front and back body maps', async () => {
    getAllSessions.mockResolvedValue([{ id: 1, duration: 10 * 60, body_parts: ['upper_back'] }]);

    render(<BodyHeatmap />);

    await waitFor(() => expect(screen.queryAllByRole('img')).toHaveLength(2));
    const maps = screen.getAllByRole('img');
    const names = maps.map((map) => map.getAttribute('aria-label') || '');
    expect(maps.length).toBeGreaterThanOrEqual(2);
    expect(names.some((name) => /frontal|frente|front/i.test(name))).toBe(true);
    expect(names.some((name) => /espalda|back/i.test(name))).toBe(true);
  });

  it('renders analytics maps as read-only with no focusable controls', async () => {
    getAllSessions.mockResolvedValue([{ id: 1, duration: 10 * 60, body_parts: ['face'] }]);

    const { container } = render(<BodyHeatmap />);

    await waitFor(() => expect(container.querySelectorAll('svg').length).toBeGreaterThan(0));

    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0);
  });

  it('computes coverage over the visible 13-zone set', async () => {
    getAllSessions.mockResolvedValue([
      { id: 1, duration: 10 * 60, body_parts: ['face'] },
      { id: 2, duration: 5 * 60, body_parts: ['face', 'hands'] },
    ]);

    render(<BodyHeatmap />);

    // Distinct active zones: face + hands => 2 / 13 => 15%.
    expect(await screen.findByText(/15% cobertura/i)).toBeInTheDocument();
  });
});
