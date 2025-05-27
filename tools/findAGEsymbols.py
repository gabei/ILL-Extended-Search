
# this list is replaceable
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

search_results = []
index = 0

while(len(search_results) < 20):
  potential_lender = data[index]["LIBRARY NAME"]
  score = process.extractBests(potential_lender, searchable_libraries, limit=1)[0][1]
  if(score > 80):
    print(potential_lender)
    search_results.append(data[index]["AGEXTERNAL CODE"])
  index += 1


file.close()


for code in search_results:
  print(code)

