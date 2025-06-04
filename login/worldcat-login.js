import puppeteer from 'puppeteer';
import { worldCatConfig as config} from './config.js';
import { PuppeteerBlocker } from '@ghostery/adblocker-puppeteer';
import fetch from 'cross-fetch';



const browserOptions = {
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


const browser = await puppeteer.launch(browserOptions);
  const page = (await browser.pages())[0] // use current tab
  page.setDefaultNavigationTimeout(60000); // 10 seconds
  page.setCacheEnabled(false);

  // setup adblock with Ghostery
  PuppeteerBlocker
    .fromPrebuiltAdsAndTracking(fetch)
    .then((blocker) => {
      blocker.enableBlockingInPage(page);
    })



export default async function initWorldCat(){
  try 
  {
    await goToSearchPage();
    await waitForCookieModalToClose();
    await enterIsbnAndSearch("9780062060624");
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    if(await landedOnSearchResultsPage()) await goToFirstSearchResult();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    await goToSignInPage();
    await inputEmail();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await inputLoginCredentials();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await handleLibraryLoadError();
    await expandLibraryHoldingsList();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
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
  } catch (error) {
    console.error("Error during ISBN search: " + error.message);
    throw new Error("Error during ISBN search: " + error.message);; // rethrow to handle it in the main function
  }
}



async function landedOnSearchResultsPage(){
  // It is possible to land on a search results page rather than the book page
  // In that case, we should click on the top result
  // Below we check if we are looking at a search results page
  let searchResultItem = page.locator('li[data-testid="search-result-item"');
  if(searchResultItem) return true;
  return false;
}



async function expandLibraryHoldingsList(){
  let errorMessageDiv = page.locator('div[data-testid="holdings-error-notification-message"]');
  console.log("Expanding library holdings list...");

}


async function goToFirstSearchResult(){
  console.log("Landed on search results page. Waiting for search results to appear...");
  let successfullyClicked = await waitForElementToAppearAndClick('h2 > div > a');
  console.log("Successfully clicked on the first search result? " + successfullyClicked);
  if(!successfullyClicked)  throw new Error("No search results found. Two things:\n 1.Are you sure the ISBN is correct?\n 2. Did you actually land on a search page?\n You are currently on: " + page.url())
}


async function waitForCookieModalToClose(){
  // wait for cookie button to appear and then click on it
  let selector = "#onetrust-reject-all-handler";
  await waitForElementToAppearAndClick(selector);
}



async function goToSignInPage(){
  console.log("Attempting to navigate to sign-in page...");
  let signInLinkFound = await waitForElementToAppearAndClick('a[data-testid="header-sign-in-link"]');
  console.log("Sign-in link found and clicked: " + signInLinkFound);  
}



async function inputEmail(){
    console.log("Attempting to input email...");
    await page.locator('input[type="text"]').fill(config.username);
    await page.locator('button[type="Submit"]').click();
}



async function inputLoginCredentials(){ 
  console.log("Attempting to login using full credentials...");
  await page.locator('input#username').fill(config.username);
  await page.locator('input#password').fill(config.password);
  await page.locator('button[type="Submit"]').click();
}



async function elementExists(divSelector) {
  const exists = 
  await page.$(divSelector, () =>{
    return true
  }).catch(() => {
    return false
  });

  return exists
}



async function waitFor(time){
  return new Promise(resolve => setTimeout(resolve, time));
}



async function handleLibraryLoadError(){
  let errorDivSelector = 'div[data-testid="holdings-error-notification-message"]';
  let errorMessageButton = page.locator('div[data-testid="holdings-error-notification-message"] button');
  let errorShows = await elementExists(errorDivSelector);
  let clickErrorMessageButton = await waitForElementToAppearAndClick(errorMessageButton);
  let waitOptions = {concurrency: 2, idleTime: 1000}

  // If the library holdings list fails to load, we need to tell the page to reload
  if ( errorShows ) {
      await clickErrorMessageButton();
      await waitFor(2000);

      if( errorShows ){
        await page.reload();
        await page.waitForNavigation();
        await handleLibraryLoadError();
      }  
  } else {
    return true
  }
}


async function waitForElementToAppearAndClick(selector) {
  // See documentation for waitForFunction:
  // https://pptr.dev/api/puppeteer.page.waitforfunction

  console.log(`Waiting for element with selector: ${selector}`);

  let elementReady = await page.waitForFunction(
    selector => !!document.querySelector(selector),
    {},
    selector,
  );

  if (!elementReady) {
    throw new Error(`Element with selector ${selector} not found`);
  }

  await page.locator(selector).click();
  return true;
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