import { $, browser } from "@wdio/globals";
import { keywords } from "../keyword.js";

const key = new keywords();




class PayyapEndToEndPage {

    // ================= LOCATORS =================

    get menuButton() {
        return $('//android.widget.ImageButton[@content-desc="Open navigation drawer"]');
    }

    get backButton() {
        return $('//android.widget.FrameLayout[@resource-id="ch.payyap.smartpos:id/nav_view"]/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout[1]');
    }

    get transactionLabel() {
        return $('//android.widget.RelativeLayout[@resource-id="ch.payyap.smartpos:id/transaction_label_row"]');
    }

    get addProductButton() {
        return $('//android.widget.TextView[@text="Add Product"]');
    }

    get branchManagement() {
        return $('//androidx.recyclerview.widget.RecyclerView[@resource-id="ch.payyap.smartpos:id/lst_menu_items"]/android.view.ViewGroup[2]');
    }

    get dashboardMenu() {
        return $('//androidx.recyclerview.widget.RecyclerView[@resource-id="ch.payyap.smartpos:id/lst_menu_items"]/android.view.ViewGroup[1]');
    }

    get sellMenu() {
        return $('//android.widget.TextView[@resource-id="ch.payyap.smartpos:id/item_side_menu_title" and @text="Sell"]');
    }

    get searchField() {
        return $('//android.widget.EditText[@resource-id="ch.payyap.smartpos:id/input_edit_text_qr"]');
    }

    get cartButton() {
        return $('//android.widget.TextView[@text="Cart"]');
    }

    get payButton() {
        return $('//android.widget.TextView[@text="Pay"]');
    }

    get cashOption() {
        return $('//android.widget.TextView[@text="Cash"]');
    }

    get noReceipt() {
        return $('//android.widget.TextView[@text="No Receipt"]');
    }

    get assignAllButton() {
        return $('//android.widget.Button[@resource-id="ch.payyap.smartpos:id/btnAssignAll"]');
    }

    get transactionItems() {
        return $('//android.widget.TextView[@resource-id="ch.payyap.smartpos:id/transaction_items"]');
    }

    get closeButton() {
        return $('//android.widget.ImageView[@resource-id="ch.payyap.smartpos:id/button_close"]');
    }
    get branchname() {
        return $('(//android.widget.LinearLayout[@resource-id="ch.payyap.smartpos:id/llRoot"])[1]');
    }
    get orderID() {
        return $('//android.widget.TextView[@resource-id="ch.payyap.smartpos:id/sales_order_number"]');
    }

    // ================= COMMON METHOD =================

    async waitAndClick(element) {
        await element.waitForDisplayed({ timeout: 10000 });
        await element.click();
    }

    // // ================= BUSINESS METHODS =================

    async waitForHomeScreen() {
        await this.transactionLabel.waitForDisplayed({ timeout: 10000 });
    }

    async openMenu() {
        await key.waitForDisplayed(this.menuButton, 10000, "Wait for Menu Button");
        await key.click(this.menuButton, "Click Menu Button");
        await key.waitForDisplayed(this.backButton, 10000, "Wait for Back Button");
        await key.click(this.backButton, "Click Back Button");
    }
    async addproduct() {
        await this.addProductButton.waitForDisplayed({ timeout: 10000 });
    }


    async goToBranchManagement() {
        await this.backButton.waitForDisplayed({ timeout: 10000 });
        await key.click(this.backButton, "Click Back Button - Navigate to Home");

        await key.waitForDisplayed(this.transactionLabel, 10000, "Wait for Transaction Label");
        await key.waitForDisplayed(this.menuButton, 10000, "Wait for Menu Button");
        await key.click(this.menuButton, "Click Menu Button");

        await this.branchname.waitForDisplayed({ timeout: 10000 });
        await key.click(this.branchname, "Click Branch Management");

        await key.waitForDisplayed(this.transactionLabel, 10000, "Wait for Transaction Label");
        await key.waitForDisplayed(this.menuButton, 10000, "Wait for Menu Button");
        await key.click(this.menuButton, "Click Menu Button");
    }

    async assignAllProducts() {
        await key.waitForDisplayed(this.branchManagement, 10000, "Wait for Branch Management");
        await key.click(this.branchManagement, "Click Branch Management");
        await key.waitForDisplayed(this.assignAllButton, 10000, "Wait for Assign All Button");
        await key.click(this.assignAllButton, "Click Assign All Products Button");
    }

    async goToSell() {
        await key.waitForDisplayed(this.menuButton, 10000, "Wait for Menu Button");
        await key.click(this.menuButton, "Click Menu Button");

        await key.waitForDisplayed(this.sellMenu, 10000, "Sell screen opened");
        await key.click(this.sellMenu, "Click Sell Menu");


        await key.waitForDisplayed(this.searchField, 10000, "Click Search Field in Sell Screen");
        await key.click(this.searchField, "Click Search Field in Sell Screen");

    }

    async searchAndSelectProduct(productName) {
        await key.waitForDisplayed(this.searchField, 10000, "Click Search Field in Sell Screen");

        await key.setValue(this.searchField, productName, `Search Product: ${productName}`);
           await browser.pause(2000); 
            const product = await $(`//android.widget.TextView[@text="${productName}"]`);
    await key.waitForDisplayed(product, 10000, "Product displayed in search results");
    await key.click(product, `Select Product: ${productName}`);

    }

    async completePayment() {
        await key.waitForDisplayed(this.cartButton, 10000, "Wait for Cart Button");
        await key.click(this.cartButton, "Click Cart Button");

        await key.waitForDisplayed(this.payButton, 10000, "Wait for Pay Button");
        await key.click(this.payButton, "Click Pay Button");

        await key.waitForDisplayed(this.cashOption, 10000, "Wait for Cash Option");
        await key.click(this.cashOption, "Select Cash Payment Option");

        await key.waitForDisplayed(this.noReceipt, 10000, "Wait for No Receipt Option");
        await key.click(this.noReceipt, "Select No Receipt Option");
    }

    async goToDashboard() {
        await key.waitForDisplayed(this.menuButton, 10000, "Wait for Menu Button");
        await key.click(this.menuButton, "Click Menu Button");

        await key.waitForDisplayed(this.dashboardMenu, 10000, "Wait for Dashboard Menu");
        await key.click(this.dashboardMenu, "Click Dashboard Menu");
    }

    async getSoldProductName() {
        await key.waitForDisplayed(this.orderID, 10000, "Wait for Order ID");
        await key.click(this.orderID, "Click Order ID");

        await key.waitForDisplayed(this.transactionItems, 10000, "Wait for Transaction Items");
        const productName = await key.getText(this.transactionItems, "Get Sold Product Name");
        return productName;

    }

    async closeOrderPopup() {
        await key.waitForDisplayed(this.closeButton, 10000, "Wait for Close Button");
        await key.click(this.closeButton, "Click Close Button");
    }
}

export default new PayyapEndToEndPage();
