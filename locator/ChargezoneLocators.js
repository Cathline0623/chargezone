
export class ChargezoneLocators {

    getStartedButton = '//android.view.View[@content-desc="Get started"]';

    phoneNumberField = '//android.widget.EditText';

    allowPermissionButton = '//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]';
    sendOTPButton = '//android.view.View[@content-desc="Send OTP"]';

    verifyOTPButton = '//android.view.View[@content-desc="Verify OTP"]';

    locationPermissionButton = '//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_foreground_only_button"]';

    walletOption = '//android.widget.ImageView[@content-desc="Wallet"]';

    addMoneyButton = '//android.view.View[@content-desc="Add money"]';

    amountField = '//android.widget.EditText[@text="1000"]';

    proceedToPayButton = '//android.view.View[@content-desc="Proceed to pay"]';

    otherBanksOption = '//android.widget.TextView[@content-desc="msg_text" and @text="Other Banks"]';

    bankOption = '//android.widget.TextView[@text="%s"]';

    selectBankProceedButton = '//android.widget.TextView[@content-desc="msg_text" and @text="Proceed to Pay "]';

    // Juspay Payment Details
    transactionId = '//*[contains(normalize-space(.),"Transaction")]/following-sibling::*[1]';

    orderId = '//*[contains(normalize-space(.),"Order id")]/following-sibling::*[1]';

    currency = '//*[contains(normalize-space(.),"Currency")]/following-sibling::*[1]';

    amount = '//*[contains(normalize-space(.),"Amount")]/following-sibling::*[1]';

    // Transaction State
    // transactionStateDropdown = '//*[contains(@text,"Select Options")]';

    // chargedOption = '//*[contains(@text,"CHARGED")]';

    // submitButton = '//*[contains(@text,"Submit")]';

    simulatorHeading = '//*[contains(@text,"Choose the statuses") or contains(@content-desc,"Choose the statuses")]';

    // label locators (value is read relative to the label)
    transactionIdLabel = '//*[contains(@text,"Transaction") or contains(@content-desc,"Transaction")]';
    // orderIdLabel       = '//*[contains(@text,"Order id") or contains(@content-desc,"Order id")]';
    currencyLabel = '//*[contains(@text,"Currency") or contains(@content-desc,"Currency")]';
    // amountLabel        = '//*[contains(@text,"Amount") or contains(@content-desc,"Amount")]';
    amountLabel = '//*[@resource-id="amt-id-val"]';
    orderIdLabel = '//*[@resource-id="order-id-val"]';


    orderId = '//*[@resource-id="order-id-val"]';
    amount = '//*[@resource-id="amt-id-val"]';

    // transaction id value starts with "chargezone-"
    transactionIdValue = '//*[starts-with(@text,"chargezone-") or starts-with(@content-desc,"chargezone-")]';

    // transactionStateDropdown = '//*[contains(@text,"Select Options") or contains(@content-desc,"Select Options")]';
    chargedOption = '//*[@text="CHARGED" or @content-desc="CHARGED"]';
    submitButton = '//*[@text="Submit" or @content-desc="Submit"]';


