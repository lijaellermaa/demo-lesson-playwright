import { BasePage } from './base-page'
import { Button } from '../atoms/Button'
import { Page } from '@playwright/test'

export class AuthorizedPage extends BasePage {
  readonly logoutButton: Button
  readonly statusButton: Button

  constructor(page: Page) {
    super(page)
    this.logoutButton = new Button(page.getByTestId('logout-button'))
    this.statusButton = new Button(page.getByTestId('openStatusPopup-button'))
  }
}
