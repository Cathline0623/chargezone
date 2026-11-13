import LoginPage from "../../locator/LoginPage.js";
import productandsellPage from "../../locator/productandsellPage.js";
import readExcel from "../../utils/excelReader.js";
import xlsx from "xlsx";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { EndToEnd } from "../../datasheet/EndToEnd.js";
import { keywords } from "../../keyword.js";
import PayyapPage from "../../locator/PayyapEndToEndPage.js";




const key = new keywords();

describe("End-to-End Product Workflow", () => {
  it("Login, create product, sell and verify inventory", async () => {
    // Login

    // Try reading credentials from Excel; fall back to loginData from datasheet
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // The Testdata.xlsx lives at the repository root `Files/Testdata.xlsx`.
    // `__dirname` is `.../test/specs`, so go up two levels to reach the repo root.
    const excelPath = path.join(
      __dirname,
      "..",
      "..",
      "Files",
      "Testdata.xlsx"
    );

    if (!fs.existsSync(excelPath)) {
      console.warn(
        `[WARN] Excel file not found at ${excelPath}. Falling back to datasheet/login.js`
      );
    } else {
      console.log(`[INFO] Found Excel file at ${excelPath}`);
    }

    let excelEmail = undefined;
    let excelPassword = undefined;
    try {
      // Primary approach: read rows as objects (header -> value) using existing util
      const rows = readExcel(excelPath, "Sheet1");
      if (Array.isArray(rows) && rows.length > 0) {
        // rows[0] is the first data row; find keys case-insensitively
        const firstRow = rows[0] || {};
        const normalized = Object.fromEntries(
          Object.entries(firstRow).map(([k, v]) => [
            String(k).trim().toLowerCase(),
            v,
          ])
        );
        excelEmail = normalized.email
          ? String(normalized.email).trim()
          : undefined;
        excelPassword = normalized.password
          ? String(normalized.password).trim()
          : undefined;
      }

      // Fallback approach: if above didn't find values, try matrix mode (header row + value row)
      if (!excelEmail || !excelPassword) {
        try {
          const wb = xlsx.readFile(excelPath);
          const sheetName = "Sheet1";
          const sheet = wb.Sheets[sheetName] || wb.Sheets[wb.SheetNames[0]];
          if (sheet) {
            const matrix = xlsx.utils.sheet_to_json(sheet, {
              header: 1,
              defval: "",
            });
            if (Array.isArray(matrix) && matrix.length >= 2) {
              const headers = matrix[0].map((h) =>
                String(h).trim().toLowerCase()
              );
              const valuesRow = matrix[1];
              const mapping = {};
              for (let i = 0; i < headers.length; i++) {
                const hk = headers[i] || "";
                mapping[hk] =
                  valuesRow[i] !== undefined ? String(valuesRow[i]).trim() : "";
              }
              console.log("[DEBUG] matrix headers detected:", headers);
              if (!excelEmail)
                excelEmail =
                  mapping.email ||
                  mapping.user ||
                  mapping.username ||
                  undefined;
              if (!excelPassword)
                excelPassword = mapping.password || mapping.pass || undefined;
            }
          }
        } catch (matrixErr) {
          // ignore matrix fallback errors but log for debugging
          console.warn(
            "Excel matrix fallback failed:",
            matrixErr.message || matrixErr
          );
        }
      }

      // Final fallback: scan every cell for labels like 'email'/'password' and take the cell to the right
      if (!excelEmail || !excelPassword) {
        try {
          const wb2 = xlsx.readFile(excelPath);
          const sheet2 = wb2.Sheets["Sheet1"] || wb2.Sheets[wb2.SheetNames[0]];
          if (sheet2) {
            const matrixAll = xlsx.utils.sheet_to_json(sheet2, {
              header: 1,
              defval: "",
            });
            for (let r = 0; r < matrixAll.length; r++) {
              const row = matrixAll[r] || [];
              for (let c = 0; c < row.length; c++) {
                const cell = String(row[c] || "")
                  .trim()
                  .toLowerCase();
                if (!excelEmail && cell === "email") {
                  excelEmail = String(row[c + 1] || "").trim() || undefined;
                }
                if (!excelPassword && cell === "password") {
                  excelPassword = String(row[c + 1] || "").trim() || undefined;
                }
                if (excelEmail && excelPassword) break;
              }
              if (excelEmail && excelPassword) break;
            }
          }
        } catch (scanErr) {
          console.warn(
            "Excel scan fallback failed:",
            scanErr.message || scanErr
          );
        }
      }

      if (
        (!excelEmail || !excelPassword) &&
        (!Array.isArray(rows) || rows.length === 0)
      ) {
        console.warn(
          `[WARN] Excel sheet '${excelPath}' returned no usable credentials`
        );
      }
    } catch (e) {
      console.warn("Could not read Excel credentials:", e.message || e);
    }

    const usernameToUse = excelEmail;
    const passwordToUse = excelPassword;

    // Debug: log credential types/lengths (masked) to help diagnose bad values
    try {
      const mask = (s) =>
        typeof s === "string" ? `${s.slice(0, 3)}...(${s.length})` : String(s);
      console.log(
        `[DEBUG] username type:${typeof usernameToUse} value:${mask(
          usernameToUse
        )}`
      );
      console.log(
        `[DEBUG] password type:${typeof passwordToUse} value:${mask(
          passwordToUse
        )}`
      );
      // Additional debug: show raw first-row and normalized keys when available
      try {
        const rows = readExcel(excelPath, "Sheet1");
        console.log(
          `[DEBUG] excel rows count: ${Array.isArray(rows) ? rows.length : "N/A"
          }`
        );
        if (Array.isArray(rows) && rows.length > 0) {
          console.log(`[DEBUG] raw firstRow: ${JSON.stringify(rows[0])}`);
          const normalized = Object.fromEntries(
            Object.entries(rows[0]).map(([k, v]) => [
              String(k).toLowerCase(),
              v,
            ])
          );
          console.log(`[DEBUG] normalized keys: ${JSON.stringify(normalized)}`);
        }
      } catch (e) {
        console.warn("Failed to re-read Excel for debug:", e.message || e);
      }
    } catch (e) {
      console.warn("Failed to log credential debug info:", e.message || e);
    }

    await LoginPage.login(
      usernameToUse,
      passwordToUse,
      EndToEnd.Sign_in_Button_Color
    );

    await PayyapPage.waitForHomeScreen();

    await PayyapPage.openMenu();
    await productandsellPage.createProduct(EndToEnd);
    await PayyapPage.addproduct();
    await key.click(PayyapPage.menuButton, "Click Menu Button");

    //     // ====== BRANCH MANAGEMENT ======
    await PayyapPage.goToBranchManagement();
    await PayyapPage.assignAllProducts();
    //     // ====== SELL PRODUCT ======
    await PayyapPage.goToSell();
    await PayyapPage.searchAndSelectProduct(EndToEnd.productName);

    await PayyapPage.completePayment();

    //     // ====== VERIFY ======
    await PayyapPage.goToDashboard();

    const actualProduct = await PayyapPage.getSoldProductName();
    await expect(actualProduct).toBe(EndToEnd.productName);

    

    await PayyapPage.closeOrderPopup();










  });
});
