const allure = require('@wdio/allure-reporter').default;

// Reusable step wrapper: pass aana green, fail aana red-a report la kaattum
const step = async (name, fn) => {
  allure.startStep(name);
  try {
    const result = await fn();
    allure.endStep('passed');
    return result;
  } catch (e) {
    allure.endStep('failed');
    throw e;
  }
};

const attachScreenshot = async (name) => {
  const png = await browser.takeScreenshot();
  allure.addAttachment(name, Buffer.from(png, 'base64'), 'image/png');
};

const generatePatientName = () => {
  const firstNames = [
    'Arun', 'Vikram', 'Karthik', 'Rahul', 'Pranav',
    'Ajay', 'Santhosh', 'Deepak', 'Manoj', 'Surya',
    'Rohan', 'Aditya', 'Varun', 'Naveen', 'Harish',
    'Rakesh', 'Gokul', 'Madhan', 'Vishal', 'Bharath'
  ];

  const lastNames = [
    'Kumar', 'Raj', 'Anand', 'Dev', 'Sharma',
    'Reddy', 'Krishnan', 'Verma', 'Prakash', 'Rajan',
    'Mehta', 'Nair', 'Das', 'Kapoor', 'Menon'
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
};



describe('Healync iOS - Login and Add Patient', () => {

  // ---------- HELPERS ----------
  const byText = (type, text) =>
    `-ios predicate string:type == "${type}" AND (name CONTAINS[c] "${text}" OR label CONTAINS[c] "${text}" OR value CONTAINS[c] "${text}")`;

  // Gets { x, y, width, height } in WebdriverIO
  const getBounds = async (element) => {
    const loc = await element.getLocation();
    const size = await element.getSize();
    return { x: loc.x, y: loc.y, width: size.width, height: size.height };
  };

  // Scrolls directly to an element using XCUITest's native scroll-to-visible, falling back to swipe
  const scrollToElement = async (element) => {
    try {
      await browser.execute('mobile: scroll', { element: element.elementId, toVisible: true });
    } catch (e) {
      await browser.execute('mobile: swipe', { direction: 'up' });
    }
  };

  // Taps via coordinate tap when forceCoords is true, or falls back to coordinate tap if .click() fails
  const safeTap = async (element, forceCoords = false) => {
    const tapByCoords = async () => {
      const rect = await getBounds(element);
      await browser.execute('mobile: tap', {
        x: Math.round(rect.x + rect.width / 2),
        y: Math.round(rect.y + rect.height / 2)
      });
    };

    if (forceCoords) {
      await tapByCoords();
      return;
    }

    try {
      await element.click();
    } catch (e) {
      await tapByCoords();
    }
  };

  const dismissKeyboard = async () => {
    try {
      await driver.hideKeyboard();
    } catch (e) {
      const doneKey = await $(byText('XCUIElementTypeButton', 'done'));
      if (await doneKey.isExisting().catch(() => false)) {
        await safeTap(doneKey, true);
      } else {
        await browser.execute('mobile: tap', { x: 200, y: 150 });
      }
    }
  };

  it('Should log in and register a new patient', async () => {
  await attachScreenshot('Before login - Dashboard');
    // ---------- LOGIN ----------
    const username = await $('//XCUIElementTypeTextField[@name="Phone number"]');
    await username.waitForDisplayed({ timeout: 30000 });
    await username.setValue('test_test');
      await attachScreenshot('Enter username');
    

    const password = await $('//XCUIElementTypeTextField[@name="Password"]');
    await password.waitForDisplayed({ timeout: 30000 });
    await password.click();
    await browser.pause(500);
    await browser.keys('Heal@sync1'.split(''));
      await attachScreenshot('Enter password');

    const signInButton = await $('//XCUIElementTypeButton[@name="Sign In"]');
    await signInButton.waitForDisplayed({ timeout: 30000 });
    await signInButton.click();
    console.log('Login button clicked');
      await attachScreenshot('After clicking Sign In');

    // ---------- VERIFY LOGIN POPUP (soft check) ----------
    const toastTitle = '-ios predicate string:name == "Login successful!"';
    const toastMsg = '-ios predicate string:name == "Redirecting to dashboard..."';

    try {
      await browser.waitUntil(
        async () => (await $$(toastTitle)).length > 0,
        { timeout: 10000, interval: 300 }
      );
      await expect($(toastTitle)).toBeExisting();
      await expect($(toastMsg)).toBeExisting();
      console.log('Popup verified: Login successful! / Redirecting to dashboard...');
    } catch (e) {
      console.log('Toast not caught (it may have disappeared quickly)');
    }

      await attachScreenshot('After login - Dashboard');
    // ---------- OPEN ADD PATIENT ----------
    const dashboardMarker = await $('-ios predicate string:name CONTAINS[c] "Appointments"');
    await dashboardMarker.waitForExist({ timeout: 20000 });
    await browser.pause(1000);

    // 1. Tap the bottom-right Floating Action Button (x=321, y=690)
    const addFabButton = await $(
      '-ios predicate string:type == "XCUIElementTypeButton" AND rect.x >= 300 AND rect.y >= 650 AND rect.y <= 730'
    );
    await addFabButton.waitForExist({ timeout: 15000 });
    await safeTap(addFabButton);

    // 2. Wait for speed-dial menu animation to settle, then force coordinate tap on "Add Patient"
    const addPatientMenuOption = await $(
      '-ios predicate string:(name CONTAINS[c] "Add Patient" OR label CONTAINS[c] "Add Patient")'
    );
    await addPatientMenuOption.waitForExist({ timeout: 10000 });
    await browser.pause(600);
    await safeTap(addPatientMenuOption, true);
      await attachScreenshot('Click Add Patient option');

    // 3. Wait for navigation to the Add Patient form
    await browser.waitUntil(
      async () =>
        (await $$(`-ios predicate string:type == "XCUIElementTypeTextField"`)).length > 0 ||
        (await $$(`-ios predicate string:name CONTAINS[c] "Appointments"`)).length === 0,
      {
        timeout: 10000,
        interval: 400,
        timeoutMsg: 'Did not navigate to Add Patient form after tapping Add Patient option'
      }
    );
    await browser.pause(1000);

    // ---------- FILL PATIENT FORM ----------

    // Step 1: Salutation
    const salutation = await $(
      '-ios predicate string:name == "Select" OR name == "Mr" OR label == "Select" OR label == "Mr"'
    );
    await salutation.waitForExist({ timeout: 10000 });
    await safeTap(salutation, true);
      await attachScreenshot('Click Salutation dropdown');

    // Step 2: Choose Mr from the list (skipped if no option appears)
    const mrOption = await $(byText('XCUIElementTypeButton', 'Mr'));
    if (await mrOption.waitForExist({ timeout: 5000 }).catch(() => false)) {
      await safeTap(mrOption, true);
    } else {
      console.log('No "Mr" option shown; assuming it is already selected');
    }


// Step 3: Patient name
const patientNameValue = generatePatientName();

const patientName = await $(byText('XCUIElementTypeTextField', 'patient name'));
await patientName.waitForExist({ timeout: 10000 });
await patientName.setValue(patientNameValue);

console.log(`Generated Patient Name: ${patientNameValue}`);
await attachScreenshot(`Enter patient name - ${patientNameValue}`);
    // Step 4: Phone number
    const phoneNumber = await $(byText('XCUIElementTypeTextField', 'phone'));
    await phoneNumber.waitForExist({ timeout: 10000 });
    await phoneNumber.setValue('9876545678');
    await attachScreenshot('Enter phone number');

    // Step 5: Referral source
    const referralSource = await $(byText('XCUIElementTypeTextField', 'referral'));
    await referralSource.waitForExist({ timeout: 10000 });
    await referralSource.setValue('Test');
    await attachScreenshot('Enter referral source');

    // Step 6: Hide keyboard before scrolling down
    await dismissKeyboard();
    await browser.pause(400);

    // Step 7: Age (avoid clearValue() since tapping clears placeholder "0" and invalidates the old element ID)
    const age = await $('-ios predicate string:type == "XCUIElementTypeTextField" AND value == "0"');
    await age.waitForExist({ timeout: 10000 });
    await scrollToElement(age);
    await safeTap(age, true);
    await browser.pause(400);
    await browser.keys('35'.split(''));
    await attachScreenshot('Enter age');

    // Dismiss numeric keypad so Male and Save Patient are unobstructed
    await dismissKeyboard();
    await browser.pause(400);

    // Step 8: Gender
    const gender = await $('-ios predicate string:type == "XCUIElementTypeStaticText" AND name == "Male"');
    await gender.waitForExist({ timeout: 10000 });
    await scrollToElement(gender);
    await safeTap(gender, true);
    await attachScreenshot('Select gender');

    // Step 9: Save patient
    const saveButton = await $(
      '-ios predicate string:(type == "XCUIElementTypeButton" OR type == "XCUIElementTypeStaticText") AND name == "Save Patient"'
    );
    await saveButton.waitForExist({ timeout: 10000 });
    await scrollToElement(saveButton);
    await safeTap(saveButton, true);
    await attachScreenshot('Click Save Patient');

    // ---------- VERIFY SUCCESS ----------
    const successMessage = '-ios predicate string:name CONTAINS[c] "Patient registered successfully"';
    await browser.waitUntil(
      async () => (await $$(successMessage)).length > 0,
      {
        timeout: 15000,
        interval: 300,
        timeoutMsg: 'Success message "Patient registered successfully" was not seen'
      }
    );
    console.log('Patient registered successfully');
    await attachScreenshot('Patient registered successfully');
  });
  
});