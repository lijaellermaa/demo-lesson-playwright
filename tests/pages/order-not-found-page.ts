import { BasePage } from './base-page'
import { expect, Locator, Page } from '@playwright/test'

export class OrderNotFoundPage extends BasePage {
  readonly container: Locator

  constructor(page: Page) {
    super(page)
    this.container = this.page.getByTestId('orderNotFound-container')
  }

  async checkVisibility(visible: boolean): Promise<void> {
    await expect(this.container).toBeVisible({ visible })
  }
}
