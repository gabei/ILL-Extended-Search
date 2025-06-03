import puppeteer from 'puppeteer';
import { worldCatConfig as config} from './config.js';
import { PuppeteerBlocker } from '@ghostery/adblocker-puppeteer';
import fetch from 'cross-fetch';



const browser = await puppeteer.launch({
  args: [
    '--incognito',
  ],
  headless: false,
});
const page = (await browser.pages())[0] // use current tab
page.setDefaultNavigationTimeout(10000); // 30 seconds
page.setCacheEnabled(false);



// setup adblock with Ghostery
PuppeteerBlocker
  .fromPrebuiltAdsAndTracking(fetch)
  .then((blocker) => {
    blocker.enableBlockingInPage(page);
  })



export default async function initWorldCat(){
  try {
    await goToSearchPage();
    await waitForCookieModalToClose();
    await enterIsbnAndSearch("9780063411272");
    await page.waitForNavigation();
  } 
  catch(error){
    console.error("There was an error during login: " + error.message);
  } 
  finally {
    await page.close();
    await browser.close();
  }
}



async function goToSearchPage(){
   await page.goto(config.searchPage);
}



async function enterIsbnAndSearch(isbn){
  try {
    await page.locator('input[type="text"]').fill(isbn);
    await page.locator('button[type="Submit"]').click();
    await page.waitForNavigation();
  } catch (error) {
    console.error("Error during ISBN search: " + error.message);
    throw new Error("Error during ISBN search: " + error.message);; // rethrow to handle it in the main function
  }
}



async function expandLibraryHoldingsList(){
  let errorMessageDiv = page.locator('div[data-testid="holdings-error-notification-message"]');
}



async function waitForCookieModalToClose(){
  // wait for cookie button to appear and then click on it
  let selector = "#onetrust-reject-all-handler";
  let buttonReady = await page.waitForFunction(
    selector => !!document.querySelector(selector),
    {},
    selector,
  );

  if (!buttonReady) throw new Error("Reject cookies button not found");
  console.log("Cookies button found: " + selector);

  await page.locator(selector).click();
  //await page.waitForNavigation();
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