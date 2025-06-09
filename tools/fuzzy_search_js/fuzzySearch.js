//import fuzz from "fuzzball";
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



const normalizeLibraryNames = (libraryNames) => {
  return libraryNames.map((name) => {
    return normalizeString(name);
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



const runNameMatchSearch = (data, lenders, matches) => {

}



const removeDuplicateEntries = (matches) => {

}



const printMatchList = (matches) => {

}

//console.log(createLenderCodeDict(TXlenders));
// console.log(normalizeLibraryNames(searchable_libraries));