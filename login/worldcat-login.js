import puppeteer from 'puppeteer';
import { worldCatConfig as config} from './config.js';
import { PuppeteerBlocker } from '@ghostery/adblocker-puppeteer';
import fetch from 'cross-fetch';



const browser = await puppeteer.launch({headless: false});
const page = (await browser.pages())[0] // use current tab
page.setDefaultNavigationTimeout(60000); // 1 minute



// setup adblock with Ghostery
PuppeteerBlocker
  .fromPrebuiltAdsAndTracking(fetch)
  .then((blocker) => {
    blocker.enableBlockingInPage(page);
  })



export default async function initWorldCat(){
  try {
    await enterEmail();
    await login();
  } 
  catch(error){
    console.error("There was an error during login: " + error.message);
  } 
  finally {
    await page.close();
    await browser.close();
  }
}



async function enterEmail(){
  await page.goto(config.loginPage);
  await page.locator('input[type="text"]').fill(config.username);
  await page.locator('button[type="Submit"]').click();
  await page.waitForNavigation();
}



async function login(){
  await page.locator('input[type="text"]').fill(config.username);
  await page.locator('input[type="password"]').fill(config.password);
  await page.locator('button[type="Submit"]').click();
  await page.waitForNavigation();
}


// on email input page
// select input type="text" and fill with worldcat username
// select button type=submit and click 
// (this takes us to the actual login page)


// on login page
// select input type="text" again and fill with worldcat username
// select input type="password" and fill with password
// select button type=submit and click 
// *may need to retry after 403 from WorldCat?


// on main search page
// select input id="home-page-search-box" and fill with ISBN
// select button type=submit and click 


// on search results page
// select first h2 > a and click


// on book page
// select button with text "All libraries"
// select li with data-value="50" and click
// wait
//  if div with data-testid="holdings-error-notification-message"
//    restart process
// 

// list of library names narrowed down to their text:
// this works in the console to single them into one HTML node list
// example for console: 
// let names = document.querySelectorAll('ul[data-testid="holding-list-details"] li strong')
// let lst = Array.from(names).map((name) => {
//   return name.innerText
// })


// create that list of libraries in an array to search in the AGExternal json list