import { test } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { PASSWORD, USERNAME } from '../../config/env-data'
import { ENDPOINTS } from '../../utils/endpoints'
import { fakeJwt } from '../../utils/jwt'
import { TEST_DATA } from '../../utils/test-data'

test.describe('Mocked order flows', async () => {
  test('Mocked order creation', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()

    await page.route(`**${ENDPOINTS.STUDENTS}`, async (route) => {
      await route.fulfill({ body: fakeJwt() })
    })

    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)

    await page.route(`**${ENDPOINTS.ORDERS}`, async (route) => {
      await route.fulfill({
        status: 200,
        json: TEST_DATA.CREATE_ORDER_RESPONSE,
        contentType: 'application/json',
      })
    })

    await orderPage.createOrder()
  })

  test('Mocked order search - found', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()

    await page.route(`**${ENDPOINTS.STUDENTS}`, async (route) => {
      await route.fulfill({ body: fakeJwt() })
    })

    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)

    await page.route(`**${ENDPOINTS.ORDERS}/*`, async (route) => {
      await route.fulfill({
        status: 200,
        json: TEST_DATA.CREATE_ORDER_RESPONSE,
        contentType: 'application/json',
      })
    })

    const orderDetailsPage = await orderPage.checkOrderFound(TEST_DATA.CREATE_ORDER_RESPONSE.id)

    await orderDetailsPage.checkVisibility(true)
  })

  test('Mocked order search - not found', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()

    await page.route(`**${ENDPOINTS.STUDENTS}`, async (route) => {
      await route.fulfill({ body: fakeJwt() })
    })

    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)

    await page.route(`**${ENDPOINTS.ORDERS}/*`, async (route) => {
      await route.fulfill({
        status: 200,
      })
    })

    const orderNotFoundPage = await orderPage.checkOrderNotFound()
    await orderNotFoundPage.checkVisibility(true)
  })

  test('Mocked server error', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()

    await page.route(`**${ENDPOINTS.STUDENTS}`, async (route) => {
      await route.fulfill({ body: fakeJwt() })
    })

    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)

    await page.route(`**${ENDPOINTS.ORDERS}/*`, async (route) => {
      await route.fulfill({
        status: 500,
      })
    })

    const orderNotFoundPage = await orderPage.checkOrderNotFound()
    await orderNotFoundPage.checkVisibility(true)
  })
})
