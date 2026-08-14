import { test } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { PASSWORD, USERNAME } from '../../config/env-data'
import { ENDPOINTS } from '../../utils/endpoints'
import { fakeJwt } from '../../utils/jwt'
import { TEST_DATA } from '../../utils/test-data'

test.describe('Mocked order flows', async () => {

  test.beforeEach(async ({ page }) => {
    await page.route(`**${ENDPOINTS.STUDENTS}`, async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: fakeJwt(),
        })
      } else {
        await route.continue()
      }
    })
  })

  test('Mocked order creation', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)

    await page.route(`**${ENDPOINTS.ORDERS}`, async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(TEST_DATA.CREATE_ORDER_RESPONSE),
        })
      } else {
        await route.continue()
      }
    })

    await orderPage.createOrder()
  })

  test('Mocked order search - found (OPEN)', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)

    await page.route(`**${ENDPOINTS.ORDER_BY_ID}`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(TEST_DATA.CREATE_ORDER_RESPONSE),
        })
      } else {
        await route.continue()
      }
    })

    const orderDetailsPage = await orderPage.checkOrderFound(TEST_DATA.CREATE_ORDER_RESPONSE.id)
    await orderDetailsPage.checkVisibility(true)
  })

  test('Mocked order search - found (DELIVERED)', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)

    await page.route(`**${ENDPOINTS.ORDER_BY_ID}`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(TEST_DATA.GET_ORDER_DELIVERED_RESPONSE),
        })
      } else {
        await route.continue()
      }
    })

    const orderDetailsPage = await orderPage.checkOrderFound(
      TEST_DATA.GET_ORDER_DELIVERED_RESPONSE.id,
    )
    await orderDetailsPage.checkVisibility(true)
  })

  test('Mocked order search - not found (404)', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)

    await page.route(`**${ENDPOINTS.ORDER_BY_ID}`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Order not found' }),
        })
      } else {
        await route.continue()
      }
    })

    const orderNotFoundPage = await orderPage.checkOrderNotFound()
    await orderNotFoundPage.checkVisibility(true)
  })

  test('Mocked server error (500)', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)

    await page.route(`**${ENDPOINTS.ORDER_BY_ID}`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        })
      } else {
        await route.continue()
      }
    })

    const orderNotFoundPage = await orderPage.checkOrderNotFound()
    await orderNotFoundPage.checkVisibility(true)
  })

})
