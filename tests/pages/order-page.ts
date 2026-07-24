import { expect, Locator, Page } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { Button } from '../atoms/Button'
import { OrderNotFoundPage } from './order-not-found-page'
import { OrderDetailsPage } from './order-details-page'
import { AuthorizedPage } from './authorized-page'
import { Input } from '../atoms/Input'
import { Popup } from '../atoms/Popup'

export class OrderPage extends AuthorizedPage {
  readonly title: Locator
  readonly createOrderButton: Button
  readonly nameInput: Input
  readonly phoneInput: Input
  readonly commentInput: Input
  readonly confirmationPopup: Popup

  // search popup
  protected readonly searchPopup: Locator
  readonly searchInput: Input
  readonly searchButton: Button

  constructor(page: Page) {
    super(page)
    this.title = page.locator('h2')
    this.createOrderButton = new Button(page.getByTestId('createOrder-button'))
    this.nameInput = new Input(page.getByTestId('username-input'))
    this.phoneInput = new Input(page.getByTestId('phone-input'))
    this.commentInput = new Input(page.getByTestId('comment-input'))
    this.confirmationPopup = new Popup(page.getByTestId('orderSuccessfullyCreated-popup'))

    // search popup
    this.searchPopup = page.getByTestId('searchOrder-popup')
    this.searchInput = new Input(this.searchPopup.getByTestId('searchOrder-input'))
    this.searchButton = new Button(this.searchPopup.getByTestId('searchOrder-submitButton'))
  }

  async checkInnerComponents(): Promise<void> {
    await expect(this.title).toBeVisible()
    await this.statusButton.checkVisibility(true)
    await this.createOrderButton.checkVisibility(true)
    await this.nameInput.checkVisibility(true)
    await this.phoneInput.checkVisibility(true)
    await this.commentInput.checkVisibility(true)
  }

  async createOrder(): Promise<void> {
    await this.nameInput.fill(faker.person.firstName())
    await this.phoneInput.fill(faker.phone.number())
    await this.commentInput.fill(faker.lorem.sentence(5))
    await this.createOrderButton.click()
    await this.confirmationPopup.checkVisibility(true)
  }

  async checkOrderNotFound(): Promise<OrderNotFoundPage> {
    await this.statusButton.click()
    await this.searchInput.fill('0')
    await this.searchButton.click()
    return new OrderNotFoundPage(this.page)
  }

  async checkOrderFound(id: number): Promise<OrderDetailsPage> {
    await this.statusButton.click()
    await this.searchInput.fill(`${id}`)
    await this.searchButton.click()
    return new OrderDetailsPage(this.page)
  }
}
