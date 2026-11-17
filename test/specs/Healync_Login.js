
import { keywords } from '../../keyword.js';

describe("Healync Login", () => {

    it("Should login successfully ", async () => {

          const keyword = new keywords();


        // Hardcoded test credentials
        const phoneNumber = "test_test";
        const password = "Heal@sync1";

        // Phone number field
        const phoneField = await $(
            '//android.widget.EditText[@hint="Phone number"]'
        );

        await phoneField.waitForDisplayed({ timeout: 15000 });
        await phoneField.click();
        await phoneField.setValue(phoneNumber);

        // Password field
        const passwordField = await $(
            '//android.widget.EditText[@hint="Password"]'
        );

        await passwordField.waitForDisplayed({ timeout: 10000 });
        await passwordField.click();
        await passwordField.setValue(password);

        // Hide keyboard
        await driver.hideKeyboard().catch(() => { });

        // Sign In button
        const signInButton = await $("~Sign In");

        await signInButton.waitForEnabled({ timeout: 10000 });
        await signInButton.click();

        // Wait after login
        await driver.pause(5000);

        console.log("Login button clicked successfully");
        await keyword.AllureScreenshot('Login Successful');

        const addButton = await $(
            '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[5]/android.widget.Button'
        );

        await addButton.waitForDisplayed({ timeout: 10000 });
        await addButton.click();

        await driver.pause(2000);

        // Click Add Patient
        const addPatient = await $(
            '//android.view.View[@content-desc="Add Patient"]'
        );

        await addPatient.waitForDisplayed({ timeout: 10000 });
        await addPatient.click();
        await keyword.AllureScreenshot('Add Patient Screen Opened');

        // Click Select
        const selectButton = await $(
            '//android.widget.Button[@content-desc="Select"]'
        );

        await selectButton.waitForDisplayed({ timeout: 10000 });
        await selectButton.click();

        // Select Mr
        const mrButton = await $(
            '//android.widget.Button[@content-desc="Mr"]'
        );
        await keyword.AllureScreenshot('Patient Title Selected');

        await mrButton.waitForDisplayed({ timeout: 10000 });
        await mrButton.click();

        // Enter Patient Name
        const patientName = await $(
            '//android.widget.ScrollView/android.widget.EditText[1]'
        );

        await patientName.waitForDisplayed({ timeout: 10000 });
        await patientName.click();
        await patientName.setValue("Test Demotest");
        await keyword.AllureScreenshot('Patient Name Entered');
        
        // Enter Phone Number
        const phoneNumber1 = await $(
            '//android.widget.ScrollView/android.widget.EditText[2]'
        );

        await phoneNumber1.click();
        await phoneNumber1.setValue("9876321456");
        await keyword.AllureScreenshot('Patient Phone Number Entered');

        // Enter Referral
        const referral = await $(
            '//android.widget.ScrollView/android.widget.EditText[3]'
        );

        await referral.click();
        await referral.setValue("test");
        await keyword.AllureScreenshot('Referral Entered');
// Hide keyboard before scrolling
await driver.hideKeyboard().catch(() => {});

// Scroll until the Age label is visibl

// const scrollDown = async () => {
//   const { width, height } = await driver.getWindowSize();
//   const x = Math.round(width / 2);
//   await driver
//     .action('pointer', { parameters: { pointerType: 'touch' } })
//     .move({ x, y: Math.round(height * 0.75) })
//     .down()
//     .pause(100)
//     .move({ duration: 600, x, y: Math.round(height * 0.35) })
//     .up()
//     .perform();
// };




// // Enter Age
// const ageField = await $(
//     '//android.view.View[@content-desc="Age"]/following-sibling::android.widget.EditText[1]'
// );

// await ageField.waitForDisplayed({ timeout: 10000 });
// await ageField.setValue('25');



// await driver.pause(1000);




// // // Select Male
// const maleOption = await $('~Male');

// await maleOption.waitForDisplayed({ timeout: 10000 });
// await maleOption.click();



// Hide keyboard before scrolling
await driver.hideKeyboard().catch(() => {});
await driver.pause(500);

// Scroll helper
const scrollDown = async () => {
  const { width, height } = await driver.getWindowSize();
  const x = Math.round(width / 2);
  await driver
    .action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ x, y: Math.round(height * 0.75) })
    .down()
    .pause(100)
    .move({ duration: 600, x, y: Math.round(height * 0.35) })
    .up()
    .perform();
};

// Scroll until the Age field exists
const ageXpath =
  '//android.view.View[@content-desc="Age"]/following-sibling::android.widget.EditText[1]';
let ageField = await $(ageXpath);
for (let i = 0; i < 5 && !(await ageField.isExisting()); i++) {
  await scrollDown();
  await driver.pause(800);
  ageField = await $(ageXpath);
}
await ageField.waitForDisplayed({ timeout: 10000 });
await ageField.click();
await ageField.setValue('25');
await driver.hideKeyboard().catch(() => {});
await driver.pause(500);
await keyword.AllureScreenshot('Age Entered');

// Scroll until Male exists
let maleOption = await $('~Male');
for (let i = 0; i < 5 && !(await maleOption.isExisting()); i++) {
  await scrollDown();
  await driver.pause(800);
  maleOption = await $('~Male');
}
await maleOption.waitForDisplayed({ timeout: 10000 });
await maleOption.click();
await keyword.AllureScreenshot('Gender Selected');


        // Hide Keyboard
        await driver.hideKeyboard().catch(() => { });

        // Click Save Patient
        const savePatientButton = await $(
            '//android.widget.Button[@content-desc="Save Patient"]'
        );

        await savePatientButton.waitForDisplayed({ timeout: 10000 });
        await savePatientButton.click();

        // Verify Patient Registered Successfully
        const successMessage = await $(
            '//android.view.View[@content-desc="Patient registered successfully"]'
        );

        await successMessage.waitForDisplayed({ timeout: 10000 });

        // Get actual popup text
        const actualMessage = await successMessage.getAttribute("content-desc");

        console.log("Success Message:", actualMessage);

        // Verify message
        expect(actualMessage).toBe("Patient registered successfully");

        console.log("Patient details entered successfully");
        await keyword.AllureScreenshot('Patient Registered Successfully');





    });

});


