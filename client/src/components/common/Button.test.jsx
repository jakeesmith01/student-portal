import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ApplyButton } from './Button' 

describe('Button component', () => {
    it('render the button with the correct label', () => {
        render(<ApplyButton/>)
        expect(screen.getAllByText('Apply!')[0]).toBeInTheDocument()
    });
})