import { test } from '@playwright/test'
import { PASSWORD, SERVICE_URL, USERNAME } from '../../config/env-data'
import { ENDPOINTS } from '../../utils/endpoints'
import { TEST_DATA } from '../../utils/test-data'
import { OrderPage } from '../pages/order-page'

test.describe('Mocked order flows with Local Storage', async () => {
  let orderPage: OrderPage

  test.beforeEach(async ({ context, page, request }) => {
    test.slow()

    const authResponse = await request.post(
      `https://backend.tallinn-learning.ee${ENDPOINTS.STUDENTS}`,
      {
        data: {
          username: `${USERNAME}`,
          password: `${PASSWORD}`,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const tokenText = (await authResponse.text()).trim()

    await context.addInitScript((token) => {
      window.localStorage.setItem('jwt', token)
    }, tokenText)

    await page.goto(`${SERVICE_URL}/signin`)
    await page.waitForLoadState('networkidle')

    orderPage = new OrderPage(page)
    await orderPage.checkInnerComponents()
  })

  test('Mocked order creation', async ({ page }) => {
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
