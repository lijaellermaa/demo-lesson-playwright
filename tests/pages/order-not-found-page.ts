import { expect, Locator, Page } from '@playwright/test'
import { AuthorizedPage } from './authorized-page'

export class OrderNotFoundPage extends AuthorizedPage {
  readonly container: Locator

  constructor(page: Page) {
    super(page)
    this.container = this.page.getByTestId('orderNotFound-container')
  }

  async checkVisibility(visible: boolean): Promise<void> {
    await expect(this.container).toBeVisible({ visible })
  }
}
