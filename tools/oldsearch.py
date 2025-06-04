
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



file = open("TXlenders.json")
data = json.load(file)
file.close()



# had to rely on chat gpt a bit to clear this up for me. I get how it works but this is much clearner than my original solution was going to be!
# need to make this more robust and add tests



# when searching through ALLlenders.json, "AGEXTERNAL CODE" needs to be changed to "AGEXTERNAL SYMBOL"



def normalize(name):
  return name.lower()

library_names = [normalize(entry["LIBRARY NAME"]) for entry in data]

lender_codes = {
  normalize(entry["LIBRARY NAME"]): entry["AGEXTERNAL CODE"]
  for entry in data
}

SCORE_THRESHOLD = 85
matches = []

for name in searchable_libraries:
  norm_name = normalize(name)
  best_match, score = process.extractOne(norm_name, library_names, scorer=fuzz.ratio)

  if score >= SCORE_THRESHOLD:
    matches.append(lender_codes[best_match])

print("Matches found:" + str(len(matches)))
for i in matches:
  print(i)


print("\n\nUnique matches found :" + str(len(set(matches))))
for i in matches.unique():
  print(i)