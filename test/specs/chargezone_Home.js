import { ChargezonePage } from '../../pages/ChargezonePage.js';
import testData from '../datasheet/chargezone.js';


describe('Chargezone Select Location Flow', () => {

    const chargezonePage = new ChargezonePage();

    it('Chargezone Select Location Flow', async () => {

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

        await chargezonePage.enterOTP('1111');


        await chargezonePage.allowLocationPermissionIfDisplayed();


        await chargezonePage.allowPermissionIfDisplayed();

        await chargezonePage.clickHome();
        await chargezonePage.clickSearchByLocation();
        await chargezonePage.enterStationSearchName();




        await chargezonePage.keywords.AllureScreenshot('Station Search Results');

        await chargezonePage.clickStationSearchResult();
        await chargezonePage.clickChargeNow();
        await browser.pause(3000);




        await chargezonePage.clickSkip();

        // Enter Amount
        await chargezonePage.enterChargingAmount(
            testData.chargingData.amount
        );

        // Click Units Tab
        await chargezonePage.clickUnitsTab();

        // Enter Units
        await chargezonePage.enterChargingUnits(
            testData.chargingData.units
        );

        // Click Continue
        await chargezonePage.clickContinue();


        // Click Start Charging
        await chargezonePage.clickStartCharging();

        // Final Verification
        await chargezonePage.verifyPlugGunErrorMessage();




    });
});