import { expect, Page, test as base } from '@playwright/test'
import { PASSWORD, SERVICE_URL, USERNAME } from '../../config/env-data'
import { ENDPOINTS } from '../../utils/endpoints'
import { LoginPage } from '../pages/login-page'
import { OrderPage } from '../pages/order-page'

type Fixtures = {
  auth: { jwt: string }
  orderId: string
  mainPage: Page
  login: LoginPage
  orders: OrderPage
}

export const test = base.extend<Fixtures>({
  auth: async ({ request }, use) => {
    console.log('Init: getting jwt')

    const response = await request.post(
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

    const jwt = (await response.text()).trim()

    await use({ jwt })
  },

  orderId: async ({ auth, request }, use) => {
    const cleanToken = auth.jwt.trim()

    const response = await request.post(`https://backend.tallinn-learning.ee${ENDPOINTS.ORDERS}`, {
      data: {
        status: 'OPEN',
        customerName: 'test',
        customerPhone: 'test',
        comment: 'test',
      },
      headers: {
        Authorization: `Bearer ${cleanToken}`.replace(/[\n\r]/g, ''),
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok()) {
      const errText = await response.text()
      throw new Error(
        `API Order creation failed with status ${response.status()}. Response: ${errText}`,
      )
    }

    const responseData = await response.json()
    const orderId = responseData.id
    console.log('order created with id: ', orderId)
    await use(orderId)
  },

  mainPage: async ({ context, auth }, use) => {
    test.slow()

    await context.addInitScript((token) => {
      window.localStorage.setItem('jwt', token)
    }, auth.jwt)

    const mainPage = await context.newPage()

    await mainPage.route(`**${ENDPOINTS.ORDERS}/*`, async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue()
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'DELIVERED',
            courierId: null,
            customerName: 'mocked customer',
            customerPhone: '99887766',
            comment: '',
            id: 9999,
          }),
        })
      }
    })

    await mainPage.goto(`${SERVICE_URL}/signin`)

    await mainPage.waitForLoadState('networkidle')

    await use(mainPage)
  },

  login: async ({ mainPage }, use) => {
    const login = new LoginPage(mainPage)
    await use(login)
  },

  orders: async ({ mainPage }, use) => {
    const orders = new OrderPage(mainPage)
    await use(orders)
  },
})

export { expect }
