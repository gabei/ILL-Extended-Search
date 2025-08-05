import puppeteer from 'puppeteer';
import { browserOptions } from "../config.js";
import userAgentList from '../userAgents.json' with { type: 'json' };


const browser = await puppeteer.launch(browserOptions);


let page = await browser.newPage()
  page.setDefaultNavigationTimeout(120000); // 2 minutes
  page.setCacheEnabled(false);
  page.setUserAgent(await getRandomUserAgent());


async function getRandomUserAgent(){
  const randomIndex = Math.floor(Math.random() * userAgentList.length);
  return userAgentList[randomIndex].ua;
}


export {browser, page};