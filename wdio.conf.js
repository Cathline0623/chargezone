
// require('dotenv').config();
// const devices = require('./config/devices');

// exports.config = {
//   user: process.env.BROWSERSTACK_USERNAME,
//   key: process.env.BROWSERSTACK_ACCESS_KEY,

//   specs: ['./test/specs/**/*.js'],
//   maxInstances: 5,
//   logLevel: 'info',

//   framework: 'mocha',
//   reporters: ['spec'],
//   mochaOpts: { timeout: 180000 },

//   services: [
//     ['browserstack', {
//       app: process.env.BS_APP_URL,
//       buildIdentifier: '#${BUILD_NUMBER}',
//     }],
//   ],

//   capabilities: devices.map((d) => ({
//     platformName: 'iOS',
//     'appium:deviceName': d.name,
//     'appium:platformVersion': d.os,
//     'appium:automationName': 'XCUITest',
//     'appium:autoAcceptAlerts': true,

//     'bstack:options': {
//       projectName: 'Healync iOS',
//       buildName: process.env.BUILD_NAME || 'local-run',
//       sessionName: `Healync iOS - ${d.name}`,
//     },
//   })),
// };








require('dotenv').config();
const allure = require('@wdio/allure-reporter').default;
const devices = require('./config/devices');

exports.config = {
  autoXvfb: false,

  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  hostname: 'hub.browserstack.com',
  port: 443,
  protocol: 'https',
  path: '/wd/hub',

  specs: ['./test/specs/**/*.js'],
  maxInstances: 2,
  logLevel: 'info',

  framework: 'mocha',
  mochaOpts: { timeout: 180000 },

  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,      
      disableWebdriverScreenshotsReporting: true,
    }],
  ],

  services: [
    ['browserstack', {
      app: process.env.BS_APP_URL,
      buildIdentifier: '#${BUILD_NUMBER}',
      testObservability: false,
      browserstackLocal: false,
    }],
  ],

  capabilities: devices.map((d) => ({
    platformName: 'iOS',
    'appium:deviceName': d.name,
    'appium:platformVersion': d.os,
    'appium:automationName': 'XCUITest',
    'appium:autoAcceptAlerts': true,
    'bstack:options': {
      projectName: 'Healync iOS',
      buildName: process.env.BUILD_NAME || 'local-run',
      sessionName: `Healync iOS - ${d.name}`,
    },
  })),

  
  afterTest: async function (test, context, { error }) {
    allure.addArgument('Device', browser.capabilities['appium:deviceName'] || 'iOS');
    allure.addArgument('BrowserStack Session', browser.sessionId);
    if (error) {
      const png = await browser.takeScreenshot();
      allure.addAttachment('Failure screenshot', Buffer.from(png, 'base64'), 'image/png');
    }
  },
};