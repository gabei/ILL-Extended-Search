import { extract, token_sort_ratio } from 'fuzzball';
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



const runNameMatchSearch = (libraries, lenderDict, matches) => {
  const validMatches = new Array();
  const lenders = libraryNameList(lenderDict);

  for(let library of libraries) {
    let match = search(library, lenders);
    console.log(match);

    if( matchScoresHigherThan(match, 85) ) {
      console.log(`Found match for ${library}: ${match}`);
      validMatches.push();
    }
  }

  return validMatches;
}



const search = (library, lenders) =>{
  let match = extract(library, lenders, {
    scorer: token_sort_ratio,
    processor: (item) => item.name,
    limit: 1
  });

  return match[0];
}



const matchScoresHigherThan = (match, threshold) => {
  return match >= threshold;
}



const removeDuplicateEntries = (matches) => {

}



const printMatchList = (matches) => {

}

//console.log(libraryNameList(createLenderCodeDict(TXlenders)));
let matches = runNameMatchSearch(normalizeLibraryNames(searchable_libraries), createLenderCodeDict(TXlenders), []);
console.log(matches);