import puppeteer from 'puppeteer';
import { worldCatConfig as config} from './config.js';


const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();
page.setDefaultNavigationTimeout(10000); // 10 seconds