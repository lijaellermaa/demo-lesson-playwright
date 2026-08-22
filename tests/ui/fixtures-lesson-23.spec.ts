import { test } from '../fixtures/delivery.fixture'

test.describe('Order flows with fixtures', () => {
  test('Order creation with fixture', async ({ orders }) => {
    await orders.checkInnerComponents()
    await orders.createOrder()
  })

  test('Search for an existing order created through API with fixture', async ({
    orders,
    orderId,
  }) => {
    await orders.checkInnerComponents()

    const orderDetailsPage = await orders.checkOrderFound(Number(orderId))
    await orderDetailsPage.checkVisibility(true)
  })
})
