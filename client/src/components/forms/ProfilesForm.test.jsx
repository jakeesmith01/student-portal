import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ProfilesForm from './ProfilesForm';
import { UserContext } from '../../context/UserContext';
import { fetchCourses, updateAdvisor, submitApplication, fetchUserDetailsForApplication } from '../../services/api';

const mockUser = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@ksu.edu',
    wid: '12345',
    eid: '1234'
}

describe('Profiles form', () => {
    beforeEach(() => {
        render(
            <UserContext.Provider value={mockUser}>
                <ProfilesForm/>
            </UserContext.Provider>
        )
    })

    it('loads the profile form with the correct users data', () => {
        expect(screen.getByLabelText(/First Name/i)).toHaveValue(mockUser.first_name)
        expect(screen.getByLabelText(/Last Name/i)).toHaveValue(mockUser.last_name)
    })

    it('updates the profile form with the corrected user information', () => {
        const firstNameInput = screen.getByLabelText(/First Name/i)
        const lastNameInput = screen.getByLabelText(/Last Name/i)

        fireEvent.change(firstNameInput, {target: { value: 'Jane' }})
        fireEvent.change(lastNameInput, {target: {value: 'Smith' }})

        expect(screen.getByLabelText(/First Name/i)).toHaveValue('Jane')
        expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Smith')
    })

    it('renders the help message', () => {
        expect(screen.getAllByText('Contact your advisor or department to update these items if they are incorrect')[0]).toBeInTheDocument()
    })
})