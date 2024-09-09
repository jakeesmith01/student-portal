import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProtectedAdminRoute from './ProtectedAdminRoute';
import { UserContext } from '../../context/UserContext';

describe('ProtectedAdminRoute component', () => {
    it('renders "Access Denied" when user is not an admin/logged in', () => {
        const mockUserContext = {
            userData: {
                wid: null,
                isAdmin: false
            }
        }

        render(
            <UserContext.Provider value={mockUserContext}>
                <ProtectedAdminRoute>
                    <h1>Admin Content</h1>
                </ProtectedAdminRoute>
            </UserContext.Provider>
        )

        expect(screen.getByText('Access Denied')).toBeInTheDocument()
    })

    it('renders the admin page when the user is an admin', () => {
        const mockUserContext = {
            userData: {
                wid: '1234',
                isAdmin: true
            }
        }

        render(
            <UserContext.Provider value={mockUserContext}>
                <ProtectedAdminRoute>
                    <h1>Admin Content</h1>
                </ProtectedAdminRoute>
            </UserContext.Provider>
        )

        expect(screen.getByText('Admin Content')).toBeInTheDocument()
    })

})