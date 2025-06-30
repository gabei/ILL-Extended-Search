import pandas as pd
import json

data = pd.read_excel('AGExternal.xlsx', sheet_name="ALL AGEXTERNAL")
json_data = data.to_dict(orient='records')
for entry in json_data:
    del entry["OCLC SYMBOL"]

with open('fuzzy_search_js/ALLlenders.json', 'w') as json_file:
    json.dump(json_data, json_file, indent=4, allow_nan=True)

json_file.close()