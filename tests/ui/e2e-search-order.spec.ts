import { test } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { PASSWORD, USERNAME } from '../../config/env-data'

const correctOrderId = 19067

test('Not found page test', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()

  const orderPage = await loginPage.signIn(USERNAME, PASSWORD)

  const orderNotFoundPage = await orderPage.checkOrderNotFound()
  await orderNotFoundPage.checkVisibility(true)
})

test('Found page test', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()

  const orderPage = await loginPage.signIn(USERNAME, PASSWORD)

  const orderDetailsPage = await orderPage.checkOrderFound(correctOrderId)
  await orderDetailsPage.checkVisibility(true)
})
