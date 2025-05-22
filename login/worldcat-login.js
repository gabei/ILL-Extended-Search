import puppeteer from 'puppeteer';
import { worldCatConfig as config} from './config.js';


const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();
page.setDefaultNavigationTimeout(10000); // 10 seconds





// list of library names narrowed down to their text:
// let names = document.querySelectorAll('ul[data-testid="holding-list-details"] li strong')
// Array.from(names)
// this works in the console to single them into one HTML node list