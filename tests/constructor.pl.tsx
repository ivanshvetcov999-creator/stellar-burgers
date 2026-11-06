import { test, expect } from '@playwright/test';

test.describe('Конструктор бургеров', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/burger-api.har', {
      url: '**/api/**',
      update: false,
    });

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=Bearer test-access-token; path=/';
    });

    await page.goto('/');

    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
  });

  test('добавление булки и начинки в конструктор', async ({ page }) => {
    const bunCard = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });

    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page.locator('li').filter({
      hasText: 'Филе Люминесцентного тетраодонтимформа',
    });

    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-bun-1')).toContainText(
      'Краторная булка N-200i'
    );

    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      'Филе Люминесцентного тетраодонтимформа'
    );
  });

  test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    const modal = page.getByRole('dialog');

    await expect(modal).toBeVisible();

    await expect(modal.getByText('Детали ингредиента')).toBeVisible();

    await expect(
      modal.getByRole('heading', { name: 'Краторная булка N-200i' })
    ).toBeVisible();

    await expect(modal.getByText('Калории, ккал')).toBeVisible();
    await expect(modal.getByText('Белки, г')).toBeVisible();
    await expect(modal.getByText('Жиры, г')).toBeVisible();
    await expect(modal.getByText('Углеводы, г')).toBeVisible();

    await expect(modal.getByText('420', { exact: true })).toBeVisible();
    await expect(modal.getByText('80', { exact: true })).toBeVisible();
    await expect(modal.getByText('24', { exact: true })).toBeVisible();
    await expect(modal.getByText('53', { exact: true })).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(modal).not.toBeVisible();
  });

  test('закрытие модального окна кликом по оверлею', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    await page.locator('[class*="overlay"]').click({ position: { x: 5, y: 5 } });

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('оформление заказа и очистка конструктора', async ({ page }) => {
    const addButtons = page.getByRole('button', { name: 'Добавить' });

    await addButtons.nth(0).click();
    await addButtons.nth(1).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const orderModal = page.getByRole('dialog');

    await expect(orderModal).toBeVisible();
    await expect(orderModal.getByText('12345', { exact: true })).toBeVisible();

    await expect(page.getByTestId('constructor-bun-1')).not.toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
  });
});
