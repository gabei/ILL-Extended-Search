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
};


const browser = await puppeteer.launch();
const page = await browser.newPage();


try {
  await login();
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
  printCurrentPageTitleAndURL();

  await page.locator(config.usernameInput).fill(config.username);
  await page.locator(config.passwordInput).fill(config.password);
  await page.locator('::-p-aria(Submit)').click();
  await page.waitForNavigation();
  printCurrentPageTitleAndURL();
}


async function printCurrentPageTitleAndURL() {
  await page.title().
  then((title) => console.log("Current Page Title: \"" + title + "\""));
  
  console.log( page.url() );
}
