import { $, browser } from "@wdio/globals";
import { keywords } from "../keyword.js";

const key = new keywords();

class MiniPixLogin {
  get allow_Button() {
    return $(
      '//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]'
    );
    
}
get miniPixLogo() {
  return $('~MiniPIX Logo');
}

get phoneNumberField() {
  return $('//android.widget.EditText');
}

get loginButton() {
  return $('//android.widget.ScrollView/android.view.View[1]');
}

get otpField() {
  return $('//android.widget.ScrollView/android.widget.EditText[1]');
}

get errorMessage() {
  return $('//android.widget.TextView[@text="Forbidden"]');
}

get search_button(){
  return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[4]');
}
get searchField(){
  return $('//android.widget.EditText');
}

searchResult(searchmovie) {
  return $(`//android.widget.TextView[@text="${searchmovie}"]`);
}

get myprofile_button(){
  return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]/android.view.View');
}

get language_button(){
  return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]');
}

get english_language_option(){
  return $('//android.widget.TextView[contains(@text,"English")]');
}

get close_button(){
  return $('//android.widget.ImageView[@content-desc="close"]');
}

// get back_button(){
//   return $('//android.view.View[@content-desc="Back"]');
// }

get account_button(){
  return $('//android.widget.TextView[@text="Account"]/..');
}

phoneNumberDisplay(phoneNumber) {
  const formattedNumber = `+91${phoneNumber}`;
  return $(`//android.widget.TextView[@text="${formattedNumber}"]`);
}

get signout_button(){
  return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[9]');
}

get logout_Popup(){
  return $('//android.widget.TextView[@text="Do you want to logout?"]');
}

get popup_Yes_Button(){
  return $('//android.view.ViewGroup/android.view.View/android.view.View/android.view.View/android.view.View[1]');
}
get home_tab(){
  return $('//android.widget.TextView[contains(@text,"Home")]/..');
}

get menuOptions() {
    return $$('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View');
}

get subscriptionOption() {
    return $('//android.widget.TextView[@text="Subscriptions"]/..');
}

get trialplan() {
    return $('//android.widget.TextView[contains(@text,"Start Trial")]');
}

// get back_button() {
//     return $('//android.widget.ImageView[@content-desc="Back"]/ancestor::android.view.View[1]');
// }

get back_button() {
  return $('android=new UiSelector().description("Back").fromParent(new UiSelector())');
}

get watch_History_Option() {
    return $('//android.widget.TextView[@text="Watch History"]/..');
}
get watchlist_Message(){
  return $('//android.widget.TextView[@text="Your Watched list is empty"]');
}

get privacy_Policy_Option() {
    return $('//android.widget.TextView[@text="Privacy Policy"]/..');
}

get terms_Condition_Option() {
    return $('//android.widget.TextView[@text="Terms & Conditions"]/..');
}

get help_Option() {
    return $('//android.widget.TextView[@text="Help"]/..');
}

get Notification_ON_Text() {
  return $('android=new UiSelector().className("android.widget.TextView").text("ON")');
}


get Help_contact_Us_Text() {
    return $('//android.widget.TextView[@text="Minipix Entertainment Private Limited"]');
}

get subscriptionBack_Option(){
  return $('//android.widget.ImageView[@content-desc="Back"]');
}
// get Notification_ON_Text() {
//     return $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[8]/android.view.View[2]');
// }



  async login(Phone_Number, Otp) {
    await browser.setTimeout({ implicit: 60000 });

  await key.click(this.allow_Button, "Click Allow Permission Button");

  await key.verifyElementDisplayed(this.miniPixLogo, "MiniPIX Logo");

    // Enter username
    await key.click(this.phoneNumberField, "Click Phone Number Field");
    await key.setValue(this.phoneNumberField, Phone_Number, "Enter Phone Number");

    await key.click(this.loginButton, "Click Login Button");

      await key.waitForDisplayed(this.otpField, 20000, "Wait for OTP Field");

    await key.setValue(this.otpField, Otp, "Enter OTP");
    

  }
  
 async getErrorMessageText() {
    await key.waitForDisplayed(this.errorMessage, 10000, "Wait for Error Message");
    return await key.getText(this.errorMessage, "Get Error Message Text");
  }

async verifyMyProfileButton() {
  await key.click(this.myprofile_button, "Click My Profile Button");
 
}