    // Plan Trip
    planTripButton = '//android.widget.ImageView[@content-desc="Plan trip"]';
    currentLocationField = '//android.view.View[@content-desc="Current location"]';
    toLocationField = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]';

    yourLocationOption =
        '//android.widget.ImageView[@content-desc="Your Location"]';

    // Close buttons
    closeButton1 = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[2]';

    closeButton2 = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[3]';
    fromLocationInput = '//android.widget.EditText[@hint="Current location"]';

    destinationLocationInput = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]';

    firstLocationSuggestion = '//android.widget.ScrollView/android.widget.ImageView';

    ZonePageScrollView = '//android.widget.ScrollView';
    stationConnectorDetails = '//android.view.View[@content-desc="%s"]';
    stationConnectorImage = '/android.widget.ImageView[2]';
    chargeNowButton = '//android.view.View[@content-desc="Charge Now"]';

    stationName = '//android.widget.ImageView[@content-desc="%s"]';

    amountInput = '//android.widget.EditText';
    unitsTab = '//android.widget.ImageView[@content-desc="Units\nTab 2 of 3"]';

    unitsInput = '//android.widget.EditText';

    continueButton = '//android.view.View[@content-desc="Continue"]';

    startChargingButton = '//android.view.View[@content-desc="Start charging"]';

    plugGunErrorMessage = '//android.view.View[@content-desc="Plug the gun properly and try again"]';

    skipButton = '//android.view.View[@content-desc="Skip"]';

    // Home and Direct EV Station Search

    homeButton = '//android.view.View[@content-desc="Home"]';

    searchByLocationButton = '//android.widget.ImageView[@content-desc="Search by location"]';

    // Search input – update once the actual input XPath is confirmed
    searchLocationInput = '//android.widget.EditText';

    // Dynamic station search result
    // stationSearchResult = '//android.view.View[@content-desc="%s"]';

    stationSearchResult = '//android.widget.ImageView[contains(@content-desc, "%s")]';

    transactionStateDropdown =
        '//android.widget.Button[@resource-id="txnStateDropdownToggle"]';

    statusCapturedSuccessfully =
        '//*[contains(@text,"Status captured successfully") or contains(@content-desc,"Status captured successfully")]';

    transactionStateOption =
        (status) => `//*[@text="${status}" or @content-desc="${status}"]`;

    transactionStateValue =
        (status) => `//*[@text="${status}"]`;

    otpField = '//android.widget.EditText';

    profileTab = '~Profile';

    myProfileTitle = '~My Profile';

    myEVsMenu = '~My EVs';

    myEVsPageTitle = '//android.view.View[@content-desc="My EVs"]';

    myEVCardLabels = '//*[contains(@content-desc, "My EV") or @text="My EV"]';

    addVehiclePrompt = '//*[contains(@text, "Add your vehicle\'s make and model to continue") or contains(@content-desc, "Add your vehicle\'s make and model to continue")]';

    profilePhone = 'android=new UiSelector().descriptionContains("%s")';

    accountTitle = '~Account';

    accountField = 'android=new UiSelector().descriptionContains("%s")';

    accountEmailField = '//*[contains(translate(@content-desc, "EMAIL", "email"), "email") or contains(translate(@text, "EMAIL", "email"), "email")]';

    accountFieldEdit = '//*[(contains(@content-desc, "%s") or @text="%s")]/android.widget.ImageView';

    accountTextInput = '//android.widget.EditText';

    accountSaveButton = '~Save';

    profileUpdatedMessage = '~Profile updated successfully';

    birthDateInput = 'android=new UiSelector().textMatches("[0-9]{4}-[0-9]{2}-[0-9]{2}")';

    datePickerDay = 'android=new UiSelector().descriptionStartsWith("%s, ")';

    datePickerOkButton = '~OK';

    genderOption = '~%s';

    accountSettingsButton =
        '//android.view.View[@content-desc="Account Settings"]';

    deleteAccountOption =
        '//android.view.View[contains(@content-desc,"Delete Account")]';

    accountBackButton =
        '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView';

    profileDisplayName =
        '//android.widget.Button[contains(@content-desc,"%s")]';

    logoutButton = 'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().descriptionMatches("(?i).*(logout|log out|sign out).*"))';

    logoutConfirmation =
        '//*[contains(translate(@text, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "want to logout") or contains(translate(@text, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "want to log out") or contains(translate(@text, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "want to sign out") or contains(translate(@content-desc, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "want to logout") or contains(translate(@content-desc, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "want to log out") or contains(translate(@content-desc, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "want to sign out")]';

    logoutConfirmButton =
        '//*[@text="Yes" or @content-desc="Yes" or @text="Confirm" or @content-desc="Confirm" or @text="Log out" or @content-desc="Log out" or @text="Logout" or @content-desc="Logout" or @text="Sign out" or @content-desc="Sign out"]';

    vehicleSearchInput = '//android.widget.EditText';

    vehicleSearchResult = '//android.view.View[@content-desc="Audi\nMG Windsor EV Pro\n "]';

    registrationScreenHeading =
        '//*[contains(@text, "Select battery capacity for your EV") or contains(@content-desc, "Select battery capacity for your EV")]';

    batteryCapacity =
        '//*[contains(@text, "30 kWh") or contains(@content-desc, "30 kWh")]';

    registrationNumberLabel =
        '//*[contains(@text, "Enter your registration number") or contains(@content-desc, "Enter your registration number")]';

    registrationNumberInput = '//android.widget.EditText';

    evAddedSuccessfullyMessage =
        '//*[contains(@text, "EV added successfully") or contains(@content-desc, "EV added successfully")]';

    registrationNumberPopup =
        '//*[contains(@text, "Enter your registration number to save your vehicle") or contains(@content-desc, "Enter your registration number to save your vehicle")]';

    registrationNumberInput = '//android.widget.EditText';

    setAsPrimary = '//android.widget.ImageView[@content-desc="Set as primary"]';

    primaryCar = '//android.widget.ImageView[@content-desc="Primary car"]';

    vehicleScrollView = '//android.widget.ScrollView';

    addedVehicleName =
        '//android.view.View[@content-desc="MG Windsor EV Pro"]';

    logoutImage =
        '//android.widget.ImageView[@content-desc="Logout"]';

    editEVDetailsButton =
        '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.widget.ImageView[5]';

    carNameEditIcon =
        '//android.view.View[@content-desc="Car name"]/android.widget.ImageView';

    carNameInput =
        '//android.widget.EditText[@text="My EV"]';

    saveEVDetailsButton =
        '//android.view.View[@content-desc="Save Details"]';

    evUpdatedSuccessfullyPopup =
        '//android.view.View[@content-desc="EV updated successfully"]';

    vehicleName =
        '//android.view.View[@content-desc="My EV"]';

    updateEVDetailsOption =
        '//android.view.View[@content-desc="Update your EV details"]';

    removeThisCarOption =
        '//android.view.View[@content-desc="Remove this car?"]';

    deleteEVIcon =
        '//android.widget.ImageView[@content-desc="Delete"]';

    confirmDeleteButton =
        '//android.view.View[@content-desc="Delete"]';

    evDeletedSuccessfullyPopup =
        '//android.view.View[@content-desc="EV deleted successfully"]';

    accountEditButton = '//android.widget.TextView[@text="Account"]/following-sibling::*[1]';
    accountInput = '//android.widget.EditText';


}