import { test, expect } from '@playwright/test'

test('homepage has correct title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Yet Another Path Planner')
})

test('homepage displays heading and feature cards', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Yet Another Path Planner')
  await expect(page.getByText('Find Tours')).toBeVisible()
  await expect(page.getByText('Create Tours')).toBeVisible()
  await expect(page.getByText('Track Progress')).toBeVisible()
})
