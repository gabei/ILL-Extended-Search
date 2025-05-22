import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();


// consider a separate config file
const config = {
    loginPage: process.env.ILL_LOGIN,
    username: process.env.ILL_USERNAME,
    password: process.env.ILL_PASSWORD,
    usernameInput: "#username",
    passwordInput: "#password",
    requestPage: process.env.ILL_REQUEST_PAGE,
    techAccount: process.env.TECH_ACCOUNT,
};


const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();
page.setDefaultNavigationTimeout(10000); // 10 seconds


try {
  await login();
  await openBlankRequest(config.techAccount);
} 
catch(error) {
  console.error("Error during login: ", error);
} 
finally {
    await page.close();
    await browser.close();
}



async function login() { 
  await page.goto(config.loginPage);
  await printCurrentPageTitleAndURL();

  await page.locator(config.usernameInput).fill(config.username);
  await page.locator(config.passwordInput).fill(config.password);
  await page.locator('::-p-aria(Submit)').click();
  await page.waitForNavigation();
  await printCurrentPageTitleAndURL();
}



async function openBlankRequest(patronID) {
  await page.goto(config.requestPage);
  printCurrentPageTitleAndURL();

  await page.waitForSelector("#mat-input-0" || "#mat-input-1");
  await page.locator("#mat-input-0" || "#mat-input-1").fill(patronID);
  await page.locator('button[type="submit"]').click();

  try {
    await page.locator(`td  ::-p-text(${patronID})`).click();
    
  } catch(error) {
    console.error("Error while clicking on the table cell: ", error);
  } finally {
    await page.waitForNavigation();
  }
  
  
}



async function printCurrentPageTitleAndURL() {
  await page.title().
  then((title) => console.log("Current Page Title: \"" + title + "\""));
  
  console.log( page.url() );
}
