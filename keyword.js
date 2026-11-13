import allureReporter from "@wdio/allure-reporter";
import nearestColor from "nearest-color";
import colorName from "color-name";
import Jimp from "jimp";

// convert RGB arrays to HEX strings
const namedColors = nearestColor.from(
  Object.fromEntries(
    Object.entries(colorName).map(([name, rgb]) => {
      const hex = `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
        .toString(16)
        .slice(1)}`;
      return [name, hex];
    })
  )
);

export class keywords {
  async AllureColorScreenshot(stepName, rgba) {
    const hex = `#${((1 << 24) + (rgba.r << 16) + (rgba.g << 8) + rgba.b)
      .toString(16)
      .slice(1)}`;
    const closestColor = namedColors(hex).name;

    const screenshot = await browser.takeScreenshot();
    allureReporter.addAttachment(
      `${stepName} - ${closestColor}`,
      Buffer.from(screenshot, "base64"),
      "image/png"
    );

    console.log(
      `${stepName} - RGBA: R:${rgba.r}, G:${rgba.g}, B:${rgba.b}, A:${rgba.a} | Closest Name: ${closestColor}`
    );
    return closestColor;
  }

  async _attachScreenshotToAllure(name = "screenshot") {
    try {
      // browser.takeScreenshot() returns base64 string
      const b64 = await browser.takeScreenshot();
      // convert base64 -> Buffer and attach
      const buffer = Buffer.from(b64, "base64");
      allureReporter.addAttachment(name, buffer, "image/png");
      console.log(`[ALLURE] Attached screenshot: ${name}`);
    } catch (err) {
      console.warn("[ALLURE] Failed to attach screenshot:", err);
    }
  }

  async getButtonColor(element) {
    const screenshot = await browser.takeScreenshot();
    const buffer = Buffer.from(screenshot, "base64");
    const img = await Jimp.read(buffer);

    const location = await element.getLocation();
    const size = await element.getSize();

    const x = Math.floor(location.x + size.width / 2);
    const y = Math.floor(location.y + size.height / 2);

    const pixel = img.getPixelColor(x, y);
    const rgba = Jimp.intToRGBA(pixel);
    console.log("Detected RGBA:", rgba);
    return rgba;
  }

  // async verifyButtonColor(
  //   element,
  //   expectedColorName,
  //   stepName = "Verify Button Color"
  // ) {
  //   try {
  //     allureReporter.startStep(stepName);
  //     console.log(`[ACTION] ${stepName}`);

  //     // 1️⃣ Get button RGBA
  //     const rgba = await this.getButtonColor(element);
  //     console.log(`Detected RGBA Color: ${rgba}`);

  //     // 2️⃣ This method already ATTACHES screenshot → KEEP this
  //     const nearestColor = await this.AllureColorScreenshot(stepName, rgba);
  //     console.log(`Nearest Color Name: ${nearestColor}`);

  //     // 3️⃣ Assertion
  //     expect(nearestColor).toEqual(expectedColorName);

  //     // ❌ REMOVE this line (to avoid duplicate screenshot)
  //     // await this._attachScreenshotToAllure(`${stepName} - Passed`);

  //     allureReporter.endStep("passed");
  //     return nearestColor;
  //   } catch (err) {
  //     console.error(`[ERROR] ${stepName}:`, err);

  //     // Only keep FAILURE screenshot (important)
  //     await this._attachScreenshotToAllure(`${stepName} - Failed`);

  //     allureReporter.endStep("failed");
  //     throw err;
  //   }
  // }

  async verifyButtonColor(
  element,
  expectedColorName,
  stepName = "Verify Button Color"
) {
  try {
    allureReporter.startStep(stepName);
    console.log(`[ACTION] ${stepName}`);

    // 1️⃣ Get button RGBA
    const rgba = await this.getButtonColor(element);
    console.log(`Detected RGBA Color: ${rgba}`);

    // 2️⃣ This method already ATTACHES screenshot → KEEP this
    const nearestColor = await this.AllureColorScreenshot(stepName, rgba);
    console.log(`Nearest Color Name: ${nearestColor}`);

    // 3️⃣ Assertion
    expect(nearestColor).toEqual(expectedColorName);

    // ✅ ADD THIS PASS MESSAGE
    const passMessage = `✅ ${stepName} || Expected: ${expectedColorName} || Actual: ${nearestColor}`;
    console.log(passMessage);
    allureReporter.addStep(passMessage);

    allureReporter.endStep("passed");
    return nearestColor;

  } catch (err) {
    console.error(`[ERROR] ${stepName}:`, err);

    // ❌ ADD THIS FAIL MESSAGE
    const failMessage = `❌ ${stepName} || Expected: ${expectedColorName} || Actual: Color mismatch`;
    console.error(failMessage);
    allureReporter.addStep(failMessage);

    // Only keep FAILURE screenshot (important)
    await this._attachScreenshotToAllure(`${stepName} - Failed`);

    allureReporter.endStep("failed");
    throw err;
  }
}



  async AllurePass(message) {
    console.log(`✅ : ${message}`);
    process.emit("test:log", `✅ : ${message}`);
    allureReporter.addStep(`✅ : ${message}`, {}, "passed");
  }

