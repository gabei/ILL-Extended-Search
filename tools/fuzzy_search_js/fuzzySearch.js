//import fuzz from "fuzzball";
import TXlenders from "./TXlenders.json" with {type: 'json'};
import ALLlenders from "./ALLlenders.json" with {type: 'json'};



const normalizeString = (str) => {
  return str.toLowerCase();
}



const normalizeLibraryNames = (libraryNames) => {
  return libraryNames.map(name => normalizeString(name));
}



const createLenderCodeDictionary = (lenderCodes) => {
  const dict = new Object();

  for(const key in lenderCodes){
    dict[normalizeString(key)] = lenderCodes[key];
  }

  console.log(dict);
  return dict;
}



const runNameMatchSearch = (data, lenders, matches) => {

}



const removeDuplicateEntries = (matches) => {

}



const printMatchList = (matches) => {

}

createLenderCodeDictionary(TXlenders);