import { ChargezoneLocators } from '../locator/ChargezoneLocators.js';
import { tapByLatLng } from '../utils/mapTap.js';
import { expect } from '@wdio/globals';
import testData from '../datasheet/chargezone.js';
import { keywords } from '../keyword.js';
import fs from 'fs';
import { getStationCoordinates } from '../utils/stationApi.js';


export class ChargezonePage {

    constructor() {
        this.locators = new ChargezoneLocators();
        this.keywords = new keywords();

    }


    async allowPermissionIfDisplayed() {
        const allowButton = await $(this.locators.allowPermissionButton);

        try {
            await allowButton.waitForDisplayed({ timeout: 5000 });
            await allowButton.click();
            await this.keywords.AllureScreenshot('Android Permission Allowed');

            console.log('Android permission allowed');
        } catch (error) {
            console.log('Permission popup not displayed');
            await this.keywords.AllureScreenshot('Permission Popup Not Displayed');
        }
    }

    async clickGetStarted() {
        const getStarted = await $(this.locators.getStartedButton);

        await getStarted.waitForDisplayed({ timeout: 10000 });
        await getStarted.click();
        await this.keywords.AllureScreenshot('Get Started Clicked');
    }

    async enterPhoneNumber(phoneNumber) {
        const phoneField = await $(this.locators.phoneNumberField);

        await phoneField.waitForDisplayed({ timeout: 10000 });
        await phoneField.setValue(phoneNumber);
        await this.keywords.AllureScreenshot('Phone Number Entered');
    }

    async clickSendOTP() {
        const sendOTP = await $(this.locators.sendOTPButton);

        await sendOTP.waitForDisplayed({ timeout: 10000 });
        await sendOTP.click();
        await this.keywords.AllureScreenshot('Send OTP Clicked');
    }

    async waitForOTP() {
        console.log('Waiting 15 seconds for OTP...');

        await browser.pause(15000);
        await this.keywords.AllureScreenshot('OTP Wait Completed');
    }

    async clickVerifyOTP() {
        const verifyOTP = await $(this.locators.verifyOTPButton);

        await verifyOTP.waitForDisplayed({ timeout: 10000 });
        await verifyOTP.click();
        await this.keywords.AllureScreenshot('Verify OTP Clicked');
    }

    async allowLocationPermissionIfDisplayed() {
        const locationAllowButton = await $(this.locators.locationPermissionButton);

        try {
            await locationAllowButton.waitForDisplayed({ timeout: 5000 });
            await locationAllowButton.click();
            await this.keywords.AllureScreenshot('Location Permission Allowed');

            console.log('Location permission allowed');
        } catch (error) {
            console.log('Location permission popup not displayed');
            await this.keywords.AllureScreenshot('Location Permission Popup Not Displayed');
        }
    }

    async clickWallet() {
        const wallet = await $(this.locators.walletOption);

        await wallet.waitForDisplayed({ timeout: 10000 });
        await wallet.click();
        await this.keywords.AllureScreenshot('Wallet Clicked');
    }

    async clickAddMoney() {
        const addMoney = await $(this.locators.addMoneyButton);

        await addMoney.waitForDisplayed({ timeout: 10000 });
        await addMoney.click();
        await this.keywords.AllureScreenshot('Add Money Clicked');
    }

    async enterAmount(amount) {
        const amountField = await $(this.locators.amountField);

        await amountField.waitForDisplayed({ timeout: 10000 });
        await amountField.clearValue();
        await this.keywords.AllureScreenshot('Wallet Amount Cleared');

        await amountField.setValue(String(amount));
        await this.keywords.AllureScreenshot('Wallet Amount Entered');
    }

    async clickProceedToPay() {
        const proceedButton = await $(this.locators.proceedToPayButton);

        await proceedButton.waitForDisplayed({ timeout: 10000 });
        await proceedButton.click();
        await this.keywords.AllureScreenshot('Proceed To Pay Clicked');
    }

    async waitForPaymentPage() {
        await browser.pause(6000);
        await this.keywords.AllureScreenshot('Payment Page Wait Completed');
    }

    async clickOtherBanks() {
        const otherBanks = await $(this.locators.otherBanksOption);

        await otherBanks.waitForDisplayed({ timeout: 10000 });
        await otherBanks.click();
        await this.keywords.AllureScreenshot('Other Banks Clicked');
    }

    async selectBank(bankName) {
        const bankLocator = this.locators.bankOption.replace('%s', bankName);
        const bank = await $(bankLocator);

        await bank.waitForDisplayed({ timeout: 10000 });
        await bank.click();
        await this.keywords.AllureScreenshot(`Bank Selected: ${bankName}`);
    }

    async clickSelectBankProceed() {
        const proceedButton = await $(this.locators.selectBankProceedButton);

        await proceedButton.waitForDisplayed({ timeout: 10000 });
        await proceedButton.click();
        await this.keywords.AllureScreenshot('Select Bank Proceed Clicked');
    }

    // Switch to Payment WebView
    async switchToPaymentWebView() {
        const contexts = await driver.getContexts();

        console.log('Available contexts:', contexts);

        const webViewContext = contexts.find(context =>
            context.toString().includes('WEBVIEW')
        );

        if (!webViewContext) {
            throw new Error('Payment WebView context not found');
        }

        await driver.switchContext(webViewContext);
        await this.keywords.AllureScreenshot('Switched To Payment WebView');

        console.log('Switched to Payment WebView');
    }

    // Get Transaction ID
    async getTransactionId() {
        const element = await $(this.locators.transactionId);

        await element.waitForDisplayed({ timeout: 10000 });

        const value = await element.getText();
        await this.keywords.AllureScreenshot('Transaction ID Retrieved');

        return value;
    }

    // Get Order ID
    async getOrderId() {
        const element = await $(this.locators.orderId);
        await element.waitForDisplayed({ timeout: 10000 });

        const text = await element.getText();
        await this.keywords.AllureScreenshot('Order ID Retrieved');

        return text.includes(':') ? text.split(':')[1].trim() : text;
    }

    // Get Currency
    async getCurrency() {
        const element = await $(this.locators.currency);

        await element.waitForDisplayed({ timeout: 10000 });

        const value = await element.getText();
        await this.keywords.AllureScreenshot('Currency Retrieved');

        return value;
    }

    // Get Amount
    async getAmount() {
        const element = await $(this.locators.amount);

        await element.waitForDisplayed({ timeout: 10000 });

        const value = await element.getText();
        await this.keywords.AllureScreenshot('Payment Amount Retrieved');

        return value;
    }

    // Get all Payment Details
    async getPaymentDetails() {
        const transactionId = await this.getTransactionId();
        const orderId = await this.getOrderId();
        const currency = await this.getCurrency();
        const amount = await this.getAmount();

        console.log('Transaction ID:', transactionId);
        console.log('Order ID:', orderId);
        console.log('Currency:', currency);
        console.log('Amount:', amount);

        await this.keywords.AllureScreenshot('All Payment Details Retrieved');

        return {
            transactionId,
            orderId,
            currency,
            amount
        };
    }

    // Click Submit
    async clickSubmit() {
        const submit = await $(this.locators.submitButton);

        await submit.waitForDisplayed({ timeout: 10000 });
        await submit.click();
        await this.keywords.AllureScreenshot('Submit Clicked');

        console.log('Submit button clicked');
    }

