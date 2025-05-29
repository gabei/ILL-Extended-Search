
# this list is replaceable
# populate this list from worldcat results based on book
# use method from worldcat-login.js to grab this for now
searchable_libraries = [
  "Georgetown Public Library",
  "Waco-McLennan County Library",
  "Houston Public Library",
  "Harris County Public Library",
  "Fort Worth Public Library",
  "Bell/Whittington Public Library",
  "Plano Public Library",
  "Metropolitan Library System",
  "Fayetteville Public Library",
  "Jackson Hinds Library System",
  "Mississippi Library Commission",
  "Wichita Public Library",
  "Springfield-Greene County Library District",
  "Central Kansas Library System",
  "Baldwin County Library Cooperative",
  "Manhattan Public Library",
  "Lawrence Public Library",
  "Johnson County Library",
  "Kansas City Public Library",
  "Mid-Continent Public Library",
  "Ozark Regional Library",
  "Selma Dallas County Public Library",
  "Farmington Public Library",
  "Daniel Boone Regional Library",
  "Birmingham Public Library",
  "Pikes Peak Library District",
  "Saint Louis County Library",
  "Gothenburg Public Library",
  "The John P. Holt Brentwood Library",
  "Omaha Public Library",
  "Jefferson County Public Library",
  "Anythink",
  "Des Moines Public Library",
  "Normal Public Library",
  "Prescott Public Library",
  "Knox County Public Library System",
  "Crawfordsville District Public Library",
  "The Indianapolis Public Library",
  "Clark County Public Library",
  "Tinley Park Public Library",
  "Geneva Public Library District",
  "Lisle Library District",
  "Winfield Public Library",
  "Downers Grove Public Library",
  "Wheaton Public Library",
  "Glen Ellyn Public Library",
  "Kenton County Public Library",
  "Helen Plum Library",
  "Bedford Park Public Library District",
  "Jacksonville Public Library"
]

# begin work here
import json
from thefuzz import fuzz
from thefuzz import process



file = open("TXlenders.json")
data = json.load(file)
file.close()



# had to rely on chat gpt a bit to clear this up for me. I get how it works but this is much clearner than my original solution was going to be!


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


for i in matches:
  print(i)