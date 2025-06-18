// Config file stores the login information for the ILL systems
import dotenv from 'dotenv';
dotenv.config();


const illConfig  = {
    loginPage: process.env.ILL_LOGIN,
    username: process.env.ILL_USERNAME,
    password: process.env.ILL_PASSWORD,
    requestPage: process.env.ILL_REQUEST_PAGE,
    techAccount: process.env.TECH_ACCOUNT,
}

const worldCatConfig = {
  searchPage: process.env.WORLDCAT_HOME,
  loginPage: process.env.WORLDCAT_LOGIN,
  username: process.env.WORLDCAT_USERNAME,
  password: process.env.WORLDCAT_PASSWORD,
}

const browserOptions = {
  executablePath: 'usr/bin/chromium',
  defaultViewport: null,
  headless: true,
  args: [
    '--window-size=1200,800',
    '--incognito',
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-blink-features=AutomationControlled',
  ],
}

export { illConfig, worldCatConfig, browserOptions };
