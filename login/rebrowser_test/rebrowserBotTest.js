import puppeteer, { executablePath } from 'puppeteer';
import { browserOptions } from '../config';


const botDetectorUrl = "https://bot-detector.rebrowser.net/";


import userAgentList from '../userAgents.json' with { type: 'json' };
async function getRandomUserAgent(){
  const randomIndex = Math.floor(Math.random() * userAgentList.length);
  return userAgentList[randomIndex].ua;
}
 


export default async function initRebrowserBotTest() {
  console.log("Initializing Rebrowser Bot Test...");
  const browser = await puppeteer.launch(browserOptions);
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








