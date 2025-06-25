import { page } from '../general/browser.js';
import { worldCatConfig as config } from '../config.js';
import { elementExists, waitFor } from '../general/general.js';
import initFuzzysearch from '../../tools/fuzzy_search_js/fuzzySearch.js';



let cookiesRejected = false;
let signedIn = false;

export default async function initWorldCat(ISBN){
  try 
  {
    await goToMainSearchPageAndAttemptSearch(ISBN);
    if ( !signedIn) await attemptToLogin();
    await handleResultsPage();
    await handleLibraryLoadError();
    let bookData = await scrapeForBookData();
    console.log(bookData);
    return bookData;
  } 
  catch(error){
    console.error(`There was an error during navigation:\n${error.stack}`);
    return error;
  } 
  finally {
    await goToSearchPage();
    console.log("Process complete!\n");
  }
}


async function goToMainSearchPageAndAttemptSearch(isbn){
  try {
    await goToSearchPage();
    if( !cookiesRejected ) await waitForCookieModalToClose();
    await enterIsbnAndSearch(isbn);
    await page.waitForNavigation();
  }

  catch (error) {
    console.error("Error during initial ISBN search: " + error.message);
    throw new Error("Error during initial ISBN search: " + error.message);
  }   
}


async function goToSearchPage(){
   await page.goto(config.searchPage);
}


async function waitForCookieModalToClose(){
  // wait for cookie button to appear and then click on it
  let selector = "#onetrust-reject-all-handler";
  await waitForElementToAppearAndClick(selector);
  cookiesRejected = true;
}


async function enterIsbnAndSearch(isbn){
  try {
    await page.locator('input[type="text"]').fill(isbn);
    await page.locator('button[type="Submit"]').click();
    console.log("Searched for isbn " + isbn);
  } catch (error) {
    console.error("Error during ISBN search: " + error.message);
    throw new Error("Error during ISBN search: " + error.message);; // rethrow to handle it in the main function
  }
}


async function handleResultsPage() {
    let currentlyOnSearchPage = await landedOnSearchResultsPage();
    if(currentlyOnSearchPage) await goToFirstSearchResult();
}


async function landedOnSearchResultsPage(){
  // It is possible to land on a search results page rather than the book page
  // In that case, we should click on the top result
  // Below we check if we are looking at a search results page
  
  console.log("Checking if we landed on search results...");
  let searchResultItem = page.locator('li[data-testid="search-result-item"');
  if(searchResultItem) {
    console.log("Landed on search results page. Waiting for search results to appear...");
    return true;
  }
  console.log("Not on search results page. Continuing on...");
  return false;
}


async function goToFirstSearchResult(){
  try {
    let successfullyClicked = await waitForElementToAppearAndClick('h2 > div > a');
    if(!successfullyClicked) {
      console.log(
        "No search results found. Proceeding with script.\nIf this is a mistake, there are two things to consider:\n 1.Are you sure the ISBN is correct?\n 2. Did you actually land on a search page?\n You are currently on: " + page.url()
      )

      return false;
    } else {
      return true;
    }
  }

  catch (error) {
    console.error("Error while trying to click on the first search result: " + error.message);
    throw new Error("Error while trying to click on the first search result: " + error.message);

  }
}


async function attemptToLogin(){
  try {
    await goToSignInPage();
    //await page.waitForNavigation();
    await inputEmail();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await inputLoginCredentials();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    signedIn = true;
  }

  catch (error) {
    console.error("Error during login: " + error.message);
    throw new Error("Error during login: " + error.message);
  }
}


async function goToSignInPage(){
  console.log("Attempting to navigate to sign-in page...");
  let signInLinkFound = await waitForElementToAppearAndClick('a[data-testid="header-sign-in-link"]');
  signInLinkFound 
  ? console.log("Sign-in link found and clicked!")
  : console.log("Could not navigate to sign-in.");
}


