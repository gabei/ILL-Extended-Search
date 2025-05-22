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
  loginPage: process.env.WORLDCAT_LOGIN,
  username: process.env.WORLDCAT_USERNAME,
  password: process.env.WORLDCAT_PASSWORD,
}

export { illConfig, worldCatConfig };