async languageSelection() {
  await key.click(this.language_button, "Click Language Button");
  await key.waitForDisplayed(this.english_language_option, 10000, "Wait for English Language Option");
  await key.click(this.english_language_option, "Select English Language Option");
  await key.click(this.close_button, "Click Close Button");
  await key.click(this.back_button, "Click Back Button");
}



  async searchfunctionality(searchmovie) {
    await key.click(this.search_button, "Click Search Button");
    await key.setValue(this.searchField, searchmovie, "Enter Movie Name in Search Field");
const resultText = await key.getText(
    this.searchResult(searchmovie),
    "Get Search Result Text"
  );

  if (resultText !== searchmovie) {
    throw new Error(`Expected ${searchmovie} but found ${resultText}`);
  } 

   await key.verifyElementDisplayed(
    this.searchResult(searchmovie),
    `${searchmovie}  in search results`,
    searchmovie  
  );
  await key.click(this.home_tab, "Click Home Tab to Clear Search");
 }


async verifyLoggedInPhoneNumber(phoneNumber) {
  await key.click(this.account_button, "Click Account Button");

  const formattedNumber = `+91${phoneNumber}`;

  await key.waitForDisplayed(
    this.phoneNumberDisplay(phoneNumber),
    10000,
    "Wait for Displayed Phone Number"
  );

  const actualText = await key.getText(
    this.phoneNumberDisplay(phoneNumber),
    "Get Displayed Phone Number"
  );

  if (actualText !== formattedNumber) {
    throw new Error(`Expected ${formattedNumber} but found ${actualText}`);
  }

   await key.verifyElementDisplayed(
    this.phoneNumberDisplay(phoneNumber),
   `${formattedNumber} is displayed as the logged-in phone number`,
    formattedNumber
  );
await key.click(this.close_button, "Click Close Button");

}


async verifySubscriptionOption() {
  await key.click(this.subscriptionOption, "Click Subscription Option");
  await key.waitForDisplayed(this.trialplan, 10000, "Wait for Trial Plan Option");
  await key.verifyElementDisplayed(this.trialplan, "Start Trial for ₹299 Option is Displayed");
  await key.click(this.subscriptionBack_Option, "Click Back Button to Return to My Profile");
}

 async verifywatchHistoryOption() {
  await key.click(this.watch_History_Option, "Click Watch History Option");
  await key.waitForDisplayed(this.watchlist_Message, 10000, "Wait for Watchlist Message");
  await key.verifyElementDisplayed(this.watchlist_Message, "Your Watched list is empty message is displayed");
 await key.click(this.back_button, "Click Back Button to Return to My Profile"); 
}

async verifyPrivacyPolicyOption() {

  await key.click(this.privacy_Policy_Option, "Click Privacy Policy Option");

  // Get screen size
  const { width, height } = await driver.getWindowSize();

  const startX = Math.floor(width / 2);
  const startY = Math.floor(height * 0.8);
  const endY = Math.floor(height * 0.2);

  // Scroll multiple times to reach bottom
  for (let i = 0; i < 3; i++) {
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: startX, y: startY },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 300 },
        { type: 'pointerMove', duration: 800, x: startX, y: endY },
        { type: 'pointerUp', button: 0 }
      ]
    }]);

    await driver.pause(800);
  }


  await key.click(this.back_button, "Click Back Button");
}


async verifyTermsConditionOption() {

  await key.click(this.terms_Condition_Option, "Click Terms & Conditions Option");

  // Get screen size
  const { width, height } = await driver.getWindowSize();

  const startX = Math.floor(width / 2);
  const startY = Math.floor(height * 0.8);
  const endY = Math.floor(height * 0.2);

  // Scroll multiple times to reach bottom
  for (let i = 0; i < 7; i++) {
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: startX, y: startY },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 300 },
        { type: 'pointerMove', duration: 800, x: startX, y: endY },
        { type: 'pointerUp', button: 0 }
      ]
    }]);

    await driver.pause(800);
  }


  await key.click(this.back_button, "Click Back Button");
}





async verifyHelpOption() {
  await key.click(this.help_Option, "Click Help Option");
  await key.waitForDisplayed(this.Help_contact_Us_Text, 10000, "Wait for Help Contact Us Text");
  await key.verifyElementDisplayed(this.Help_contact_Us_Text, "Help Contact Us Text is Displayed");
  await key.click(this.back_button, "Click Back Button to Return to My Profile");
}

async verifyNotificationOption(notification_Text) {


  await this.Notification_ON_Text.waitForDisplayed({ timeout: 10000 });

  const actualText = await this.Notification_ON_Text.getText();

  console.log("Notification Text ->", actualText);

  if (actualText !== notification_Text) {
    throw new Error(`Expected ${notification_Text} but found ${actualText}`);
  }
}



async logout() {
  await key.click(this.signout_button, "Click Sign Out Button");
  await key.waitForDisplayed(this.logout_Popup, 10000, "Wait for Logout Popup");
  await key.click(this.popup_Yes_Button, "Click Yes Button on Logout Popup");
}

    // // Verify button background color
    // await key.verifyButtonColor(
    //   this.loginButton,
    //   SignIn_Button_Color,
    //   "Sign In Button Color verification"
    // );


  

}
 export default new MiniPixLogin();