import puppeteer from 'puppeteer';
import { worldCatConfig as config} from './config.js';
import { PuppeteerBlocker } from '@ghostery/adblocker-puppeteer';
import fetch from 'cross-fetch';



const browser = await puppeteer.launch({
  headless: false,
});
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
    await goToEmailPage();
    await waitForCookieModalToClose();
    
    //await enterEmail();
    //await login();
  } 
  catch(error){
    console.error("There was an error during login: " + error.message);
  } 
  finally {
    await page.close();
    await browser.close();
  }
}



async function goToEmailPage(){
   await page.goto(config.loginPage);
   page.setCacheEnabled(false); // disable cache to avoid stale data
}



async function enterEmail(){
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



async function waitForCookieModalToClose(){
  // wait for modal to appear on screen
  // let modal = await page.waitForSelector('div.onetrust-pc-dark-filter', {timeout: 10000, visible: true});
  // if (!modal) throw new Error("Cookie modal not found");
  // console.log("Cookie modal found: " + modal);

  // wait for the reject cookies button to appear, then click it
  let selector = "#onetrust-reject-all-handler";
  let buttonReady = await page.waitForFunction(
    selector => !!document.querySelector(selector),
    {},
    selector,
  );
  if (!buttonReady) throw new Error("Reject cookies button not found");
  console.log("Cookies button found: " + selector);

  if(buttonReady) await page.locator(selector).click();
  await page.waitForNavigation();
  console.log("Cookie modal should be closed now, proceeding to login...");
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