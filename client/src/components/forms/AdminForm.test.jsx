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
        fetchUserDetailsForApplication.mockResolvedValue({
            firstName: 'John',
            lastName: 'Doe',
            wid: '12345',
            advisor: 'Sheryl Cornell',
        })
        fetchCourses.mockResolvedValue({
            courses: [
                { class_subject: 'CS', class_catalog: '101', class_descr: 'intro to CS', status: 'Complete', grade: 'A' }
            ],
        })

        render(
            <UserContext.Provider value={mockUser}>
                <AdminForm/>
            </UserContext.Provider>
        );

        expect(screen.getByAltText('Loading...')).toBeInTheDocument()
        expect(screen.getByRole('img', '/img/loading.svg')).toBeInTheDocument()
    })

    it('renders the admin form after loading is finished', async () => {
        fetchUserDetailsForApplication.mockResolvedValue({
            firstName: 'John',
            lastName: 'Doe',
            wid: '12345',
            advisor: 'Sheryl Cornell',
        })
        fetchCourses.mockResolvedValue({
            courses: [
                { class_subject: 'CS', class_catalog: '101', class_descr: 'intro to CS', status: 'Complete', grade: 'A' }
            ],
        })

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