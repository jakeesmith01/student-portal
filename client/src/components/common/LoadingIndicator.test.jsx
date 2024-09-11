import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LoadingIndicator from './LoadingIndicator' 

describe('Loading indicator component', () => {
    it('render the loading image correctly', () => {
        render(<LoadingIndicator/>)
        const imgElement = screen.getByRole('img', { name: /loading/i })
        expect(imgElement).toBeInTheDocument()
        expect(imgElement).toHaveAttribute('src', '/img/loading.svg')
        expect(imgElement).toHaveAttribute('alt', 'Loading...')
    });

    it('handles image error', () => {
        const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {})

        render(<LoadingIndicator/>)

        const imgElement = screen.getAllByRole('img', { name: /loading/i })[0]
        fireEvent.error(imgElement)
        expect(mockAlert).toHaveBeenCalledWith('Failed to load the image!')
        mockAlert.mockRestore()
    });
})