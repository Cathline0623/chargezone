
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
  reporters: ['spec'],
  mochaOpts: { timeout: 180000 },

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
};