async function inputEmail(){
    console.log("Attempting to input email...");
    await waitFor(2000); // compensate for weird email entering behavior
    await page.locator('input[type="text"]').fill(config.username);
    await page.locator('button[type="Submit"]').click();
}


async function inputLoginCredentials(){ 
  console.log("Attempting to login using full credentials...");
  await page.locator('input#username').fill(config.username);
  await page.locator('input#password').fill(config.password);
  await page.locator('button[type="Submit"]').click();
}

async function scrapeForBookData(){
  let bookData =  await page.evaluate(async () => {
    let title = document.querySelector('h1 > div > span');
    let author = document.querySelector('a[data-testid^="author-"]');
    let isbn = document.querySelector('span[aria-labelledby^="isbn-"] > div > span');
    let oclc = document.querySelector('span[aria-labelledby^="oclcnumber-"]');
    let publisher = document.querySelector('span[data-testid^="publisher-"]')
    return {
      title: title.innerText.trim(),
      author: author.innerText.trim(),
      isbn: isbn.innerText.trim(),
      oclc: oclc.innerText.trim(),
      publisher: publisher.innerText.trim(),
    }
  });

  let lenderData = await scrapeForLenderData();
  return {...bookData, lenderData}
}


async function scrapeForLenderData(){
    let libraryNames = await attemptToGetLibraryHoldingsList();
    let libraryCodes = await initFuzzysearch(libraryNames);
    console.log(libraryCodes);
    return libraryCodes;
}


async function attemptToGetLibraryHoldingsList(){
    await waitFor(1000);
    await expandLibraryHoldingsList();
    await waitFor(3000);
    const names = await getListOfLibraryNames();
    return names;
}


async function handleLibraryLoadError(){
  let errorDivSelector = 'div[data-testid="holdings-error-notification-message"]';
  let errorMessageButton = page.locator('div[data-testid="holdings-error-notification-message"] button');
  let errorShows = await elementExists(errorDivSelector);
  let clickErrorMessageButton = await waitForElementToAppearAndClick(errorMessageButton);

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
    console.log("No error messages shown for library holdings list. Proceeding...");
    return true;
  }
}


async function expandLibraryHoldingsList(){
  console.log("Attempting to expand library holdings list...");

  // Wait for the library holdings list to appear
  const paginationExtenderSelector = 'div[data-testid="pagination-results-per-page"] input';
  let selectionsVisible = await waitForElementToAppearAndClick(paginationExtenderSelector);
  if (selectionsVisible) {
    console.log("Selections for pagination results per page are visible.");
  }

  // Select 50 results per page
  const expandedListselector = 'li[data-testid="pagination-limit-select-50"]';
  let listingsExpanded = await waitForElementToAppearAndClick(expandedListselector);
  if(listingsExpanded) {
    console.log("Library holdings list expanded to 50 results per page.");
  }
}


async function waitForElementToAppearAndClick(selector, maxWaitTime = 10000) {
  // See documentation for waitForFunction:
  // https://pptr.dev/api/puppeteer.page.waitforfunction

  console.log(`Waiting for element with selector: ${selector}`);

  let elementReady = await page.waitForFunction(
      selector => !!document.querySelector(selector),
      {signal: AbortSignal.timeout(maxWaitTime)},
      selector,
  ).catch((error) => {
      console.error(`Error waiting for element with selector ${selector}:`, error + "\n Proceeding if possible...");
      return false;
    } 
  );
  
  if(elementReady) {
    await page.locator(selector).hover();
    await page.locator(selector).click();
    console.log("Element clicked!");
    return true;
  } else {
    return false;
  }
  
}


async function getListOfLibraryNames(){
  return await page.evaluate(()=> {
    // This function will return a list of library names from the holdings list
    let names = document.querySelectorAll('ul[data-testid="holding-list-details"] li strong');
    return Array.from(names).map((name) => name.innerText);
  });
}




