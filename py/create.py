#!/usr/bin/python
# -*- coding: UTF-8 -*-

import sys
import json
import pandas as pd
import xlsxwriter
import os

msg = json.loads(sys.argv[1])
dir = os.path.dirname(__file__)

title = msg['title']
data = msg['data']

datalen = len(data)

workbook = xlsxwriter.Workbook(dir + '/../excel/' + title + '.xlsx')
worksheet = workbook.add_worksheet()

for row in range(datalen):
  for col in range(len(data[row])):
    worksheet.write(row, col, data[row][col])

workbook.close()

sys.stdout.write(str(title))
