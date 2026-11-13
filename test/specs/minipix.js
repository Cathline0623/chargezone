import { keywords } from "../../keyword.js";
import MiniPixLogin from "../../locator/minipix_Login.js";
import minipix_data from "../../datasheet/minipix_data.js";
import minipix_Login from "../../locator/minipix_Login.js";

const key = new keywords();


describe("MiniPix End-to-End Workflow", () => {
  it("Verify MiniPix app functionality", async () => {

    await MiniPixLogin.login(
      minipix_data.Phone_Number,
      minipix_data.Otp,

    );

    await MiniPixLogin.verifyMyProfileButton();

    await MiniPixLogin.languageSelection();
    await MiniPixLogin.searchfunctionality(minipix_data.searchmovie);

    await minipix_Login.verifyMyProfileButton();
    await minipix_Login.verifyLoggedInPhoneNumber(minipix_data.Phone_Number);

    const count = (await minipix_Login.menuOptions).length;
     console.log("Menu count:", count);
    const optionText = [];
     for (let i = 0; i < count-1; i++) {
      optionText[i] = await key.getText(minipix_Login.menuOptions[i].$('android.widget.TextView'), `text of menu option ${i + 1}`);
         console.log(`Menu option ${i + 1}:`, optionText[i]);
 
    }

      await minipix_Login.verifySubscriptionOption();

      await minipix_Login.verifywatchHistoryOption();

      await minipix_Login.verifyPrivacyPolicyOption();
      await minipix_Login.verifyTermsConditionOption();
      await minipix_Login.verifyHelpOption();
      await minipix_Login.verifyNotificationOption(minipix_data.notification_Text);


    await minipix_Login.logout();

    //    const errorText = await MiniPixLogin.getErrorMessageText();
    // console.log("Error Message is:", errorText);

    // if (errorText === "Forbidden1") {
    //   console.log("Correct error message displayed");
    // } else {
    //   throw new Error("Incorrect error message");
    // }




  });
});