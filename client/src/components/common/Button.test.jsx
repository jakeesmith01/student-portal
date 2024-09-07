import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

describe('Button component', () => {
    it('render the button with the correct label', () => {
        render(<Button/>)
        expect(screen.getByText('Apply!')).toBeInTheDocument()
    });
})