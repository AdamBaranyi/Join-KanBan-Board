import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));

  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5180/');
  await new Promise(r => setTimeout(r, 2000));
  
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Guest Log In')) {
      await btn.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 2000));
  
  console.log("Navigating to Board...");
  await page.goto('http://localhost:5180/board');
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
