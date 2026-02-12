import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import Home from './page'

afterEach(cleanup)

describe('Home', () => {
  it('renders the heading and feature cards', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { level: 1, name: /yet another path planner/i }))
      .toBeTruthy()

    expect(screen.getByRole('heading', { level: 2, name: /find tours/i })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: /create tours/i })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: /track progress/i })).toBeTruthy()
  })
})
