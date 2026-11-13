import { ChargezonePage } from '../../pages/ChargezonePage.js';
import testData from '../../datasheet/chargezone.js';


describe('ChargeZone Plan Trip Flow', () => {

    const chargezonePage = new ChargezonePage();

    it('ChargeZone Plan Trip Flow', async () => {

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


        // Plan Trip
        await chargezonePage.clickPlanTrip();
        // From Location
        await chargezonePage.clickCurrentLocation();
        await browser.pause(2000);

        await chargezonePage.enterFromLocation(
            testData.tripData.fromLocation
        );

        await browser.pause(3000);

        // To Location
        await chargezonePage.clickWhereTo();
        await browser.pause(2000);

        await chargezonePage.enterDestinationLocation(
            testData.tripData.toLocation
        );

        await browser.pause(10000);


        await chargezonePage.clickEVStationByCoordinates(testData.tripData.evStation);


        await chargezonePage.verifyStationCardOpened(testData.tripData.evStation.name);

        await chargezonePage.verifyZonePageVisible();

        await chargezonePage.verifyAvailabilityAndClickConnector(
            testData.stationConnectorData
        );

        // Click Charge Now
        await chargezonePage.clickChargeNow();

        // Verify Station Name
        await chargezonePage.verifyStationName();

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