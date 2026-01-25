
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProjectAssessmentHub from './ProjectAssessmentHub';

describe('ProjectAssessmentHub Component', () => {
  const mockLogin = vi.fn();

  it('starts at initiation phase', () => {
    render(<ProjectAssessmentHub onLogin={mockLogin} />);
    expect(screen.getByText('Audit Protocol')).toBeDefined();
    expect(screen.getByText('INITIATE_AUDIT_HANDSHAKE')).toBeDefined();
  });

  it('transitions to intent phase on button click', async () => {
    render(<ProjectAssessmentHub onLogin={mockLogin} />);
    const startBtn = screen.getByText('INITIATE_AUDIT_HANDSHAKE');
    fireEvent.click(startBtn);
    
    // Wait for transition
    expect(await screen.findByText('Business')).toBeDefined();
    expect(screen.getByText('Intent')).toBeDefined();
  });

  it('shows validation error if intent is empty and Next is clicked', async () => {
    render(<ProjectAssessmentHub onLogin={mockLogin} />);
    fireEvent.click(screen.getByText('INITIATE_AUDIT_HANDSHAKE'));
    
    const nextBtn = await screen.findByText('NEXT_PHASE');
    fireEvent.click(nextBtn);
    
    expect(await screen.findByText(/Institutional intent manifest is too brief/i)).toBeDefined();
  });

  it('allows selecting urgency levels', () => {
    render(<ProjectAssessmentHub onLogin={mockLogin} />);
    const expeditedBtn = screen.getByText('Expedited');
    fireEvent.click(expeditedBtn);
    
    // Check if subtext is visible or class changed (implementation dependent)
    expect(screen.getByText('T+24h Uplink')).toBeDefined();
  });
});
