
import { test, expect } from '@playwright/test';

test.describe('Конструктор бургеров', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/burger-api.har', {
      url: 'https://norma.ffapi.ru/api/**',
      update: false
    });

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=Bearer test-access-token; path=/';
    });

    await page.goto('/');

    await expect(
      page.getByText('Краторная булка N-200i')
    ).toBeVisible();
  });

  test('добавление булки и начинки в конструктор', async ({ page }) => {
    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' });

    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page
      .locator('li')
      .filter({
        hasText: 'Филе Люминесцентного тетраодонтимформа'
      });

    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      page.getByTestId('constructor-bun-1')
    ).toContainText('Краторная булка N-200i');

    await expect(
      page.getByTestId('constructor-ingredients')
    ).toContainText('Филе Люминесцентного тетраодонтимформа');
  });

  test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    const modalTitle = page.getByText('Детали ингредиента');

    await expect(modalTitle).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Краторная булка N-200i' })
    ).toBeVisible();

    await expect(page.getByText('Калории, ккал')).toBeVisible();
    await expect(page.getByText('Белки, г')).toBeVisible();
    await expect(page.getByText('Жиры, г')).toBeVisible();
    await expect(page.getByText('Углеводы, г')).toBeVisible();

    await expect(page.getByText('420', { exact: true })).toBeVisible();
    await expect(page.getByText('80', { exact: true })).toBeVisible();
    await expect(page.getByText('24', { exact: true })).toBeVisible();
    await expect(page.getByText('53', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(modalTitle).not.toBeVisible();
  });

  test('закрытие модального окна кликом по оверлею', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    await expect(
      page.getByText('Детали ингредиента')
    ).toBeVisible();

    await page
      .locator('[class*="overlay"]')
      .click({ position: { x: 5, y: 5 } });

    await expect(
      page.getByText('Детали ингредиента')
    ).not.toBeVisible();
  });

  test('оформление заказа и очистка конструктора', async ({ page }) => {
    const addButtons = page.getByRole('button', { name: 'Добавить' });

    await addButtons.nth(0).click();
    await addButtons.nth(1).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText('12345')).toBeVisible();

    await expect(
      page.getByTestId('constructor-bun-1')
    ).not.toBeVisible();

    await expect(
      page.getByText('Выберите булки').first()
    ).toBeVisible();
  });
});
