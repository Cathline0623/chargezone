require('dotenv').config();
const fs = require('fs');

const auth = 'Basic ' + Buffer
  .from(`${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}`)
  .toString('base64');

const src = process.argv[2]
  || 'https://www.browserstack.com/app-automate/sample-apps/ios/BStackSampleApp.ipa';

(async () => {
  const form = new FormData();
  if (src.startsWith('http')) {
    form.append('url', src);
  } else {
    form.append('file', new Blob([fs.readFileSync(src)]), 'app.ipa');
  }
  form.append('custom_id', 'HealyncApp');  
  const res = await fetch('https://api-cloud.browserstack.com/app-automate/upload', {
    method: 'POST',
    headers: { Authorization: auth },
    body: form,
  });
  const data = await res.json();
  console.log(data);
  if (data.app_url) console.log(`\nBS_APP_URL=${data.app_url}  <- Add this to your .env file`);
})();