import { extract, ratio } from 'fuzzball';
import TXlenders from "./TXlenders.json" with {type: 'json'};
import ALLlenders from "./ALLlenders.json" with {type: 'json'};


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


export default async function initFuzzysearch(searchableLibraries){
  let texasLenderList = createLenderCodeDict(TXlenders);
  let allLenderList = createLenderCodeDict(ALLlenders);

  let txMatches = runNameMatchSearch(normalizeLibraryNames(searchableLibraries), texasLenderList);
  let allMatches = runNameMatchSearch(normalizeLibraryNames(searchableLibraries), allLenderList);

  return removeDuplicateEntries(txMatches, allMatches)
}


