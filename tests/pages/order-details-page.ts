import { expect, Locator, Page } from '@playwright/test'
import { AuthorizedPage } from './authorized-page'

export class OrderDetailsPage extends AuthorizedPage {
  readonly details: Locator

  constructor(page: Page) {
    super(page)
    this.details = this.page.locator('.order-details')
  }

  async checkVisibility(visible: boolean): Promise<void> {
    await expect(this.details).toBeVisible({ visible })
  }
}
