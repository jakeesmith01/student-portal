import { expect, describe, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx';
import { UserContext, UserProvider } from './context/UserContext.jsx'

vi.mock('./context/UserContext.jsx', async (importOriginal) => {
    const original = await importOriginal()
    
    return{
        ...original,
        UserProvider: ({ children, value }) => (
            <UserContext.Provider value={value}>
                {children}
            </UserContext.Provider>
        ),
    }
    
});


describe('App Component', () => {

    it('Renders home page if the user is logged in', async () => {       

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ name: 'John Doe', email: 'johnd@ksu.edu' })
            })
        )

        render(
            <UserContext.Provider value={{ name: 'John Doe', email: 'johnd@ksu.edu' }}>
                <App/>
            </UserContext.Provider>
        );

        expect(screen.getAllByText('CS Applications')[0]).toBeInTheDocument();
    })

})