  async AllurePass1(message) {
    allureReporter.addStep(`✅ : ${message}`, {}, "passed");
  }

  async AllureInfo(message) {
    allureReporter.addStep(`ℹ️ INFO: ${message}`, {}, "passed");
  }

  async AllureFail(message, error = null) {
    console.error(`❌ : ${message}`);
    process.emit("test:log", `❌ : ${message}`);
    allureReporter.addStep(`❌ : ${message}`, {}, "failed");

    if (error) {
      const errorDetails = error.stack || error.message || error;
      allureReporter.addAttachment("Error Details", errorDetails, "text/plain");
    }

    // Capture screenshot on failure
    const screenshot = await browser.takeScreenshot();
    allureReporter.addAttachment(
      "Failure Screenshot",
      Buffer.from(screenshot, "base64"),
      "image/png"
    );
  }

  async verifyElementDisplayed(locator, text) {
    allureReporter.startStep(`🔍 VERIFY: "${text}" is displayed or not`);
    try {
      await browser.pause(2000);
      await locator.waitForExist({ timeout: 90000 });
      const display = await locator.isDisplayed();
      if (display) {
        console.log(`${text} is displayed!!!`);
        await this.AllurePass(`"${text}" is displayed!!!`);
        allureReporter.endStep("passed");
      } else {
        console.log(`${text} is not displayed!!!`);
        await this.AllureFail(`"${text}" is not displayed!!!`);
        allureReporter.endStep("failed");
        throw new Error(`${text} should be displayed, but it is not.`);
      }
    } catch (err) {
      await this.AllureFail(`${text} is not displayed!!!`, err);
      allureReporter.endStep("failed");
      console.log(`${text} is not displayed!!!`);
      throw new Error(
        err.message || `${text} was not displayed due to an error.`
      );
    }
  }

  // async click(element, stepName = "Click Element") {
  //   try {
  //     allureReporter.startStep(stepName);
  //     console.log(`[ACTION] ${stepName}`);

  //     // await this.addBSStep(`Click: ${stepName}`);

  //     await element.waitForDisplayed({ timeout: 10000 });
  //     await element.click();

  //     // attach screenshot after success
  //     await this._attachScreenshotToAllure(`${stepName} - success`);

  //     allureReporter.endStep("passed");
  //   } catch (err) {
  //     console.error(`[ERROR] ${stepName}:`, err);

  //     // attach screenshot on failure
  //     await this._attachScreenshotToAllure(`${stepName} - failed`);
  //     // await this.addBSStep(`FAILED: ${stepName}`);
  //     allureReporter.endStep("failed");
  //     throw err;
  //   }
  // }

  async click(locator) {
    try {
        console.log('[ACTION] Click Element');

        // Convert locator string into a WebdriverIO element
        const element = typeof locator === 'string'
            ? await $(locator)
            : locator;

        await element.waitForDisplayed({ timeout: 15000 });
        await element.click();

        console.log('[SUCCESS] Element Clicked');
        await this.AllureScreenshot('Element Clicked');

    } catch (error) {
        console.error(`[ERROR] Click Element: ${error.message}`);
        await this.AllureScreenshot('Click Element - failed');
        throw error;
    }
}

  async setValue(element, value, stepName = "Set Value") {
    try {
      // Defensive: coerce/validate the value to be a string or number
      if (value === undefined || value === null) {
        throw new Error(
          `setValue called with ${value} for step "${stepName}". Check the test data or Excel lookup.`
        );
      }

      let finalValue = value;
      if (typeof value !== "string" && typeof value !== "number") {
        try {
          finalValue = String(value);
          console.warn(
            `[WARN] ${stepName}: coerced non-string value to string (${finalValue.length} chars)`
          );
        } catch (coerceErr) {
          throw new Error(
            `Failed to coerce value for ${stepName}: ${
              coerceErr.message || coerceErr
            }`
          );
        }
      }

      const step = `${stepName}: ${finalValue}`;
      allureReporter.startStep(step);
      console.log(`[ACTION] ${step}`);

      // await this.addBSStep(`Click: ${stepName}`);

      await element.waitForDisplayed({ timeout: 10000 });
      await element.setValue(finalValue);

      // attach screenshot after success
      await this._attachScreenshotToAllure(`${stepName} - success`);

      allureReporter.endStep("passed");
    } catch (err) {
      console.error(`[ERROR] ${stepName}:`, err);

      // attach screenshot on failure
      await this._attachScreenshotToAllure(`${stepName} - failed`);
      // await this.addBSStep(`FAILED: ${stepName}`);
      allureReporter.endStep("failed");
      throw err;
    }
  }

