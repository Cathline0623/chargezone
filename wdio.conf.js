import path from "path";

if (!process.env.REPORT_TIMESTAMP) {
  const timestamp = new Date();

  const shortDate = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${timestamp.getDate().toString().padStart(2, "0")}`;

  const shortTime = `${timestamp
    .getHours()
    .toString()
    .padStart(2, "0")}-${timestamp.getMinutes().toString().padStart(2, "0")}`;

  process.env.REPORT_TIMESTAMP = `${shortDate}_${shortTime}`;
}

const HTMLResultsDir = path.join(
  "reports",
  "html-results",
  `Test_Report-${process.env.REPORT_TIMESTAMP}`
);

console.log(HTMLResultsDir);

const allureResultsDir = path.join("reports", "allure-results");

// ---------- App definitions ----------
// Select with env var APP_TARGET (default: chargezone)
const APPS = {
  chargezone: {
    "appium:appPackage": "com.dev.chargezone",
    "appium:appActivity": "com.example.chargezone.MainActivity",
  },
  healync: {
    "appium:appPackage": "com.healync.healync_mobile",
    "appium:appActivity": "com.healync.healync_mobile.MainActivity",
  },
};

const target = process.env.APP_TARGET || "chargezone";
if (!APPS[target]) {
  throw new Error(
    `Unknown APP_TARGET "${target}". Use one of: ${Object.keys(APPS).join(", ")}`
  );
}
console.log(`APP_TARGET = ${target}`);

// Android Emulator Capabilities
const mobileCapabilities = {
  platformName: "Android",
  "appium:deviceName": "Android Emulator",
  "appium:udid": "emulator-5554",
  "appium:platformVersion": process.env.ANDROID_VERSION || "14",
  "appium:automationName": "UiAutomator2",

  ...APPS[target],

  "appium:autoGrantPermissions": true,
  "appium:newCommandTimeout": 300,

  // Extra headroom for slower CI emulators
  "appium:adbExecTimeout": 120000,
  "appium:uiautomator2ServerInstallTimeout": 120000,
  "appium:uiautomator2ServerLaunchTimeout": 120000,
  "appium:appWaitDuration": 60000,
};

export const config = {
  runner: "local",
  port: 4723,

  // Native Android tests don't need a virtual display.
  // xvfb-run wrapping breaks worker IPC (Error: write EINVAL).
  autoXvfb: false,

  specs: ["./test/specs/**/*.js"],
  exclude: [],

  maxInstances: 1,
  capabilities: [mobileCapabilities],

  logLevel: "info",
  bail: 0,
  waitforTimeout: 20000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 2,

  services: ["appium", "visual"],

  framework: "mocha",

  reporters: [
    [
      "allure",
      {
        outputDir: allureResultsDir,
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
    [
      "html-nice",
      {
        outputDir: HTMLResultsDir,
        filename: "Test-report.html",
        reportTitle: "Test Report",
        linkScreenshots: true,
        showInBrowser: false, // no browser on CI
        collapseTests: false,
        useOnAfterCommandForScreenshot: false,
      },
    ],
  ],

  mochaOpts: {
    ui: "bdd",
    timeout: 300000,
  },

  afterTest: async function (
    test,
    context,
    { error, result, duration, passed, retries }
  ) {
    if (!passed) {
      await browser.takeScreenshot();
    }
  },
};


































// import path from "path";

// if (!process.env.REPORT_TIMESTAMP) {
//   const timestamp = new Date();

//   const shortDate = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1)
//     .toString()
//     .padStart(2, "0")}-${timestamp.getDate().toString().padStart(2, "0")}`;

//   const shortTime = `${timestamp
//     .getHours()
//     .toString()
//     .padStart(2, "0")}-${timestamp.getMinutes().toString().padStart(2, "0")}`;

//   process.env.REPORT_TIMESTAMP = `${shortDate}_${shortTime}`;
// }

// const HTMLResultsDir = path.join(
//   "reports",
//   "html-results",
//   `Test_Report-${process.env.REPORT_TIMESTAMP}`
// );

// console.log(HTMLResultsDir);

// const allureResultsDir = path.join("reports", "allure-results");

// // Android Emulator Capabilities
// const mobileCapabilities = {
//   platformName: "Android",
//   "appium:deviceName": "Android Emulator",
//   "appium:udid": "emulator-5554",
//   "appium:platformVersion": process.env.ANDROID_VERSION || "14",
//   "appium:automationName": "UiAutomator2",

//   "appium:appPackage": "com.dev.chargezone",
//   "appium:appActivity": "com.example.chargezone.MainActivity",

//   "appium:autoGrantPermissions": true,
//   "appium:newCommandTimeout": 300,

//   // Extra headroom for slower CI emulators
//   "appium:adbExecTimeout": 120000,
//   "appium:uiautomator2ServerInstallTimeout": 120000,
//   "appium:uiautomator2ServerLaunchTimeout": 120000,
//   "appium:appWaitDuration": 60000,
// };

// export const config = {
//   runner: "local",
//   port: 4723,

//   // Native Android tests don't need a virtual display.
//   // xvfb-run wrapping breaks worker IPC (Error: write EINVAL).
//   autoXvfb: false,

//   specs: ["./test/specs/**/*.js"],
//   exclude: [],

//   maxInstances: 1,
//   capabilities: [mobileCapabilities],

//   logLevel: "info",
//   bail: 0,
//   waitforTimeout: 20000,
//   connectionRetryTimeout: 180000,
//   connectionRetryCount: 2,

//   services: ["appium", "visual"],

//   framework: "mocha",

//   reporters: [
//     [
//       "allure",
//       {
//         outputDir: allureResultsDir,
//         disableWebdriverStepsReporting: true,
//         disableWebdriverScreenshotsReporting: false,
//       },
//     ],
//     [
//       "html-nice",
//       {
//         outputDir: HTMLResultsDir,
//         filename: "Test-report.html",
//         reportTitle: "Test Report",
//         linkScreenshots: true,
//         showInBrowser: false, // no browser on CI
//         collapseTests: false,
//         useOnAfterCommandForScreenshot: false,
//       },
//     ],
//   ],

//   mochaOpts: {
//     ui: "bdd",
//     timeout: 300000,
//   },

//   afterTest: async function (
//     test,
//     context,
//     { error, result, duration, passed, retries }
//   ) {
//     if (!passed) {
//       await browser.takeScreenshot();
//     }
//   },
// };