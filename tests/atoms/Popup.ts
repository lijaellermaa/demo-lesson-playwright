import { expect, Locator } from '@playwright/test'

export class Popup {
  readonly popupLocator: Locator

  constructor(popupLocator: Locator) {
    this.popupLocator = popupLocator
  }

  async checkVisibility(visible: boolean): Promise<void> {
    await expect(this.popupLocator).toBeVisible({ visible })
  }

  async checkText(text: string): Promise<void> {
    await expect(this.popupLocator).toContainText(text)
  }
}