  async getText(element, stepName = "Get Text") {
    try {
      allureReporter.startStep(stepName);
      console.log(`[ACTION] ${stepName}`);

      await element.waitForDisplayed({ timeout: 10000 });
      const text = await element.getText();

      console.log(`[INFO] ${stepName} -> ${text}`);
      allureReporter.addStep(`Text: ${text}`, {}, "passed");
      // await this.addBSStep(`Click: ${stepName}`);

      // attach screenshot after success
      await this._attachScreenshotToAllure(`${stepName} - success`);

      allureReporter.endStep("passed");
      return text;
    } catch (err) {
      console.error(`[ERROR] ${stepName}:`, err);

      // attach screenshot on failure
      await this._attachScreenshotToAllure(`${stepName} - failed`);
      // await this.addBSStep(`FAILED: ${stepName}`);
      allureReporter.endStep("failed");
      throw err;
    }
  }

  async waitForDisplayed(
    element,
    timeout = 10000,
    stepName = "Wait For Element"
  ) {
    try {
      allureReporter.startStep(stepName);
      console.log(`[ACTION] ${stepName}`);

      await element.waitForDisplayed({ timeout });

      // attach screenshot after success
      await this._attachScreenshotToAllure(`${stepName} - success`);
      // await this.addBSStep(`Click: ${stepName}`);

      allureReporter.endStep("passed");
    } catch (err) {
      console.error(`[ERROR] ${stepName}:`, err);

      // attach screenshot on failure
      await this._attachScreenshotToAllure(`${stepName} - failed`);
      // await this.addBSStep(`FAILED: ${stepName}`);
      allureReporter.endStep("failed");
      throw err;
    }
  }

  async getButtonColor(element) {
    const screenshot = await browser.takeScreenshot();
    const buffer = Buffer.from(screenshot, "base64");
    const img = await Jimp.read(buffer);

    const location = await element.getLocation();
    const size = await element.getSize();

    // 5 sample points inside the button
    const points = [
      [0.2, 0.5], // left-center
      [0.4, 0.5], // mid-left
      [0.6, 0.5], // mid-right
      [0.8, 0.5], // right-center
      [0.5, 0.8], // lower-center
    ];

    const backgroundCandidates = [];

    for (const [px, py] of points) {
      const x = Math.floor(location.x + size.width * px);
      const y = Math.floor(location.y + size.height * py);

      const pixel = img.getPixelColor(x, y);
      const rgba = Jimp.intToRGBA(pixel);

      // Reject  (text, highlight)
      if (!(rgba.r > 230 && rgba.g > 230 && rgba.b > 230)) {
        backgroundCandidates.push(rgba);
      }
    }

    console.log("Sampled Background Pixels:", backgroundCandidates);

    // Return the darkest pixel → most accurate background
    backgroundCandidates.sort((a, b) => a.r + a.g + a.b - (b.r + b.g + b.b));

    return backgroundCandidates[0];
  }

  async AllureScreenshot(stepName) {
    const screenshot = await browser.takeScreenshot();
    allureReporter.addAttachment(
      stepName,
      Buffer.from(screenshot, "base64"),
      "image/png"
    );
  }

  async enterNumberOnScreen(number) {
    const digits = number.toString().split("");
    for (const digit of digits) {
      const button = await $(`//android.widget.TextView[@text="${digit}"]`);
      //android.widget.TextView[@text="2"]
      await button.click();
      await browser.pause(200); // optional small pause to let the app process the tap
    }
    // Optional: take a screenshot for Allure
    await this.AllureScreenshot(
      `Entered number ${number} using on-screen keys`
    );
  }

 async scrollToElement(text, index = 0) {
  try {
    await allureReporter.startStep(`Scroll to element with text: ${text} (index: ${index})`);

    const selector = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${text}").instance(${index}))`;

    const element = await $(selector);

    await element.waitForDisplayed({ timeout: 10000 });

    await allureReporter.endStep("passed");
    return element;

  } catch (error) {
    await allureReporter.endStep("failed");
    throw new Error(
      `Failed to scroll to element: ${text} (index: ${index}) || Error: ${error}`
    );
  }
}


  // async addBSStep(message) {
  //   await browser.executeScript(
  //     'browserstack_executor: {"action": "annotate", "arguments": {"data":"' +
  //       message +
  //       '", "level": "info"}}',
  //     []
  //   );
  // }
  async getToastMessage(timeout = 3000, stepName = "Read Toast Message") {
    try {
      allureReporter.startStep(stepName);
      console.log(`[ACTION] ${stepName}`);

      const start = Date.now();

      while (Date.now() - start < timeout) {
        const pageSource = await browser.getPageSource();

        // Match Android Toast (Appium returns Toast text inside pageSource)
        const toastMatches = pageSource.match(
          /<android\.widget\.Toast[^>]*text="([^"]+)"[^>]*\/>/g
        );

        if (toastMatches && toastMatches.length > 0) {
          const extract = toastMatches[0].match(/text="([^"]+)"/);
          if (extract && extract[1]) {
            const toastMsg = extract[1];

            // optional attachment (remove if you want)
            console.log(`[TOAST] ${toastMsg}`);

            allureReporter.endStep("passed");
            return toastMsg;
          }
        }

        // small polling sleep (100ms)
        await new Promise((r) => setTimeout(r, 100));
      }

      throw new Error("Toast message not found");
    } catch (err) {
      console.log("[ERROR] Toast read failed:", err);
      allureReporter.endStep("failed");
      return ""; // safe fallback
    }
  }
}
