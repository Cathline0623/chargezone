const BasePage = require('./BasePage');

class SamplePage extends BasePage {
  get textInput()  { return $('~Text Input'); }
  get textButton() { return $('~Text Button'); }
  get textOutput() { return $('~Text Output'); }

  async enterTextAndSubmit(text) {
    await this.waitAndType(this.textInput, text);
    await this.waitAndClick(this.textButton);
  }

  async getOutput() {
    return this.getTextOf(this.textOutput);
  }
}

module.exports = new SamplePage();