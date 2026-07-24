import { expect, Locator, Page } from '@playwright/test'
import { OrderPage } from './order-page'
import { SERVICE_URL } from '../../config/env-data'
import { BasePage } from './base-page'
import { Button } from '../atoms/Button'

export class LoginPage extends BasePage {
  private readonly url: string = SERVICE_URL
  readonly signInButton: Button
  readonly usernameField: Locator
  readonly passwordField: Locator

  constructor(page: Page) {
    super(page)
    this.signInButton = new Button(page.getByTestId('signIn-button'))
    this.usernameField = page.getByTestId('username-input')
    this.passwordField = page.getByTestId('password-input')
  }

  async open() {
    await this.page.goto(this.url)
  }

  async signIn(username: string, password: string) {
    await this.usernameField.fill(username)
    await this.passwordField.fill(password)
    await this.signInButton.click()
    return new OrderPage(this.page)
  }

  async checkInnerComponents(): Promise<void> {
    await expect(this.usernameField).toBeVisible()
    await expect(this.passwordField).toBeVisible()
    await this.signInButton.checkVisibility(true)
  }
}
