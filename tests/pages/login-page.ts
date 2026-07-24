import { Page } from '@playwright/test'
import { OrderPage } from './order-page'
import { SERVICE_URL } from '../../config/env-data'
import { BasePage } from './base-page'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { Popup } from '../atoms/Popup'

export class LoginPage extends BasePage {
  private readonly url: string = SERVICE_URL
  readonly signInButton: Button
  readonly usernameField: Input
  readonly passwordField: Input
  readonly errorPopup: Popup

  constructor(page: Page) {
    super(page)
    this.signInButton = new Button(page.getByTestId('signIn-button'))
    this.usernameField = new Input(page.getByTestId('username-input'))
    this.passwordField = new Input(page.getByTestId('password-input'))
    this.errorPopup = new Popup(page.getByTestId('authorizationError-popup'))
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
    await this.usernameField.checkVisibility(true)
    await this.passwordField.checkVisibility(true)
    await this.signInButton.checkVisibility(true)
  }
}
