import pandas as pd
import json

data = pd.read_excel('AGExternal.xlsx', sheet_name="Lenders to TX")
json_data = data.to_dict(orient='records')

with open('TXlenders.json', 'w') as json_file:
    json.dump(json_data, json_file, indent=4)

json_file.close()