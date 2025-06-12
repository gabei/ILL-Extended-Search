import { page } from "./browser.js";

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


function printLibraryNames(names){
  console.log("List of library names:");
  names.forEach((name) => {
    console.log(name);
  });
}

export {elementExists, waitFor, printLibraryNames};