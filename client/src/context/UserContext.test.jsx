import { expect, describe, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx';
import { UserProvider } from './UserContext.jsx'

beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,  // Simulating a logged out response
        json: () => Promise.resolve({}),  // Empty response
      })
    )
});

describe('User Context', () => {
    it('Renders not logged in if the user is not logged in', () => {
        render(
            <UserProvider>
                <MemoryRouter intialEntries={['/']}>
                    <App/>
                </MemoryRouter>
            </UserProvider>
        )
        
        expect(screen.getAllByText('Not logged in')[0]).toBeInTheDocument()
    })
})