    async enterOTP(otp) {
        console.log('OTP Locator:', this.locators.otpField);
        console.log('Current Context:', await driver.getContext());

        await driver.switchContext('NATIVE_APP');

        const otpField = await $(this.locators.otpField);

        await otpField.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: 'OTP input field is not displayed'
        });

        await otpField.click();
        await otpField.setValue(String(otp));

        await this.keywords.AllureScreenshot('OTP Entered');
    }

    async waitForSimulatorNative() {
        await driver.switchContext('NATIVE_APP');
        await this.keywords.AllureScreenshot('Switched To Native App');

        const heading = await $('android=new UiSelector().textContains("Choose the statuses")');
        await heading.waitForExist({ timeout: 40000, timeoutMsg: 'Simulator form not in native tree' });

        await this.keywords.AllureScreenshot('Simulator Form Displayed');

        console.log(await driver.getPageSource());
    }

    async switchToNative() {
        await driver.switchContext('NATIVE_APP');
        await this.keywords.AllureScreenshot('Switched To Native Context');
    }

    // New
    async waitForSimulator() {
        await driver.updateSettings({ waitForIdleTimeout: 0, waitForSelectorTimeout: 0 });
        await driver.switchContext('NATIVE_APP');
        await this.keywords.AllureScreenshot('Simulator Native Context');

        await browser.waitUntil(async () => {
            const els = await $$(this.locators.simulatorHeading);
            return els.length > 0;
        }, {
            timeout: 60000,
            interval: 1000,
            timeoutMsg: 'Simulator form not found'
        });

        await this.keywords.AllureScreenshot('Simulator Form Loaded');

        // TEMP: dump once so we can see how labels and values appear
        console.log(await driver.getPageSource());
    }

    // Reads the value next to a label. Falls back to splitting "Label: value".
    async getValueByLabel(labelLocator) {
        const label = await $(labelLocator);
        await label.waitForExist({ timeout: 15000 });

        const sibling = await label.$('./following-sibling::*[1]');

        if (await sibling.isExisting()) {
            const t = ((await sibling.getText()) || (await sibling.getAttribute('content-desc')) || '').trim();
            if (t) {
                await this.keywords.AllureScreenshot('Sibling Label Value Retrieved');
                return t;
            }
        }

        const own = ((await label.getText()) || (await label.getAttribute('content-desc')) || '').trim();
        const value = own.includes(':') ? own.split(':').slice(1).join(':').trim() : own;

        await this.keywords.AllureScreenshot('Label Value Retrieved');

        return value;
    }

    async getTransactionId() {
        const el = await $(this.locators.transactionIdValue);
        await el.waitForExist({ timeout: 15000 });

        const value = ((await el.getText()) || (await el.getAttribute('content-desc'))).trim();

        await this.keywords.AllureScreenshot('Transaction ID Retrieved');

        return value;
    }

    async getOrderId() {
        return this.getValueByLabel(this.locators.orderIdLabel);
    }

    async getCurrency() {
        return this.getValueByLabel(this.locators.currencyLabel);
    }

    async getAmount() {
        return this.getValueByLabel(this.locators.amountLabel);
    }





    // async selectTransactionState() {
    //     const status = testData.paymentData.transactionState;

    //     await this.keywords.click(this.locators.transactionStateDropdown);

    //     await this.keywords.click(
    //         this.locators.transactionStateOption(status)
    //     );

    //     console.log(`Transaction State Selected: ${status}`);
    //     await this.keywords.AllureScreenshot('Transaction State Selected');

    //     // await this.keywords.click(this.locators.submitButton);
    // }

    async selectTransactionState() {
        const status = testData.paymentData.transactionState;

        await this.keywords.click(this.locators.transactionStateDropdown);

        await this.keywords.click(
            this.locators.transactionStateOption(status)
        );

        console.log(`Transaction State Selected: ${status}`);
        await this.keywords.AllureScreenshot('Transaction State Selected');

        await this.clickSubmit();
    }

    async verifyTransactionStatusCaptured() {
        const successMessage = await $(this.locators.statusCapturedSuccessfully);

        await successMessage.waitForDisplayed({
            timeout: 30000,
            timeoutMsg: 'Status captured successfully message not displayed'
        });

        const actualMessage = await successMessage.getText();

        expect(actualMessage).toContain('Status captured successfully');

        console.log(`Status Message Verified: ${actualMessage}`);

        await this.keywords.AllureScreenshot(`Status Message Verified: ${actualMessage}`);
    }

    async verifyTransactionState() {
        const expectedStatus = testData.paymentData.transactionState;

        const statusElement = await $(this.locators.transactionStateValue());

        await statusElement.waitForDisplayed({ timeout: 15000 });

        const actualStatus = await statusElement.getText();

        expect(actualStatus).toBe(expectedStatus);

        console.log(
            `Transaction State | Expected: ${expectedStatus} | Actual: ${actualStatus}`
        );

        await this.keywords.AllureScreenshot(
            `Transaction State | Expected: ${expectedStatus} | Actual: ${actualStatus}`
        );
    }


    async clickSubmit() {
        const submit = await $(this.locators.submitButton);
        await submit.waitForExist({ timeout: 15000 });
        await browser.pause(500);
        await submit.click();
        await this.keywords.AllureScreenshot('Submit Clicked');
    }

    async clickPlanTrip() {
        const planTrip = await $(this.locators.planTripButton);

        const exists = await planTrip.isExisting();

        console.log('Plan Trip Exists:', exists);

        if (!exists) {
            throw new Error(
                'Plan Trip button not found. Check the current screen and locator.'
            );
        }

        await planTrip.waitForDisplayed({ timeout: 10000 });
        await planTrip.click();
        await this.keywords.AllureScreenshot('Plan Trip Clicked');
    }

    // Click Current Location and Close Button 1
    async clickCurrentLocation() {
        const currentLocation = await $(this.locators.currentLocationField);

        await currentLocation.waitForDisplayed({ timeout: 10000 });
        await currentLocation.click();
        await this.keywords.AllureScreenshot('Current Location Clicked');

        const closeButton = await $(this.locators.closeButton1);

        await closeButton.waitForDisplayed({ timeout: 10000 });
        await closeButton.click();
        await this.keywords.AllureScreenshot('Current Location Popup Closed');

        console.log('Current Location and Close Button 1 clicked');
    }

    // Click Where To and Close Button 2
    async clickWhereTo() {
        const toLocation = await $(this.locators.toLocationField);

        await toLocation.waitForDisplayed({ timeout: 10000 });
        await toLocation.click();
        await this.keywords.AllureScreenshot('Where To Clicked');

        const closeButton = await $(this.locators.closeButton2);

        await closeButton.waitForDisplayed({ timeout: 10000 });
        await closeButton.click();
        await this.keywords.AllureScreenshot('Where To Popup Closed');

        console.log('Where To and Close Button 2 clicked');
    }

    // Enter From Location
    async enterFromLocation(location) {
        const fromField = await $(this.locators.fromLocationInput);

        await fromField.waitForDisplayed({ timeout: 10000 });
        await fromField.click();
        await this.keywords.AllureScreenshot('From Location Field Clicked');

        await fromField.setValue(location);
        await this.keywords.AllureScreenshot('From Location Entered');

        await this.selectFirstLocationSuggestion();

        console.log(`From Location: ${location}`);
    }

    // Enter Destination
    async enterDestinationLocation(location) {
        const toField = await $(this.locators.destinationLocationInput);

        await toField.waitForDisplayed({ timeout: 10000 });
        await toField.click();
        await this.keywords.AllureScreenshot('Destination Field Clicked');

        await toField.setValue(location);
        await this.keywords.AllureScreenshot('Destination Location Entered');

        await this.selectFirstLocationSuggestion();

        console.log(`To Location: ${location}`);
    }

    async debugCurrentScreen() {
        console.log('CURRENT CONTEXT:', await browser.getContext());

        const pageSource = await browser.getPageSource();
        console.log('CURRENT PAGE SOURCE:', pageSource);

        await this.keywords.AllureScreenshot('Current Screen Debug');
    }

    async clickEVStationByCoordinates(evStationData) {
        await this.keywords.AllureScreenshot('Before EV Station Coordinate Tap');

        const coordinates = await tapByLatLng(evStationData);

        await this.keywords.AllureScreenshot('After EV Station Coordinate Tap');

        return coordinates;
    }

    async selectFirstLocationSuggestion() {
        await browser.waitUntil(
            async () => {
                const suggestions = await $$(
                    this.locators.firstLocationSuggestion
                );

                return suggestions.length > 0;
            },
            {
                timeout: 15000,
                interval: 500,
                timeoutMsg: 'Location suggestions not displayed'
            }
        );

        await this.keywords.AllureScreenshot('Location Suggestions Displayed');

        const suggestions = await $$(
            this.locators.firstLocationSuggestion
        );

        for (const suggestion of suggestions) {
            if (
                await suggestion.isDisplayed() &&
                await suggestion.isEnabled()
            ) {
                await suggestion.click();
                await this.keywords.AllureScreenshot('First Location Suggestion Selected');

                console.log('First location suggestion clicked');
                return;
            }
        }

        throw new Error('No clickable location suggestion found');
    }

    async debugClickableElements() {
        const pageSource = await driver.getPageSource();

        const matches = pageSource.match(/<[^>]+clickable="true"[^>]*>/g) || [];

        console.log('CLICKABLE ELEMENTS:');

        matches.forEach((element, index) => {
            console.log(`${index + 1}: ${element}`);
        });

        await this.keywords.AllureScreenshot('Clickable Elements Debug');
    }

    async verifyStationCardOpened(stationName) {
        const title = await $(`~${stationName}`);

        await title.waitForExist({
            timeout: 10000,
            timeoutMsg: `Station card not opened for: ${stationName}`
        });

        await this.keywords.AllureScreenshot('Station Card Opened');
        await this.keywords.AllureScreenshot(`Station card opened: ${stationName}`);

        console.log(`Station card opened: ${stationName}`);
    }

    async clickChargeNow() {
        const btn = await $('~Charge Now');

        await btn.waitForExist({ timeout: 10000 });
        await btn.click();
        await this.keywords.AllureScreenshot('Charge Now Clicked');

        console.log('Charge Now clicked');
    }

    async verifyZonePageVisible() {
        const zonePage = await $(this.locators.ZonePageScrollView);

        await zonePage.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Zone page is not displayed'
        });

        const isVisible = await zonePage.isDisplayed();

        console.log(
            `Verify Zone Page Visibility | Expected: true | Actual: ${isVisible}`
        );

        expect(isVisible).toBe(true);
        await this.keywords.AllureScreenshot(
            `Verify Zone Page Visibility | Expected: true | Actual: ${isVisible}`
        );


        await this.keywords.AllureScreenshot('Zone Page Verified');
    }

    // async verifyAvailabilityAndClickConnector(stationConnectorData) {
    //     const {
    //         connector,
    //         status,
    //         connectionType,
    //         power,
    //         price
    //     } = stationConnectorData;

    //     const expectedDescription = [
    //         connector,
    //         status,
    //         connectionType,
    //         power,
    //         price
    //     ].join('\n');

    //     const parentLocator = this.locators.stationConnectorDetails
    //         .replace('%s', expectedDescription);

    //     const connectorDetails = await $(parentLocator);

    //     await connectorDetails.waitForDisplayed({ timeout: 10000 });

    //     const actualDescription = await connectorDetails.getAttribute('content-desc');

    //     const actualStatus = actualDescription.split('\n')[1]?.trim();

    //     console.log(
    //         `Verify EV Zone Availability | Expected: ${status} | Actual: ${actualStatus}`
    //     );

    //     expect(actualStatus).toBe(status);
    //         await this.keywords.AllureScreenshot(
    //         `Verify Zone Page Visibility | Expected: true | Actual: ${isVisible}`
    //     );


    //     await this.keywords.AllureScreenshot('EV Zone Availability Verified');

    //     const imageLocator = await $(
    //         `${parentLocator}${this.locators.stationConnectorImage}`
    //     );

    //     await imageLocator.waitForDisplayed({ timeout: 10000 });
    //     await imageLocator.click();
    //     await this.keywords.AllureScreenshot('Available EV Zone Selected');

    //     console.log('Available EV Zone selected');
    // }


    async verifyAvailabilityAndClickConnector(stationConnectorData) {
        const {
            connector,
            status,
            connectionType,
            power,
            price
        } = stationConnectorData;

        const expectedDescription = [
            connector,
            status,
            connectionType,
            power,
            price
        ].join('\n');

        const parentLocator = this.locators.stationConnectorDetails
            .replace('%s', expectedDescription);

        const connectorDetails = await $(parentLocator);

        await connectorDetails.waitForDisplayed({ timeout: 10000 });

        const actualDescription = await connectorDetails.getAttribute('content-desc');

        const actualStatus = actualDescription.split('\n')[1]?.trim();

        console.log(
            `Verify EV Zone Availability | Expected: ${status} | Actual: ${actualStatus}`
        );

        expect(actualStatus).toBe(status);

        const isVisible = await connectorDetails.isDisplayed();

        console.log(
            `Verify Zone Page Visibility | Expected: true | Actual: ${isVisible}`
        );

        await this.keywords.AllureScreenshot(
            `Verify Zone Page Visibility | Expected: true | Actual: ${isVisible}`
        );


        await this.keywords.AllureScreenshot(
            `Verify EV Zone Availability | Expected: ${status} | Actual: ${actualStatus}`
        );

        const imageLocator = await $(
            `${parentLocator}${this.locators.stationConnectorImage}`
        );

        await imageLocator.waitForDisplayed({ timeout: 10000 });
        await imageLocator.click();

        await this.keywords.AllureScreenshot('Available EV Zone Selected');

        console.log('Available EV Zone selected');
    }


    async clickChargeNow() {
        const chargeNow = await $(this.locators.chargeNowButton);

        await chargeNow.waitForDisplayed({ timeout: 10000 });
        await chargeNow.click();
        await this.keywords.AllureScreenshot('Charge Now Clicked');

        console.log('Charge Now clicked');
    }

    async verifyStationName() {
        const expectedStationName = testData.tripData.evStation.name;

        const stationLocator = this.locators.stationName.replace(
            '%s',
            expectedStationName
        );

        const station = await $(stationLocator);

        await station.waitForDisplayed({ timeout: 10000 });

        const actualStationName = await station.getAttribute('content-desc');

        console.log(
            `Verify Station Name | Expected Station Name : ${expectedStationName} | Actual Station Name  : ${actualStationName}`
        );

        expect(actualStationName).toBe(expectedStationName);

        await this.keywords.AllureScreenshot(
            `Verify Station Name | Expected Station Name : ${expectedStationName} | Actual Station Name  : ${actualStationName}`
        );


        await this.keywords.AllureScreenshot('Station Name Verified');
    }

    async enterChargingAmount(amount) {
        const amountField = await $(this.locators.amountInput);

        await amountField.waitForDisplayed({ timeout: 10000 });
        await amountField.clearValue();
        await this.keywords.AllureScreenshot('Charging Amount Field Cleared');

        await amountField.setValue(String(amount));
        await this.keywords.AllureScreenshot('Charging Amount Entered');

        console.log(`Charging Amount Entered: ${amount}`);
    }

    async clickUnitsTab() {
        const unitsTab = await $(this.locators.unitsTab);

        await unitsTab.waitForDisplayed({ timeout: 10000 });
        await unitsTab.click();
        await this.keywords.AllureScreenshot('Units Tab Clicked');

        console.log('Units tab clicked');
    }

    async clickContinue() {
        const continueButton = await $(this.locators.continueButton);

        await continueButton.waitForDisplayed({ timeout: 10000 });
        await continueButton.click();
        await this.keywords.AllureScreenshot('Continue Clicked');

        console.log('Continue button clicked');
    }

    async clickStartCharging() {
        const startCharging = await $(this.locators.startChargingButton);

        await startCharging.waitForDisplayed({ timeout: 10000 });
        await startCharging.click();
        await this.keywords.AllureScreenshot('Start Charging Clicked');

        console.log('Start Charging clicked');
    }

    async verifyPlugGunErrorMessage() {
        const errorMessage = await $(this.locators.plugGunErrorMessage);

        await errorMessage.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: 'Plug the gun error message is not displayed'
        });

        const isVisible = await errorMessage.isDisplayed();

        console.log(
            `Verify Plug Gun Error Message | Expected: true | Actual: ${isVisible}`
        );

        expect(isVisible).toBe(true);
        await this.keywords.AllureScreenshot(
            `Verify Plug Gun Error Message | Expected: true | Actual: ${isVisible}`
        );


        await this.keywords.AllureScreenshot('Plug Gun Error Message Verified');
    }

    async clickSkip() {
        const skipButton = await $(this.locators.skipButton);

        await skipButton.waitForDisplayed({ timeout: 10000 });
        await skipButton.click();
        await this.keywords.AllureScreenshot('Skip Clicked');

        console.log('Skip button clicked');
    }

    async enterChargingUnits(units) {
        const unitsField = await $(this.locators.unitsInput);

        await unitsField.waitForDisplayed({ timeout: 10000 });
        await unitsField.clearValue();
        await this.keywords.AllureScreenshot('Charging Units Field Cleared');

        await unitsField.setValue(String(units));
        await this.keywords.AllureScreenshot('Charging Units Entered');

        console.log(`Charging Units Entered: ${units}`);
    }

    async clickHome() {
        const home = await $(this.locators.homeButton);

        await home.waitForDisplayed({ timeout: 10000 });
        await home.click();
        await this.keywords.AllureScreenshot('Home Button Clicked');

        console.log('Home button clicked');
        await this.keywords.AllureScreenshot('Home Navigation Verification');
    }

    async clickSearchByLocation() {
        const searchButton = await $(this.locators.searchByLocationButton);

        await searchButton.waitForDisplayed({ timeout: 10000 });
        await searchButton.click();
        await this.keywords.AllureScreenshot('Search By Location Clicked');

        console.log('Search by location clicked');
        await this.keywords.AllureScreenshot('Search Location Screen Verification');
    }

    async enterStationSearchName() {
        const searchText = testData.stationSearchData.searchText;

        const searchInput = await $(this.locators.searchLocationInput);

        await searchInput.waitForDisplayed({ timeout: 10000 });
        await searchInput.setValue(searchText);

        await this.keywords.AllureScreenshot('Station Name Entered');

        console.log(`Station Search Value Entered: ${searchText}`);
        await this.keywords.AllureScreenshot('Station Search Verification');
    }


    async clickStationSearchResult() {
        const searchText = testData.stationSearchData.searchText;

        const stationLocator = this.locators.stationSearchResult
            .replace('%s', searchText);

        const stationResult = await $(stationLocator);

        await stationResult.waitForDisplayed({
            timeout: 15000
        });

        await stationResult.click();

        await this.keywords.AllureScreenshot('Station Search Result Clicked');

        console.log(`Station Search Result Selected: ${searchText}`);
        await this.keywords.AllureScreenshot(`Station Search Result Selected: ${searchText}`);
    }


    async clickTransactionStateDropdown() {

        await driver.switchContext('NATIVE_APP');

        const pageSource = await driver.getPageSource();

        console.log('TRANSACTION STATE PAGE SOURCE:', pageSource);

        await this.keywords.AllureScreenshot('Transaction State Dropdown Screen');
    }


    async selectVehicle(vehicleName) {

        const vehicleLocator = this.locators.vehicleSearchResult
            .replaceAll('%s', vehicleName);

        const vehicle = await $(vehicleLocator);

        await vehicle.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: `Vehicle not displayed: ${vehicleName}`
        });

        await vehicle.click();

        await this.keywords.AllureScreenshot('Vehicle Selected');

        console.log(`Vehicle Selected: ${vehicleName}`);
    }

    async clickVehicleContinue() {

        // Select the vehicle
        const vehicle = await $(this.locators.vehicleSearchResult);

        await vehicle.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Audi MG Windsor EV Pro vehicle is not displayed'
        });

        await vehicle.click();

        await this.keywords.AllureScreenshot('Audi MG Windsor EV Pro Selected');

        console.log('Audi MG Windsor EV Pro selected');

        // Click Continue
        const continueButton = await $(this.locators.continueButton);

        await continueButton.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Vehicle Continue button is not displayed'
        });

        await continueButton.click();

        await this.keywords.AllureScreenshot('Vehicle Selection Continue Clicked');

        console.log('Vehicle selection Continue clicked');
    }

    async verifyRegistrationScreen() {

        const heading = await $(this.locators.registrationScreenHeading);

        await heading.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: 'Select battery capacity heading is not displayed'
        });

        const batteryCapacity = await $(this.locators.batteryCapacity);

        await batteryCapacity.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Battery capacity is not displayed'
        });

        const registrationLabel = await $(this.locators.registrationNumberLabel);

        await registrationLabel.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Registration number label is not displayed'
        });

        // Verify registration number popup
        const popup = await $(this.locators.registrationNumberPopup);

        await popup.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Registration number popup is not displayed'
        });

        expect(await popup.isDisplayed()).toBe(true);

        await this.keywords.AllureScreenshot(
            'Registration Number Popup Verified'
        );

        // Click registration number field twice
        const registrationInput = await $(this.locators.registrationNumberInput);

        await registrationInput.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Registration number input field is not displayed'
        });

        await registrationInput.click();

        await browser.pause(500);

        await registrationInput.click();

        await this.keywords.AllureScreenshot(
            'Registration Number Field Focused'
        );

        console.log('Registration screen and popup verified successfully');
    }

    async enterVehicleRegistrationNumber(registrationNumber) {

        const registrationField = await $(this.locators.registrationNumberInput);

        await registrationField.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Registration number input field is not displayed'
        });

        await registrationField.setValue(registrationNumber);

        await this.keywords.AllureScreenshot('Vehicle Registration Number Entered');

        console.log(`Registration Number Entered: ${registrationNumber}`);
    }

    async clickRegistrationContinue() {

        const continueButton = await $(this.locators.continueButton);

        await continueButton.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Registration Continue button is not displayed'
        });

        await continueButton.click();

        await this.keywords.AllureScreenshot('Registration Continue Clicked');

        console.log('Registration Continue clicked');
    }

    async verifyEVAddedSuccessfully() {

        const successMessage = await $(this.locators.evAddedSuccessfullyMessage);

        await successMessage.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: 'EV added successfully popup is not displayed'
        });

        const actualMessage =
            (await successMessage.getText()) ||
            (await successMessage.getAttribute('content-desc')) ||
            '';

        console.log(
            `Verify EV Added Successfully | Expected: EV added successfully | Actual: ${actualMessage}`
        );

        expect(actualMessage).toContain('EV added successfully');

        await this.keywords.AllureScreenshot('EV Added Successfully Verified');
    }

    async clickSetAsPrimary() {

        const setPrimary = await $(this.locators.setAsPrimary);

        await setPrimary.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Set as primary option is not displayed'
        });

        await setPrimary.click();

        await this.keywords.AllureScreenshot('Set As Primary Clicked');

        console.log('Set as Primary clicked');
    }

    async verifyPrimaryCar() {

        const primaryCar = await $(this.locators.primaryCar);

        await primaryCar.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Primary car indicator is not displayed'
        });

        expect(await primaryCar.isDisplayed()).toBe(true);

        await this.keywords.AllureScreenshot('Primary Car Verified');

        console.log('Primary car verification successful');
    }

    async navigateBackToMyEVs() {

        await driver.back();

        await this.keywords.AllureScreenshot('Navigated Back To Profile');

        await this.openMyEVs();

        console.log('My EVs page opened again');
    }

    async verifyAddedVehicleName(expectedVehicleName) {

        const vehicleLocator = this.locators.addedVehicleName.replace(
            'MG Windsor EV Pro',
            expectedVehicleName
        );

        const vehicle = await $(vehicleLocator);

        await vehicle.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: `Vehicle not displayed: ${expectedVehicleName}`
        });

        const actualVehicleName = await vehicle.getAttribute('content-desc');

        console.log(
            `Vehicle Name | Expected: ${expectedVehicleName} | Actual: ${actualVehicleName}`
        );

        expect(actualVehicleName).toBe(expectedVehicleName);

        await this.keywords.AllureScreenshot('Added Vehicle Name Verified');
    }

    async scrollToLogoutAndClick() {

        const scrollView = await $(this.locators.vehicleScrollView);

        await scrollView.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Profile ScrollView is not displayed'
        });

        const logout = await $(this.locators.logoutImage);

        let attempts = 0;

        while (
            !(await logout.isDisplayed().catch(() => false)) &&
            attempts < 5
        ) {
            const location = await scrollView.getLocation();
            const size = await scrollView.getSize();

            const startX = Math.round(location.x + size.width / 2);
            const startY = Math.round(location.y + size.height * 0.80);
            const endY = Math.round(location.y + size.height * 0.25);

            await browser.action('pointer', {
                parameters: { pointerType: 'touch' }
            })
                .move({ x: startX, y: startY })
                .down()
                .move({ x: startX, y: endY, duration: 500 })
                .up()
                .perform();

            attempts++;
        }

        await logout.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Logout option is not displayed after scrolling'
        });

        await logout.click();

        await this.keywords.AllureScreenshot('Logout Clicked');

        console.log('Logout clicked successfully');
    }

    async clickEditEVDetails() {

        const editButton = await $(this.locators.editEVDetailsButton);

        await editButton.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Edit EV details button is not displayed'
        });

        await editButton.click();

        await this.keywords.AllureScreenshot('Edit EV Details Opened');

        console.log('Edit EV Details clicked');
    }

    async clickCarNameEditIcon() {

        const editIcon = await $(this.locators.carNameEditIcon);

        await editIcon.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Car name edit icon is not displayed'
        });

        await editIcon.click();

        await this.keywords.AllureScreenshot('Car Name Edit Icon Clicked');

        console.log('Car name edit icon clicked');
    }

    async updateEVName(vehicleName) {

        const carNameInput = await $(this.locators.carNameInput);

        await carNameInput.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Car name input field is not displayed'
        });

        await carNameInput.click();

        await carNameInput.clearValue();

        await carNameInput.setValue(String(vehicleName));

        await this.keywords.AllureScreenshot('EV Name Updated');

        console.log(`EV Name Entered: ${vehicleName}`);
    }

    async clickSaveEVDetails() {

        const saveButton = await $(this.locators.saveEVDetailsButton);

        await saveButton.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Save Details button is not displayed'
        });

        await saveButton.click();

        await this.keywords.AllureScreenshot('EV Details Saved');

        console.log('Save Details clicked');
    }

    async verifyEVUpdatedSuccessfully() {

        const successPopup = await $(this.locators.evUpdatedSuccessfullyPopup);

        await successPopup.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: 'EV updated successfully popup is not displayed'
        });

        expect(await successPopup.isDisplayed()).toBe(true);

        await this.keywords.AllureScreenshot('EV Updated Successfully Verified');

        console.log('EV updated successfully popup verified');
    }

    async clickVehicleName(vehicleName) {

        const vehicleLocator = this.locators.vehicleName.replace(
            'My EV',
            vehicleName
        );

        const vehicle = await $(vehicleLocator);

        await vehicle.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: `Vehicle is not displayed: ${vehicleName}`
        });

        await vehicle.click();

        await this.keywords.AllureScreenshot('Vehicle Selected');

        console.log(`Vehicle Selected: ${vehicleName}`);
    }

    async clickUpdateEVDetailsOption() {

        const editButton = await $(this.locators.editEVDetailsButton);

        await editButton.waitForDisplayed({ timeout: 10000 });
        await editButton.click();

        await browser.pause(1500);

        await this.keywords.AllureScreenshot(
            'Update EV Details Before Scroll'
        );

        const { width, height } = await driver.getWindowSize();

        // Swipe upwards inside the bottom sheet content area
        for (let attempt = 1; attempt <= 4; attempt++) {

            console.log(`Bottom sheet swipe attempt: ${attempt}`);

            await driver.execute('mobile: swipeGesture', {
                left: Math.round(width * 0.05),
                top: Math.round(height * 0.40),
                width: Math.round(width * 0.90),
                height: Math.round(height * 0.42),
                direction: 'up',
                percent: 0.70
            });

            await browser.pause(1000);

            await this.keywords.AllureScreenshot(
                `Bottom Sheet Scroll ${attempt}`
            );
        }

        // Capture actual Android hierarchy
        const pageSource = await driver.getPageSource();

        console.log('========== PAGE SOURCE AFTER SCROLL ==========');
        console.log(pageSource);
        console.log('==============================================');

        const removeOption = await $(this.locators.removeThisCarOption);

        console.log(
            'Remove option exists:',
            await removeOption.isExisting()
        );

        console.log(
            'Remove option displayed:',
            await removeOption.isDisplayed().catch(() => false)
        );
    }

    async verifyRemoveThisCarPopup() {

        const removePopup = await $(this.locators.removeThisCarOption);

        await removePopup.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Remove this car option is not displayed'
        });

        expect(await removePopup.isDisplayed()).toBe(true);

        await this.keywords.AllureScreenshot(
            'Remove This Car Option Verified'
        );

        console.log('Remove this car option verified');
    }

    async clickDeleteEVIcon() {

        const deleteIcon = await $(this.locators.deleteEVIcon);

        await deleteIcon.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Delete EV icon is not displayed'
        });

        await deleteIcon.click();

        await this.keywords.AllureScreenshot('Delete EV Icon Clicked');

        console.log('Delete EV icon clicked');
    }

    async verifyEVDeletedSuccessfully() {

        const successPopup = await $(this.locators.evDeletedSuccessfullyPopup);

        await successPopup.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: 'EV deleted successfully popup is not displayed'
        });

        expect(await successPopup.isDisplayed()).toBe(true);

        await this.keywords.AllureScreenshot('EV Deleted Successfully Verified');

        console.log('EV deleted successfully popup verified');
    }

    async confirmDeleteEV() {

        const deleteButton = await $(this.locators.confirmDeleteButton);

        await deleteButton.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Delete confirmation button is not displayed'
        });

        await deleteButton.click();

        await this.keywords.AllureScreenshot('EV Delete Confirmed');

        console.log('EV deletion confirmed');
    }

    async getAccountFieldLocator(fieldName) {
        const locatorMap = {
            'First Name': this.locators.firstNameValue,
            'Last Name': this.locators.lastNameValue,
            'Date of Birth': this.locators.dateOfBirthValue,
            'Gender': this.locators.genderValue,
            'Email ID': this.locators.emailValue
        };

        const locator = locatorMap[fieldName];

        if (!locator) {
            throw new Error(
                `Locator not found for "${fieldName}". Please verify the locator definition in ChargezoneLocators.js`
            );
        }

        return $(locator);
    }

    async openMyEVs() {
        await this.openMyProfile();

        const myEVsMenu = await $(this.locators.myEVsMenu);
        await myEVsMenu.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: 'My EVs option is not displayed on the profile screen'
        });
        await myEVsMenu.click();

        const myEVsTitle = await $(this.locators.myEVsPageTitle);
        await myEVsTitle.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: 'My EVs page is not displayed after selecting My EVs'
        });
        await this.keywords.AllureScreenshot('My EVs Page Opened');
    }

    async clickAddVehiclePlusButton() {

        const { width, height } = await driver.getWindowSize();

        const x = Math.round(width * 0.88);
        const y = Math.round(height * 0.67);

        console.log(`Plus Button Tap | X: ${x} | Y: ${y}`);

        await browser.action('pointer', {
            parameters: { pointerType: 'touch' }
        })
            .move({ x, y })
            .down()
            .pause(300)
            .up()
            .perform();

        await this.keywords.AllureScreenshot('My EV Plus Button Clicked');

        await $(this.locators.addVehiclePrompt).waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Add Vehicle prompt did not appear after clicking the plus button'
        });

        console.log('My EV Plus Button Clicked Successfully');
    }

    async verifyAddVehiclePrompt(vehicleSearchName) {

        // Verify Add Vehicle Prompt
        const prompt = await $(this.locators.addVehiclePrompt);

        await prompt.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Add vehicle make and model prompt is not displayed'
        });

        expect(await prompt.isDisplayed()).toBe(true);

        await this.keywords.AllureScreenshot(
            "Add your Vehicle's make and model to continue"
        );

        // Click Vehicle Search Field
        const searchInput = await $(this.locators.vehicleSearchInput);

        await searchInput.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Vehicle search field is not displayed'
        });

        await searchInput.click();

        // Enter Vehicle Make
        await searchInput.setValue(vehicleSearchName);

        await this.keywords.AllureScreenshot('Vehicle Make Entered');

        console.log(`Vehicle Make Entered: ${vehicleSearchName}`);
    }

    async loginIfRequired(phoneNumber) {
        await driver.updateSettings({
            waitForIdleTimeout: 0,
            ignoreUnimportantViews: false,
            enforceXPath1: true
        });
        await driver.activateApp('com.dev.chargezone');

        const profile = await $(this.locators.profileTab);
        const myProfile = await $(this.locators.myProfileTitle);
        const account = await $(this.locators.accountTitle);
        const accountSettings = await $('~Account Settings');
        const getStarted = await $(this.locators.getStartedButton);
        const sendOTP = await $(this.locators.sendOTPButton);
        const phoneNumberField = await $(this.locators.phoneNumberField);

        await browser.waitUntil(async () => {
            if (await profile.isDisplayed().catch(() => false)) return true;
            if (await myProfile.isDisplayed().catch(() => false)) return true;
            if (await account.isDisplayed().catch(() => false)) return true;
            if (await accountSettings.isDisplayed().catch(() => false)) return true;
            if (await phoneNumberField.isDisplayed().catch(() => false)) return true;
            if (await sendOTP.isDisplayed().catch(() => false)) return true;
            return await getStarted.isDisplayed().catch(() => false);
        }, {
            timeout: 20000,
            timeoutMsg: 'Chargezone home or login screen was not displayed'
        });

        if (
            await profile.isDisplayed().catch(() => false) ||
            await myProfile.isDisplayed().catch(() => false) ||
            await account.isDisplayed().catch(() => false) ||
            await accountSettings.isDisplayed().catch(() => false)
        ) {
            console.log('Already logged in');
            return;
        }

        if (await getStarted.isDisplayed().catch(() => false)) {
            await this.clickGetStarted();
        }

        await this.enterPhoneNumber(phoneNumber);
        await this.clickSendOTP();
        await this.waitForOTP();
        // await this.enterOTP('1111');
        await this.clickVerifyOTPIfDisplayed();
        await this.allowLocationPermissionIfDisplayed();
        await this.allowPermissionIfDisplayed();
    }

    async openMyProfile() {
        await driver.updateSettings({
            waitForIdleTimeout: 0,
            ignoreUnimportantViews: false
        });
        await driver.activateApp('com.dev.chargezone');

        const profile = await $(this.locators.profileTab);
        const myProfile = await $(this.locators.myProfileTitle);
        const account = await $(this.locators.accountTitle);
        const accountSettings = await $('~Account Settings');
        const getStarted = await $(this.locators.getStartedButton);

        for (let attempt = 0; attempt < 3; attempt++) {
            const onProfile = await myProfile.isDisplayed().catch(() => false)
                || await profile.isDisplayed().catch(() => false);
            if (onProfile) {
                break;
            }
            if (
                await account.isDisplayed().catch(() => false) ||
                await accountSettings.isDisplayed().catch(() => false)
            ) {
                await this.clickAccountBack();
            }
        }

        try {
            await browser.waitUntil(async () => {
                const profileVisible = await profile.isDisplayed().catch(() => false);
                const myProfileVisible = await myProfile.isDisplayed().catch(() => false);
                const getStartedVisible = await getStarted.isDisplayed().catch(() => false);
                return profileVisible || myProfileVisible || getStartedVisible;
            }, {
                timeout: 30000,
                interval: 1000,
                timeoutMsg: 'Neither the Profile tab nor Get started was displayed'
            });
        } catch (error) {
            console.log('PAGE SOURCE:', await driver.getPageSource());
            throw error;
        }

        if (await myProfile.isDisplayed().catch(() => false)) {
            await this.keywords.AllureScreenshot('My Profile Already Open');
            return;
        }

        if (await getStarted.isDisplayed().catch(() => false)) {
            await this.clickGetStarted();
            await this.enterPhoneNumber(testData.loginData.phoneNumber);
            await this.clickSendOTP();
            await this.waitForOTP();
            await this.allowLocationPermissionIfDisplayed();
            await this.allowPermissionIfDisplayed();
        }

        await profile.waitForDisplayed({ timeout: 20000 });
        await profile.click();
        await this.keywords.AllureScreenshot('Profile Opened');
    }

    async verifyMyProfile(phoneNumber = testData.loginData.phoneNumber) {
        const title = await $(this.locators.myProfileTitle);

        await title.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'My Profile screen is not displayed'
        });

        const phone = await $(this.locators.profilePhone.replace('%s', phoneNumber));

        await phone.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: `Profile phone ${phoneNumber} is not displayed`
        });

        const actualPhone = await phone.getAttribute('content-desc');

        console.log(
            `Verify My Profile Phone | Expected: ${phoneNumber} | Actual: ${actualPhone}`
        );

        expect(actualPhone).toContain(phoneNumber);
        await this.keywords.AllureScreenshot('My Profile Verified');
    }

    async clickProfileAccountCard() {
        const card = await $(
            this.locators.profilePhone.replace('%s', testData.loginData.phoneNumber)
        );

        await card.waitForDisplayed({ timeout: 10000 });
        const location = await card.getLocation();
        const size = await card.getSize();

        await browser.action('pointer', { parameters: { pointerType: 'touch' } })
            .move({
                x: Math.round(location.x + size.width / 2),
                y: Math.round(location.y + size.height / 2)
            })
            .down()
            .up()
            .perform();

        const account = await $(this.locators.accountTitle);
        await account.waitForDisplayed({
            timeout: 20000,
            timeoutMsg: 'Account screen is not displayed'
        });

        await this.keywords.AllureScreenshot('Account Opened');
    }

    async clickEditFirstName() {
        await this.clickAccountField('First Name');
    }

    async clickEditLastName() {
        await this.clickAccountField('Last Name');
    }

    async clickEditEmail() {
        await this.scrollEmailFieldIntoView();
        await this.clickAccountField('Email ID');

        const emailInput = await $(this.locators.accountTextInput);
        await emailInput.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Email ID input did not open after tapping its edit button'
        });
    }

    async clickEditDateOfBirth() {
        await this.clickAccountField('Date of Birth');
    }

    async clickEditGender() {
        await this.clickAccountField('Gender');
    }

    async clickAccountField(fieldName) {
        try {
            await driver.hideKeyboard();
        } catch (error) {
            console.log('Keyboard already hidden');
        }

        const field = await $(
            fieldName.toLowerCase().includes('email')
                ? this.locators.accountEmailField
                : this.locators.accountField.replace('%s', fieldName)
        );

        if (!(await field.isDisplayed().catch(() => false))) {
            await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().descriptionContains("${fieldName}"))`);
        }

        await field.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: `Account field containing "${fieldName}" is not displayed`
        });

        const location = await field.getLocation();
        const size = await field.getSize();
        const y = size.height > 100
            ? Math.round(location.y + 45)
            : Math.round(location.y + (size.height / 2));

        await browser.action('pointer', { parameters: { pointerType: 'touch' } })
            .move({ x: 624, y })
            .down()
            .up()
            .perform();

        await this.keywords.AllureScreenshot(`${fieldName} Edit Opened`);
    }

    async scrollEmailFieldIntoView() {
        const { width, height } = await driver.getWindowSize();
        const viewportBottom = height - 80;
        const scrollArea = {
            left: Math.round(width * 0.1),
            top: Math.round(height * 0.15),
            width: Math.round(width * 0.8),
            height: Math.round(height * 0.75),
            direction: 'down',
            percent: 0.55
        };

        for (let attempt = 0; attempt < 8; attempt += 1) {
            const emailField = await $(this.locators.accountEmailField);
            const isDisplayed = await emailField.isDisplayed().catch(() => false);

            if (isDisplayed) {
                const location = await emailField.getLocation();
                const size = await emailField.getSize();
                const fullyVisible =
                    location.y >= 0 &&
                    location.y + size.height <= viewportBottom;

                if (fullyVisible) {
                    await this.keywords.AllureScreenshot('Email Field Scrolled Into View');
                    return;
                }
            }

            const canScrollFurther = await driver.execute(
                'mobile: scrollGesture',
                scrollArea
            );

            if (!canScrollFurther) {
                break;
            }
        }

        const emailField = await $(this.locators.accountEmailField);
        const location = await emailField.getLocation();
        const size = await emailField.getSize();
        const fullyVisible =
            location.y >= 0 &&
            location.y + size.height <= viewportBottom;

        if (fullyVisible) {
            await this.keywords.AllureScreenshot('Email Field Scrolled Into View');
            return;
        }

        throw new Error('Email ID field did not scroll fully into view on the Account screen');
    }


    async enterAccountFieldValue(value) {

    // Wait for the input field displayed after clicking the edit icon
    const inputFields = await $$('//android.widget.EditText');

    let activeInput = null;

    for (const field of inputFields) {
        if (await field.isDisplayed()) {
            activeInput = field;
            break;
        }
    }

    if (!activeInput) {
        throw new Error('Editable input field is not displayed');
    }

    await activeInput.waitForEnabled({ timeout: 10000 });

    await activeInput.clearValue();
    await activeInput.setValue(value);
}

    async verifyProfileUpdatedSuccessfully() {
        const message = await $(this.locators.profileUpdatedMessage);

        await message.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: 'Profile updated successfully message is not displayed'
        });

        await this.keywords.AllureScreenshot('Profile Updated Successfully');
    }

    async clickAccountSave() {
        const save = await $(this.locators.accountSaveButton);

        if (!(await save.isDisplayed().catch(() => false))) {
            try {
                await driver.hideKeyboard();
            } catch (error) {
                console.log('Keyboard already hidden');
            }
        }

        await save.waitForDisplayed({ timeout: 10000 });
        await save.click();
        await this.keywords.AllureScreenshot('Account Save Clicked');
    }


    async clickAccountSettings() {

        // ---------- Wait for Success Popup to Close ----------
        const popup = await $(this.locators.profileUpdatedMessage);

        const isPopupDisplayed = await popup.isDisplayed().catch(() => false);

        if (isPopupDisplayed) {
            console.log('[INFO] Success popup is displayed. Waits.');

            await popup.waitForDisplayed({
                reverse: true,
                timeout: 6000,
                timeoutMsg: 'Success popup did not close within 60 seconds'
            }).catch(() => {
                console.log('[WARNING] Popup is still displayed. Continuing execution.');
            });
        }

        // ---------- Click Account Settings ----------
        const element = await $(this.locators.accountSettingsButton);

        await element.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Account Settings button is not displayed'
        });

        const location = await element.getLocation();
        const size = await element.getSize();

        await browser.action('pointer', {
            parameters: { pointerType: 'touch' }
        })
            .move({
                x: Math.round(location.x + size.width / 2),
                y: Math.round(location.y + size.height / 2)
            })
            .down()
            .up()
            .perform();

        // ---------- Verify Account Settings Opened ----------
        const deleteAccount = await $(this.locators.deleteAccountOption);

        await deleteAccount.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Account Settings page did not open'
        });

        await this.keywords.AllureScreenshot(
            'Account Settings Opened'
        );

        console.log('[PASS] Account Settings page opened successfully');
    }

    async verifyDeleteAccountOption() {
        const element = await $(this.locators.deleteAccountOption);

        await element.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Delete Account option is not displayed'
        });

        await expect(element).toBeDisplayed();

        console.log('[VERIFY] Delete Account option is visible');

        await this.keywords.AllureScreenshot(
            'Delete Account Verified'
        );
    }

    async clickAccountBack() {
        const element = await $(this.locators.accountBackButton);

        await element.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Account Back button is not displayed'
        });

        await element.click();

        await browser.pause(1000);

        await this.keywords.AllureScreenshot(
            'Account Back Button Clicked'
        );
    }

    async verifyUpdatedProfileName(expectedFullName) {
        const locator = this.locators.profileDisplayName.replace(
            '%s',
            expectedFullName
        );

        const element = await $(locator);

        await element.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: `Updated profile name "${expectedFullName}" is not displayed`
        });

        const actualDescription = await element.getAttribute('content-desc');

        await expect(actualDescription).toContain(expectedFullName);

        console.log(`[VERIFY] Expected Full Name: ${expectedFullName}`);
        console.log(`[VERIFY] Actual Profile Description: ${actualDescription}`);

        await this.keywords.AllureScreenshot(
            'Updated Profile Name Verified'
        );
    }

    async searchAndSelectVehicle(vehicleName) {

        const searchValue = String(vehicleName).trim();

        if (!searchValue || searchValue === '[object Object]') {
            throw new Error(
                `Invalid vehicle search value. Expected a vehicle name, received: ${JSON.stringify(vehicleName)}`
            );
        }

        const searchInput = await $(this.locators.vehicleSearchInput);

        await searchInput.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Vehicle search input is not displayed'
        });

        await searchInput.click();
        await searchInput.clearValue();
        await searchInput.setValue(searchValue);

        console.log(`Vehicle Search | Expected: ${searchValue}`);

        await browser.pause(2000);

        const vehicleResult = await $(
            `//*[contains(@text, "${searchValue}") or contains(@content-desc, "${searchValue}")]`
        );

        await vehicleResult.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: `Vehicle search result not displayed: ${searchValue}`
        });

        await vehicleResult.click();

        await this.keywords.AllureScreenshot(`${searchValue} Selected`);

        console.log(`Vehicle Selected: ${searchValue}`);
    }

    //     async allowPermissionIfDisplayed() {

    //         const allowButton = await $(this.locators.allowPermissionButton);

    //         try {
    //             await allowButton.waitForDisplayed({ timeout: 5000 });
    //             await allowButton.click();

    //             console.log('Android permission allowed');

    //         } catch (error) {
    //             console.log('Permission popup not displayed');
    //         }
    //     }

    //     async clickGetStarted() {

    //         const getStarted = await $(this.locators.getStartedButton);

    //         await getStarted.waitForDisplayed({ timeout: 10000 });
    //         await getStarted.click();
    //     }

    //     async enterPhoneNumber(phoneNumber) {

    //         const phoneField = await $(this.locators.phoneNumberField);

    //         await phoneField.waitForDisplayed({ timeout: 10000 });
    //         await phoneField.setValue(phoneNumber);
    //     }

    //     async clickSendOTP() {

    //         const sendOTP = await $(this.locators.sendOTPButton);

    //         await sendOTP.waitForDisplayed({ timeout: 10000 });
    //         await sendOTP.click();
    //     }

    //     async waitForOTP() {

    //         console.log('Waiting 15 seconds for OTP...');

    //         await browser.pause(15000);
    //     }

    //     async clickVerifyOTP() {

    //         const verifyOTP = await $(this.locators.verifyOTPButton);

    //         await verifyOTP.waitForDisplayed({ timeout: 10000 });
    //         await verifyOTP.click();
    //     }

    //     async allowLocationPermissionIfDisplayed() {

    //     const locationAllowButton = await $(this.locators.locationPermissionButton);

    //     try {
    //         await locationAllowButton.waitForDisplayed({ timeout: 5000 });
    //         await locationAllowButton.click();

    //         console.log('Location permission allowed');

    //     } catch (error) {
    //         console.log('Location permission popup not displayed');
    //     }
    // }

    // async clickWallet() {
    //     const wallet = await $(this.locators.walletOption);

    //     await wallet.waitForDisplayed({ timeout: 10000 });
    //     await wallet.click();
    // }

    // async clickAddMoney() {
    //     const addMoney = await $(this.locators.addMoneyButton);

    //     await addMoney.waitForDisplayed({ timeout: 10000 });
    //     await addMoney.click();
    // }

    // async enterAmount(amount) {
    //     const amountField = await $(this.locators.amountField);

    //     await amountField.waitForDisplayed({ timeout: 10000 });
    //     await amountField.clearValue();
    //     await amountField.setValue(String(amount));
    // }

    // async clickProceedToPay() {
    //     const proceedButton = await $(this.locators.proceedToPayButton);

    //     await proceedButton.waitForDisplayed({ timeout: 10000 });
    //     await proceedButton.click();
    // }

    // async waitForPaymentPage() {
    //     await browser.pause(6000);
    // }

    // async clickOtherBanks() {
    //     const otherBanks = await $(this.locators.otherBanksOption);

    //     await otherBanks.waitForDisplayed({ timeout: 10000 });
    //     await otherBanks.click();
    // }

    // async selectBank(bankName) {
    //     const bankLocator = this.locators.bankOption.replace('%s', bankName);
    //     const bank = await $(bankLocator);

    //     await bank.waitForDisplayed({ timeout: 10000 });
    //     await bank.click();
    // }

    // async clickSelectBankProceed() {
    //     const proceedButton = await $(this.locators.selectBankProceedButton);

    //     await proceedButton.waitForDisplayed({ timeout: 10000 });
    //     await proceedButton.click();
    // }

    // // Switch to Payment WebView
    // async switchToPaymentWebView() {

    //     const contexts = await driver.getContexts();

    //     console.log('Available contexts:', contexts);

    //     const webViewContext = contexts.find(context =>
    //         context.toString().includes('WEBVIEW')
    //     );

    //     if (!webViewContext) {
    //         throw new Error('Payment WebView context not found');
    //     }

    //     await driver.switchContext(webViewContext);

    //     console.log('Switched to Payment WebView');
    // }


    // // Get Transaction ID
    // async getTransactionId() {

    //     const element = await $(this.locators.transactionId);

    //     await element.waitForDisplayed({ timeout: 10000 });

    //     return await element.getText();
    // }


    // // Get Order ID
    // async getOrderId() {
    //     const element = await $(this.locators.orderId);
    //     await element.waitForDisplayed({ timeout: 10000 });
    //     const text = await element.getText();
    //     return text.includes(':') ? text.split(':')[1].trim() : text;
    // }


    // // Get Currency
    // async getCurrency() {

    //     const element = await $(this.locators.currency);

    //     await element.waitForDisplayed({ timeout: 10000 });

    //     return await element.getText();
    // }


    // // Get Amount
    // async getAmount() {

    //     const element = await $(this.locators.amount);

    //     await element.waitForDisplayed({ timeout: 10000 });

    //     return await element.getText();
    // }


    // // Get all Payment Details
    // async getPaymentDetails() {

    //     const transactionId = await this.getTransactionId();
    //     const orderId = await this.getOrderId();
    //     const currency = await this.getCurrency();
    //     const amount = await this.getAmount();

    //     console.log('Transaction ID:', transactionId);
    //     console.log('Order ID:', orderId);
    //     console.log('Currency:', currency);
    //     console.log('Amount:', amount);

    //     return {
    //         transactionId,
    //         orderId,
    //         currency,
    //         amount
    //     };
    // }


    // // Select Transaction State
    // // async selectTransactionState() {

    // //     const dropdown = await $(this.locators.transactionStateDropdown);

    // //     await dropdown.waitForDisplayed({ timeout: 10000 });
    // //     await dropdown.click();

    // //     const charged = await $(this.locators.chargedOption);

    // //     await charged.waitForDisplayed({ timeout: 10000 });
    // //     await charged.click();

    // //     console.log('Transaction State selected: CHARGED');
    // // }


    // // Click Submit
    // async clickSubmit() {

    //     const submit = await $(this.locators.submitButton);

    //     await submit.waitForDisplayed({ timeout: 10000 });
    //     await submit.click();

    //     console.log('Submit button clicked');
    // }

    // async waitForSimulatorNative() {
    //     await driver.switchContext('NATIVE_APP');
    //     const heading = await $('android=new UiSelector().textContains("Choose the statuses")');
    //     await heading.waitForExist({ timeout: 40000, timeoutMsg: 'Simulator form not in native tree' });
    //     console.log(await driver.getPageSource());   // check how labels and values appear
    // }

    // // async waitForSimulator() {
    // //     // Give the "Redirecting to payment page" screen time to finish
    // //     await browser.pause(3000);

    // //     // Try WebView first (only works if the WebView is debuggable)
    // //     const contexts = (await driver.getContexts()).map(String);
    // //     console.log('Available contexts:', contexts);

    // //     const webView = contexts.find(c => c.includes('WEBVIEW'));
    // //     if (webView) {
    // //         await driver.switchContext(webView);
    // //         this.isWebView = true;
    // //         console.log('Using WebView context');
    // //         return;
    // //     }

    // //     // Fallback: the form is exposed in the native tree
    // //     await driver.switchContext('NATIVE_APP');
    // //     this.isWebView = false;
    // //     const heading = await $('android=new UiSelector().textContains("Choose the statuses")');
    // //     await heading.waitForExist({ timeout: 40000, timeoutMsg: 'Simulator form not found in native tree' });
    // //     console.log('Using NATIVE_APP context');
    // // }

    // async switchToNative() {
    //     await driver.switchContext('NATIVE_APP');
    // }

    // //New 


    // async waitForSimulator() {
    //     await driver.updateSettings({ waitForIdleTimeout: 0, waitForSelectorTimeout: 0 });
    //     await driver.switchContext('NATIVE_APP');

    //     await browser.waitUntil(async () => {
    //         const els = await $$(this.locators.simulatorHeading);
    //         return els.length > 0;
    //     }, { timeout: 60000, interval: 1000, timeoutMsg: 'Simulator form not found' });

    //     // TEMP: dump once so we can see how labels and values appear
    //     console.log(await driver.getPageSource());
    // }

    // // Reads the value next to a label. Falls back to splitting "Label: value".
    // async getValueByLabel(labelLocator) {
    //     const label = await $(labelLocator);
    //     await label.waitForExist({ timeout: 15000 });

    //     const sibling = await label.$('./following-sibling::*[1]');
    //     if (await sibling.isExisting()) {
    //         const t = ((await sibling.getText()) || (await sibling.getAttribute('content-desc')) || '').trim();
    //         if (t) return t;
    //     }

    //     const own = ((await label.getText()) || (await label.getAttribute('content-desc')) || '').trim();
    //     return own.includes(':') ? own.split(':').slice(1).join(':').trim() : own;
    // }

    // async getTransactionId() {
    //     const el = await $(this.locators.transactionIdValue);
    //     await el.waitForExist({ timeout: 15000 });
    //     return ((await el.getText()) || (await el.getAttribute('content-desc'))).trim();
    // }

    // async getOrderId()  { return this.getValueByLabel(this.locators.orderIdLabel); }
    // async getCurrency() { return this.getValueByLabel(this.locators.currencyLabel); }
    // async getAmount()   { return this.getValueByLabel(this.locators.amountLabel); }

    // async selectTransactionState() {
    //     const dropdown = await $(this.locators.transactionStateDropdown);
    //     await dropdown.waitForExist({ timeout: 15000 });
    //     await dropdown.click();

    //     const charged = await $(this.locators.chargedOption);
    //     await charged.waitForExist({ timeout: 15000 });
    //     await charged.click();
    // }

    // async clickSubmit() {
    //     const submit = await $(this.locators.submitButton);
    //     await submit.waitForExist({ timeout: 15000 });
    //     await browser.pause(500);          // let the button turn from light blue to enabled
    //     await submit.click();
    // }

    // async clickPlanTrip() {
    //     const planTrip = await $(this.locators.planTripButton);

    //     const exists = await planTrip.isExisting();

    //     console.log('Plan Trip Exists:', exists);

    //     if (!exists) {
    //         throw new Error(
    //             'Plan Trip button not found. Check the current screen and locator.'
    //         );
    //     }

    //     await planTrip.waitForDisplayed({ timeout: 10000 });
    //     await planTrip.click();
    // }

    // // Click Current Location and Close Button 1
    // async clickCurrentLocation() {
    //     const currentLocation = await $(this.locators.currentLocationField);

    //     await currentLocation.waitForDisplayed({ timeout: 10000 });
    //     await currentLocation.click();

    //     const closeButton = await $(this.locators.closeButton1);

    //     await closeButton.waitForDisplayed({ timeout: 10000 });
    //     await closeButton.click();

    //     console.log('Current Location and Close Button 1 clicked');
    // }

    // // Click Where To and Close Button 2
    // async clickWhereTo() {
    //     const toLocation = await $(this.locators.toLocationField);

    //     await toLocation.waitForDisplayed({ timeout: 10000 });
    //     await toLocation.click();

    //     const closeButton = await $(this.locators.closeButton2);

    //     await closeButton.waitForDisplayed({ timeout: 10000 });
    //     await closeButton.click();

    //     console.log('Where To and Close Button 2 clicked');
    // }

    // // Enter From Location
    // async enterFromLocation(location) {
    //     const fromField = await $(this.locators.fromLocationInput);

    //     await fromField.waitForDisplayed({ timeout: 10000 });
    //     await fromField.click();
    //     await fromField.setValue(location);
    //     await this.selectFirstLocationSuggestion();


    //     console.log(`From Location: ${location}`);
    // }

    // // Enter Destination
    // async enterDestinationLocation(location) {
    //     const toField = await $(this.locators.destinationLocationInput);

    //     await toField.waitForDisplayed({ timeout: 10000 });
    //     await toField.click();
    //     await toField.setValue(location);
    //     await this.selectFirstLocationSuggestion();


    //     console.log(`To Location: ${location}`);
    // }

    // async debugCurrentScreen() {
    //     console.log('CURRENT CONTEXT:', await browser.getContext());

    //     const pageSource = await browser.getPageSource();
    //     console.log('CURRENT PAGE SOURCE:', pageSource);
    // }



    // // async clickEVStationByCoordinates() {
    // //     return await tapByLatLng();
    // // }


    // async clickEVStationByCoordinates(evStationData) {
    //     return await tapByLatLng(evStationData);
    // }


    // // async clickEVStationByCoordinates() {
    // //     const screenshotDir = './screenshots';

    // //     if (!fs.existsSync(screenshotDir)) {
    // //         fs.mkdirSync(screenshotDir, { recursive: true });
    // //     }

    // //     await driver.saveScreenshot(`${screenshotDir}/before_pin_tap.png`);

    // //     const coordinates = await tapByLatLng();

    // //     await driver.pause(3000);

    // //     await driver.saveScreenshot(`${screenshotDir}/after_pin_tap.png`);

    // //     console.log('Tapped Coordinates:', coordinates);

    // //     console.log(
    // //         'PAGE SOURCE AFTER EV TAP:\n',
    // //         await driver.getPageSource()
    // //     );

    // //     return coordinates;
    // // }


    //   async selectFirstLocationSuggestion() {

    //     await browser.waitUntil(
    //         async () => {
    //             const suggestions = await $$(
    //                 this.locators.firstLocationSuggestion
    //             );

    //             return suggestions.length > 0;
    //         },
    //         {
    //             timeout: 15000,
    //             interval: 500,
    //             timeoutMsg: 'Location suggestions not displayed'
    //         }
    //     );

    //     const suggestions = await $$(
    //         this.locators.firstLocationSuggestion
    //     );

    //     for (const suggestion of suggestions) {
    //         if (
    //             await suggestion.isDisplayed() &&
    //             await suggestion.isEnabled()
    //         ) {
    //             await suggestion.click();
    //             console.log('First location suggestion clicked');
    //             return;
    //         }
    //     }

    //     throw new Error('No clickable location suggestion found');
    // }


    // async debugClickableElements() {
    //     const pageSource = await driver.getPageSource();

    //     const matches = pageSource.match(/<[^>]+clickable="true"[^>]*>/g) || [];

    //     console.log('CLICKABLE ELEMENTS:');

    //     matches.forEach((element, index) => {
    //         console.log(`${index + 1}: ${element}`);
    //     });
    // }

    // async verifyStationCardOpened(stationName) {
    //     const title = await $(`~${stationName}`);
    //     await title.waitForExist({
    //         timeout: 10000,
    //         timeoutMsg: `Station card not opened for: ${stationName}`
    //     });
    //     console.log(`Station card opened: ${stationName}`);
    // }

    // async clickChargeNow() {
    //     const btn = await $('~Charge Now');
    //     await btn.waitForExist({ timeout: 10000 });
    //     await btn.click();
    //     console.log('Charge Now clicked');
    // }

    // async verifyZonePageVisible() {
    //     const zonePage = await $(this.locators.ZonePageScrollView);

    //     await zonePage.waitForDisplayed({
    //         timeout: 10000,
    //         timeoutMsg: 'Zone page is not displayed'
    //     });

    //     const isVisible = await zonePage.isDisplayed();

    //     console.log(
    //         `Verify Zone Page Visibility | Expected: true | Actual: ${isVisible}`
    //     );

    //     expect(isVisible).toBe(true);
    // }

    // async verifyAvailabilityAndClickConnector(stationConnectorData) {

    //     const {
    //         connector,
    //         status,
    //         connectionType,
    //         power,
    //         price
    //     } = stationConnectorData;

    //     const expectedDescription = [
    //         connector,
    //         status,
    //         connectionType,
    //         power,
    //         price
    //     ].join('\n');

    //     const parentLocator = this.locators.stationConnectorDetails
    //         .replace('%s', expectedDescription);

    //     const connectorDetails = await $(parentLocator);

    //     await connectorDetails.waitForDisplayed({ timeout: 10000 });

    //     const actualDescription = await connectorDetails.getAttribute('content-desc');

    //     const actualStatus = actualDescription.split('\n')[1]?.trim();

    //     console.log(
    //         `Verify EV Zone Availability | Expected: ${status} | Actual: ${actualStatus}`
    //     );

    //     expect(actualStatus).toBe(status);

    //     const imageLocator = await $(
    //         `${parentLocator}${this.locators.stationConnectorImage}`
    //     );

    //     await imageLocator.waitForDisplayed({ timeout: 10000 });
    //     await imageLocator.click();

    //     console.log('Available EV Zone selected');
    // }


    // async clickChargeNow() {
    //     const chargeNow = await $(this.locators.chargeNowButton);

    //     await chargeNow.waitForDisplayed({ timeout: 10000 });
    //     await chargeNow.click();

    //     console.log('Charge Now clicked');
    // }

    // async verifyStationName() {
    //     const expectedStationName = testData.tripData.evStation.name;

    //     const stationLocator = this.locators.stationName.replace(
    //         '%s',
    //         expectedStationName
    //     );

    //     const station = await $(stationLocator);

    //     await station.waitForDisplayed({ timeout: 10000 });

    //     const actualStationName = await station.getAttribute('content-desc');

    //     console.log(
    //         `Verify Station Name | Expected Station Name : ${expectedStationName} | Actual Station Name  : ${actualStationName}`
    //     );

    //     expect(actualStationName).toBe(expectedStationName);
    // }

    // async enterChargingAmount(amount) {
    //     const amountField = await $(this.locators.amountInput);

    //     await amountField.waitForDisplayed({ timeout: 10000 });
    //     await amountField.clearValue();
    //     await amountField.setValue(String(amount));

    //     console.log(`Charging Amount Entered: ${amount}`);
    // }

    // async clickUnitsTab() {
    //     const unitsTab = await $(this.locators.unitsTab);

    //     await unitsTab.waitForDisplayed({ timeout: 10000 });
    //     await unitsTab.click();

    //     console.log('Units tab clicked');
    // }

    // async clickContinue() {
    //     const continueButton = await $(this.locators.continueButton);

    //     await continueButton.waitForDisplayed({ timeout: 10000 });
    //     await continueButton.click();

    //     console.log('Continue button clicked');
    // }

    // async clickStartCharging() {
    //     const startCharging = await $(this.locators.startChargingButton);

    //     await startCharging.waitForDisplayed({ timeout: 10000 });
    //     await startCharging.click();

    //     console.log('Start Charging clicked');
    // }

    // async verifyPlugGunErrorMessage() {
    //     const errorMessage = await $(this.locators.plugGunErrorMessage);

    //     await errorMessage.waitForDisplayed({
    //         timeout: 15000,
    //         timeoutMsg: 'Plug the gun error message is not displayed'
    //     });

    //     const isVisible = await errorMessage.isDisplayed();

    //     console.log(
    //         `Verify Plug Gun Error Message | Expected: true | Actual: ${isVisible}`
    //     );

    //     expect(isVisible).toBe(true);
    // }

    // async clickSkip() {
    //     const skipButton = await $(this.locators.skipButton);

    //     await skipButton.waitForDisplayed({ timeout: 10000 });
    //     await skipButton.click();

    //     console.log('Skip button clicked');
    // }

    // async enterChargingUnits(units) {
    //     const unitsField = await $(this.locators.unitsInput);

    //     await unitsField.waitForDisplayed({ timeout: 10000 });
    //     await unitsField.clearValue();
    //     await unitsField.setValue(String(units));

    //     console.log(`Charging Units Entered: ${units}`);
    // }

}