import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AdminForm from './AdminForm';
import { UserContext } from '../../context/UserContext';
import { fetchCourses, updateAdvisor, submitApplication, fetchUserDetailsForApplication } from '../../services/api';


vi.mock('../../services/api', () => ({
    fetchCourses: vi.fn(),
    updateAdvisor: vi.fn(),
    submitApplication: vi.fn(),
    fetchUserDetailsForApplication: vi.fn(),
}))

const mockUser = {
    isLoggedIn: true,
    eid: '12345',
}

describe('Admin form', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('Admin form renders LoadingIndicator when loading', () => {
        render(
            <UserContext.Provider value={mockUser}>
                <AdminForm/>
            </UserContext.Provider>
        );

        expect(screen.getByAltText('Loading...')).toBeInTheDocument()
        expect(screen.getByRole('img', '/img/loading.svg')).toBeInTheDocument()
    })

    it('renders the admin form after loading is finished', async () => {
        render(
            <UserContext.Provider value={mockUser}>
                <AdminForm/>
            </UserContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByAltText('Loading...')).toBeInTheDocument()
            expect(screen.getByRole('img', 'img/loading.svg'))
        })
    })
})