import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to a wide screen
  await page.setViewport({ width: 1440, height: 900 });

  // Ensure screenshots dir exists
  if (!fs.existsSync('public/screenshots')) {
    fs.mkdirSync('public/screenshots');
  }

  // 1. Login Page
  await page.goto('http://localhost:5180/');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'public/screenshots/login.png' });

  // 2. Click "Guest Log in"
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Guest Log In')) {
      await btn.click();
      break;
    }
  }

  // Wait for Summary page to load
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'public/screenshots/summary.png' });

  // 3. Go to Board
  await page.goto('http://localhost:5180/board');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'public/screenshots/board.png' });

  // 4. Go to Add Task
  await page.goto('http://localhost:5180/add-task');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'public/screenshots/add-task.png' });

  // 5. Go to Contacts
  await page.goto('http://localhost:5180/contacts');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'public/screenshots/contacts.png' });

  // Now let's test a mobile view (320px)
  await page.setViewport({ width: 320, height: 800 });
  await page.goto('http://localhost:5180/board');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'public/screenshots/board-mobile.png' });

  await browser.close();
  console.log("Screenshots captured!");
})();
