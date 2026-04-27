import { test, expect, Page } from '@playwright/test';

test.describe('Habit Tracker PWA E2E Flow', () => {
  
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Clear storage before each test to ensure a clean slate
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should allow a user to sign up, log in, and create a habit', async ({ page }: { page: Page }) => {
    // 1. Start at Login, navigate to Signup
    await page.goto('/login');
    await page.click('text=Sign up'); // Using the navigation link we built
    await expect(page).toHaveURL(/\/signup/);

    // 2. Perform Signup
    await page.fill('[data-testid="auth-signup-email"]', 'wizard@example.com');
    await page.fill('[data-testid="auth-signup-password"]', 'Password123!');
    await page.click('[data-testid="auth-signup-button"]');

    // 3. Verify Dashboard Redirect (Route Contract)
    await expect(page).toHaveURL(/\/dashboard/);

    // 4. Create a Habit
    const habitName = 'Read 20 Pages';
    await page.fill('[data-testid="habit-name-input"]', habitName);
    await page.fill('[data-testid="habit-description-input"]', 'Daily reading habit');
    await page.click('[data-testid="habit-save-button"]');

    // 5. Verify Habit Appears in List with correct Slug TestID
    // getHabitSlug('Read 20 Pages') -> 'read-20-pages'
    const habitCard = page.locator('[data-testid="habit-card-read-20-pages"]');
    await expect(habitCard).toBeVisible();
    await expect(habitCard).toContainText(habitName);
  });

  test('should redirect unauthenticated users to login page', async ({ page }: { page: Page }) => {
    // Attempt to access dashboard directly
    await page.goto('/dashboard');
    
    // Per Route Contract, should be pushed back to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display splash screen on initial load', async ({ page }: { page: Page }) => {
    await page.goto('/login');
    
    // Check for the splash screen element before the timer clears it
    const splash = page.locator('[data-testid="splash-screen"]');
    await expect(splash).toBeVisible();
    
    // After our 1200ms delay, it should be gone
    await expect(splash).not.toBeVisible({ timeout: 5000 });
  });

});
