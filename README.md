# ILL-Extended-Search
ILL Extended Search is a tool (WIP) that aims to reduce the amount of time and effort it takes to make out-of-network inter-library loan requests.

## Inter-library Loans (ILL)
Our library participates in the Texas ILL system, which allows libraries to borrow books from other participating institutions.

## Out-of-Network Requests
The ILL system works automatically after a request is placed. Starting with the closest possible lending library, the system will automatically extend requests to other participating libaries if the request has not yet been filled. Eventually, we will hit a wall when we are unable to find a library within the state of Texas to fulfill the request. From this point we are able to manually create a request using information that we have about other libraries that are willing to lend outside of their own state.

## How it Works
This tool is essentially a series of web crawlers that aim to speed up the time it takes to manually enter these requests. Instead of sitting and manually looking up which libraries are able to lend to us, navigating through excel sheets, copying, pasting, repeating - we simply search an ISBN (International Standard Book Number) for the bot to search. THe bot will then consult the relevant data and return a list of senders for us to copy into the new request.

## Future Versions
Soon I would like for this bot to also create the request and fill in the information for us. For the time being, looking up library names and returning the relevant possible lender information to us still saves a lot of time.


# Requirements
Several environment variables are in place to run these scripts. See setup below

- [WorldCat](https://search.worldcat.org/) login credentials (associated with your library)
- [ShareIt](https://texas.agshareit.com/home?cid=texas&lid=texas) login credentials (associated with your library)

Your environment variables will look like this

```
ILL_LOGIN="your library's ShareIt landing page URL"
ILL_REQUEST_PAGE="https://texas.agshareit.com/request"
ILL_USERNAME="your ShareIt username"
ILL_PASSWORD="your Shareit password"
TECH_ACCOUNT="your library card number (if testing this locally)"
WORLDCAT_USERNAME="your WorldCat username"
WORLDCAT_PASSWORD="your WorldCat password"
WORLDCAT_LOGIN="https://search.worldcat.org"
WORLDCAT_HOME="https://search.worldcat.org/"
REBROWSER_PATCHES_RUNTIME_FIX_MODE="addBinding"
REBROWSER_PATCHES_DEBUG=1
PORT=#### (whatever port you want your server to run on - not required)
```
