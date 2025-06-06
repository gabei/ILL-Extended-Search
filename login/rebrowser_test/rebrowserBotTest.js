import puppeteer, { executablePath } from 'puppeteer';

const botDetectorUrl = "https://bot-detector.rebrowser.net/";
const botOptions = {
  defaultViewport: null,
  headless: false,
  args: [
    '--incognito',
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-blink-features=AutomationControlled',
  ],
}


import userAgentList from '../userAgents.json' with { type: 'json' };
async function getRandomUserAgent(){
  const randomIndex = Math.floor(Math.random() * userAgentList.length);
  return userAgentList[randomIndex].ua;
}
 


export default async function initRebrowserBotTest() {
  console.log("Initializing Rebrowser Bot Test...");
  const browser = await puppeteer.launch(botOptions);
  const page = (await browser.pages())[0];
  page.setCacheEnabled(false);
  page.setUserAgent(await getRandomUserAgent());
  page.setDefaultNavigationTimeout(120000); // 2 minutes


  



  try {
    await page.goto(botDetectorUrl);
    await page.waitForNavigation();
  } catch (error) {
    console.error("Error during login: ", error);
  } finally {
    await page.close();
    await browser.close();
  }
}








