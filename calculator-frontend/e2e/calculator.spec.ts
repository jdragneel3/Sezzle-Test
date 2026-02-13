import { test, expect } from '@playwright/test'

test.describe('Calculator E2E', () => {
  test('should perform basic addition', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '5' }).click()
    await page.getByRole('button', { name: '+', exact: true }).click()
    await page.getByRole('button', { name: '3' }).click()
    await page.getByRole('button', { name: '=' }).click()
    await expect(page.getByLabel(/display/i).getByText('8')).toBeVisible({ timeout: 10000 })
  })

  test('should handle decimal numbers', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '3' }).click()
    await page.getByRole('button', { name: '.' }).click()
    await page.getByRole('button', { name: '1' }).click()
    await page.getByRole('button', { name: '4' }).click()
    await page.getByRole('button', { name: '+', exact: true }).click()
    await page.getByRole('button', { name: '2' }).click()
    await page.getByRole('button', { name: '.' }).click()
    await page.getByRole('button', { name: '8' }).click()
    await page.getByRole('button', { name: '6' }).click()
    await page.getByRole('button', { name: '=' }).click()
    await expect(page.getByLabel(/display/i).getByText('6')).toBeVisible({ timeout: 10000 })
  })

  test('should show error for division by zero', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '1' }).click()
    await page.getByRole('button', { name: '0' }).click()
    await page.getByRole('button', { name: '÷' }).click()
    await page.getByRole('button', { name: '0' }).click()
    await page.getByRole('button', { name: '=' }).click()
    await expect(page.getByText(/cannot divide by zero/i)).toBeVisible({ timeout: 5000 })
  })

  test('should clear calculator with AC', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '9' }).click()
    await page.getByRole('button', { name: 'AC' }).click()
    await expect(page.getByLabel(/display/i).getByText('0')).toBeVisible()
  })

  test('should support keyboard input', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('application', { name: 'Calculator' }).click()
    await page.keyboard.press('8')
    await page.keyboard.press('1')
    await expect(page.getByLabel(/display/i).getByText('81')).toBeVisible({ timeout: 5000 })
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await expect(page.getByRole('application', { name: 'Calculator' })).toBeVisible()
    await expect(page.getByRole('button', { name: '5' })).toBeVisible()
  })
})
