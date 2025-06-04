
# this list is replaceable
# populate this list from worldcat results based on book
# use method from worldcat-login.js to grab this for now
searchable_libraries = [
  "Beatrice Public Library",
  "East Alton Public Library District",
  "Northlake Public Library District",
  "Oak Park Public Library",
  "Allen County Public Library",
  "Michigan State University Libraries",
  "Onondaga County Public Library",
  "Asbury Park Public Library",
  "Richland Public Library",
  "North East Lincolnshire Libraries",
  "London Borough of Hounslow Libraries",
  "Suffolk Community Libraries",
  "Danish Union Catalogue and Danish National Bibliography"
]


# begin work here
import json
from thefuzz import fuzz
from thefuzz import process


def normalize(name)-> str:
  return name.lower()


def normalize_library_names(data)-> list:
  return [normalize(entry["LIBRARY NAME"]) for entry in data]


def create_lender_code_dict(data)-> dict:
  return {
    normalize(entry["LIBRARY NAME"]): entry["AGEXTERNAL CODE"]
    for entry in data
  }


def run_name_match_search(data, lenders, matches)-> None:
  library_names = normalize_library_names(data)

  for name in searchable_libraries:
    norm_name = normalize(name)
    best_match, score = process.extractOne(norm_name, library_names, scorer=fuzz.ratio)

    if score >= SCORE_THRESHOLD:
      matches.append(lenders[best_match])


def remove_duplicate_entries(match_list)-> list:
  return list(dict.fromkeys(match_list))


def print_match_list(match_list)-> None:
  print("Matches found: {}".format(len(match_list)))
  for match in match_list:
    print(match)


file = open("TXlenders.json")
tx_lender_data = json.load(file)
file.close()

file = open("ALLlenders.json")
all_lender_data = json.load(file)
file.close()

SCORE_THRESHOLD = 85
matches = []

TX_LENDER_CODES = create_lender_code_dict(tx_lender_data)
ALL_LENDER_CODES = create_lender_code_dict(all_lender_data) 

run_name_match_search(tx_lender_data, TX_LENDER_CODES, matches)
run_name_match_search(all_lender_data, ALL_LENDER_CODES, matches)

unique_lender_codes = remove_duplicate_entries(matches)
print_match_list(unique_lender_codes)

