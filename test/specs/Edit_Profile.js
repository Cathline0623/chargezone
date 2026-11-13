
import { generateRandomName } from '../../utils/randomName.js';
import { ChargezonePage } from '../../pages/ChargezonePage.js';
import testData from '../../datasheet/chargezone.js';

describe('Chargezone Mobile Application', () => {

    const chargezonePage = new ChargezonePage();
    const randomName = generateRandomName();

    it('Edit Profile', async () => {

        await chargezonePage.allowPermissionIfDisplayed();
        await chargezonePage.clickGetStarted();

        // Login
        await chargezonePage.enterPhoneNumber(
            testData.loginData.phoneNumber
        );

        await chargezonePage.clickSendOTP();
        await chargezonePage.enterOTP('1111');

        await chargezonePage.allowLocationPermissionIfDisplayed();
        await chargezonePage.allowPermissionIfDisplayed();

        // Open My Profile
        await chargezonePage.openMyProfile();
        await chargezonePage.verifyMyProfile();
        await chargezonePage.clickProfileAccountCard();

        // Update First Name
        await chargezonePage.clickEditFirstName();
        await chargezonePage.enterAccountFieldValue(
            randomName.firstName
        );
        await chargezonePage.clickAccountSave();
        console.log('First Name:', randomName.firstName);
        await chargezonePage.verifyProfileUpdatedSuccessfully();

        // Update Last Name
        await chargezonePage.clickEditLastName();
        await chargezonePage.enterAccountFieldValue(
            randomName.lastName
        );
        await chargezonePage.clickAccountSave();
        console.log('Last Name:', randomName.lastName);
        await chargezonePage.verifyProfileUpdatedSuccessfully();

        // Update Date of Birth
        await chargezonePage.clickEditDateOfBirth();
        await chargezonePage.clickBirthDateCalendar();

        await chargezonePage.selectBirthDay(
            testData.profileData.birthDay
        );

        await chargezonePage.clickDatePickerOk();
        await chargezonePage.clickAccountSave();
        await chargezonePage.verifyProfileUpdatedSuccessfully();

        // Update Gender
        await chargezonePage.clickEditGender();

        await chargezonePage.selectGender(
            testData.profileData.gender
        );

        await chargezonePage.clickAccountSave();
        await chargezonePage.verifyProfileUpdatedSuccessfully();

        // Update Email
        await chargezonePage.scrollToEmailField();
        await chargezonePage.clickEditEmail();

        await chargezonePage.enterAccountFieldValue(
            testData.profileData.email
        );

        await chargezonePage.clickAccountSave();
        await chargezonePage.verifyProfileUpdatedSuccessfully();

        // Account Settings
        await chargezonePage.clickAccountSettings();
        await chargezonePage.verifyDeleteAccountOption();

        // Navigate Back
        await chargezonePage.clickAccountBack();
        await chargezonePage.clickAccountBack();

        // Verify Updated Profile Name
        await chargezonePage.verifyUpdatedProfileName(
            randomName.fullName
        );

        // Logout
        await chargezonePage.scrollToLogoutAndClick();

    });
});
