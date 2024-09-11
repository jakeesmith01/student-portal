import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ErrorPage from './ErrorPage' 

describe('Error page component', () => {
    it('render the error with the correct text', () => {
        render(
            <MemoryRouter>
                <ErrorPage />
            </MemoryRouter>
        )
        expect(screen.getByText('A Happy Little Accident (The page you are viewing does not exist 😞)')).toBeInTheDocument()
    });

    it('displays the image with correct alt text', () => {
        render(
            <MemoryRouter>
                <ErrorPage />
            </MemoryRouter>
        )
        const imageElement = screen.getAllByAltText('Bob Ross')[0]
        expect(imageElement).toBeInTheDocument()
    });
})