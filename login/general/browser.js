import puppeteer from 'puppeteer';
import { browserOptions } from "../config.js";

const browser = await puppeteer.launch(browserOptions);
const page = await browser.newPage()
  page.setDefaultNavigationTimeout(60000); // 10 seconds
  page.setCacheEnabled(false);

export {browser, page};