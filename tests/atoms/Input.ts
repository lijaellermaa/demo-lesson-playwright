import { expect, Locator } from '@playwright/test'

export class Input {
  readonly inputLocator: Locator

  constructor(inputLocator: Locator) {
    this.inputLocator = inputLocator
  }

  async fill(value: string): Promise<void> {
    await this.inputLocator.fill(value)
  }

  async clear(): Promise<void> {
    await this.inputLocator.clear()
  }

  async checkVisibility(visible: boolean): Promise<void> {
    await expect(this.inputLocator).toBeVisible({ visible })
  }

  async checkValue(expectedValue: string): Promise<void> {
    await expect(this.inputLocator).toHaveValue(expectedValue)
  }
}
