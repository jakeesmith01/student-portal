import { expect, describe, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'
import App from '/client/App.jsx';
import { UserContext, UserProvider } from './context/UserContext.jsx'
import HomePage from './components/forms/HomePage.jsx'

it('Renders not logged in if the user is not logged in', async () => {
    render(
        <UserProvider>         
            <App/>                    
        </UserProvider>
    );
    
    expect(screen.getAllByText('Not logged in.')).toBeInTheDocument()
})
