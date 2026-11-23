module.exports = class BasePage {
  async waitAndClick(el, timeout = 15000) {
    await el.waitForDisplayed({ timeout });
    await el.click();
  }

  async waitAndType(el, text, timeout = 15000) {
    await el.waitForDisplayed({ timeout });
    await el.setValue(text);
  }

  async getTextOf(el, timeout = 15000) {
    await el.waitForDisplayed({ timeout });
    return el.getText();
  }
};