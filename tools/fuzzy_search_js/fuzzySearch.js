import { extract, ratio } from 'fuzzball';
import TXlenders from "./TXlenders.json" with {type: 'json'};
import ALLlenders from "./ALLlenders.json" with {type: 'json'};



const searchable_libraries = [
  'Ardmore Public Library',
  'Springfield-Greene County Library District',
  'Mid-Continent Public Library',
  'Falls City Library and Arts Center',
  'Saint Louis Public Library',
  'Henderson County Public Library District',
  'Johnson County Public Library',
  'Carnegie Stout Public Library',
  'Allen County Public Library',
  'Hennepin County Library',
  'K.O. Lee Aberdeen Public Library',
  'Stark County District Library',
  'Los Angeles Public Library',
  'Sacramento Public Library',
  'New York Public Library',
  'King County Library System',
  'Auckland Libraries',
  'Hutt City Libraries',
  'Brisbane City Council Library Services',
  'Mackay Regional Council',
  'Hills Shire Library Service',
  'Springvale Library and Information Service'
]



const normalizeString = (str) => {
  return String(str).toLowerCase();
}


const normalizeLibraryNames = (libraries) => {
  return libraries.map((name) => {
    return normalizeString(name);
  });
}



const libraryNameList = (libraryNames) => {
  return libraryNames.map((item) => {
    return item.name;
  });
}



const createLenderCodeDict = (lenderCodes) => {
  let dict = lenderCodes.map((item) => {
    return {
      name: normalizeString(item["LIBRARY NAME"]),
      code: item["AGEXTERNAL CODE"],
    };
  });

  return dict;
}



const runNameMatchSearch = (libraries, lenderDict) => {
  const validMatches = new Array();
  const lenders = libraryNameList(lenderDict);
  

  for(let library of libraries) {
    let [name, score] = search(library, lenders);

    if( matchScoresHigherThan(score, 88) ) {
      //console.log(`Found match for ${library}: ${name}`);
      validMatches.push(lenderDict.find((item) => item.name === name));
    }
  }

  return validMatches;
}



const search = (library, lenders) =>{
  let match = extract(library, lenders, {
    scorer: ratio,
    limit: 1
  });

  return match[0];
}



const matchScoresHigherThan = (match, threshold) => {
  return match >= threshold;
}



const removeDuplicateEntries = (list1, list2) => {
  // Combine both lists and remove duplicates based on the 'code' property
  // Set ensures uniqueness if a code is added twice
  let combined = [...list1, ...list2];
  return Array.from(new Set(combined.map(item => item.code)));
}



const printMatchList = (matches) => {
  console.log("Matches found: " + matches);
  for(let match of matches) {
    console.log(match)
  }
}



let texasLenderList = createLenderCodeDict(TXlenders);
let allLenderList = createLenderCodeDict(ALLlenders);

let txMatches = runNameMatchSearch(normalizeLibraryNames(searchable_libraries), texasLenderList);
let allMatches = runNameMatchSearch(normalizeLibraryNames(searchable_libraries), allLenderList);

printMatchList(removeDuplicateEntries(txMatches, allMatches))
