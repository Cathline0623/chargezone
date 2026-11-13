import { ChargezonePage } from '../../pages/ChargezonePage.js';
import testData from '../../datasheet/chargezone.js';

describe('Chargezone Mobile Application', () => {

    const chargezonePage = new ChargezonePage();

    it('My EV - Add, Update, Set Primary and Delete', async () => {

        const vehicleData = testData.addVehicleData;
        const evData = testData.evManagementData;

        await chargezonePage.allowPermissionIfDisplayed();

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


        await chargezonePage.openMyEVs();

        await chargezonePage.clickAddVehiclePlusButton();

        await chargezonePage.verifyAddVehiclePrompt(
            vehicleData.vehicleSearchName
        );

        await chargezonePage.searchAndSelectVehicle(
            vehicleData.vehicleName
        );

        await chargezonePage.clickVehicleContinue();

        await chargezonePage.verifyRegistrationScreen();

        await chargezonePage.enterVehicleRegistrationNumber(
            vehicleData.registrationNumber
        );

        await chargezonePage.clickRegistrationContinue();

        await chargezonePage.verifyEVAddedSuccessfully();

        await chargezonePage.clickSetAsPrimary();

        await chargezonePage.verifyPrimaryCar();

        await chargezonePage.navigateBackToMyEVs();

        await chargezonePage.verifyAddedVehicleName(
            vehicleData.vehicleName
        );

        await chargezonePage.clickEditEVDetails();

        await chargezonePage.clickCarNameEditIcon();

        await chargezonePage.updateEVName(
            evData.updatedVehicleName
        );

        await chargezonePage.clickSaveEVDetails();

        await chargezonePage.verifyEVUpdatedSuccessfully();

        await chargezonePage.clickVehicleName(
            evData.updatedVehicleName
        );

        await chargezonePage.clickUpdateEVDetailsOption();

        await chargezonePage.verifyRemoveThisCarPopup();

        await chargezonePage.clickDeleteEVIcon();

        await chargezonePage.confirmDeleteEV();

        await chargezonePage.verifyEVDeletedSuccessfully();

        await driver.back();

        await chargezonePage.scrollToLogoutAndClick();

    });

});