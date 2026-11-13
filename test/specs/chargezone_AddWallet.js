import { ChargezonePage } from '../../pages/ChargezonePage.js';
import testData from '../../datasheet/chargezone.js';


describe('Add Wallet', () => {

    const chargezonePage = new ChargezonePage();

    it('Add Wallet', async () => {

        // Step 1: Allow Android permission
        await chargezonePage.allowPermissionIfDisplayed();

  

        // Step 2: Click Get Started
        await chargezonePage.clickGetStarted();

        // Step 3: Enter phone number
        await chargezonePage.enterPhoneNumber(
            testData.loginData.phoneNumber
        );

        // Step 4: Click Send OTP
        await chargezonePage.clickSendOTP();

        // Step 5: Wait for 15 seconds
        // await chargezonePage.waitForOTP();

        // Step 6: Click Verify OTP
        // await chargezonePage.clickVerifyOTP();

        await chargezonePage.enterOTP('1111');

        await chargezonePage.allowLocationPermissionIfDisplayed();


        await chargezonePage.allowPermissionIfDisplayed();

        

// Step 1: Click Wallet
await chargezonePage.clickWallet();

// Step 2: Click Add Money
await chargezonePage.clickAddMoney();

// Step 3: Enter amount from test data
await chargezonePage.enterAmount(
    testData.paymentData.amount
);

// Step 4: Click Proceed to Pay
await chargezonePage.clickProceedToPay();

// Step 5: Wait 6 seconds
await chargezonePage.waitForPaymentPage();

    await browser.pause(5000);

// Step 6: Click Other Banks
await chargezonePage.clickOtherBanks();
    await browser.pause(5000);


// Step 7: Select bank from test data
await chargezonePage.selectBank(
    testData.paymentData.bankName
);

// Step 8: Select bank and proceed to pay
await chargezonePage.clickSelectBankProceed();

// Step 9: Wait for the simulator form (WebView or native, whichever is exposed)
await chargezonePage.waitForSimulator();

// Step 10: Read payment details
const paymentDetails = await chargezonePage.getPaymentDetails();
console.log(paymentDetails);

// Step 11: Select CHARGED
// await chargezonePage.selectTransactionState();
//     await browser.pause(5000);


// // Step 13: Back to native
// // await chargezonePage.switchToNative();

// await chargezonePage.clickTransactionStateDropdown();

// await chargezonePage.keywords.AllureScreenshot('Station Search Results');


// // Step 12: Click Submit
// await chargezonePage.clickSubmit();
//     await browser.pause(5000);


// await chargezonePage.verifyTransactionState();






await chargezonePage.selectTransactionState();

// await chargezonePage.verifyTransactionState();

// await chargezonePage.clickSubmit();

await chargezonePage.verifyTransactionStatusCaptured();

    

  });
});