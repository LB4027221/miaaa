#!/usr/bin/python
# -*- coding: UTF-8 -*-

import pandas as pd
import sys
import json
import os

filename = sys.argv[1]

# df_from_excel(filename)

xls = pd.ExcelFile(filename)

sheets = {}
output = {}

for sheet_name in xls.sheet_names:
  sheets[sheet_name] = xls.parse(sheet_name, index=False, header=None)
  output[sheet_name] = {
    'data': sheets[sheet_name].to_json(orient='split', date_format='iso'),
    'name': sheet_name
  }

sys.stdout.write(json.dumps(output))
sys.stdout.flush()

sys.exit()
