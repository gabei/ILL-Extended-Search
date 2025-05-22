import pandas as pd
import json

data = pd.read_excel('AGExternal.xlsx', sheet_name="ALL AGEXTERNAL")
json_data = data.to_json(orient='records')

with open('AGExternal.json', 'w') as json_file:
    json.dump(json_data, json_file, indent=4)

json_file.close()