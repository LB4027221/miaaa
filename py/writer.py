#!/usr/bin/python
# -*- coding: UTF-8 -*-

import pandas as pd

# xl = pd.ExcelFile('input.csv')

# print(xl.sheet_names)  # see all sheet names

xc = pd.read_csv('input.csv', index_col=None)
pinglei = pd.read_excel('123.xlsx', '品类区分', index_col=None, skipRow=1)
writer = pd.ExcelWriter('output.xlsx', engine='xlsxwriter')

ascending = True

xc.set_index(['进单时间']).sort_index(ascending=ascending).to_excel(writer, index=True, sheet_name='订单明细')

pinglei.to_excel(writer, index=False, sheet_name='品类区分')

workbook = writer.book

worksheet = writer.sheets['订单明细']
worksheet2 = writer.sheets['品类区分']

columnLen = len(xc.columns.tolist())

datalen = len(xc)

# xc.columns.append('头')
# newColName = '头'
# newCol = pd.DataFrame({ '头': [1] })
# worksheet.write(0, columnLen, '头')
# xc.columns = pd.concat([xc.columns, newCol])
# xc.columns.insert(datalen, '头', 1)

# xc.columns[datalen] = '头'
# columns = pd.merge(xc.columns, newCol)
# print(columns)

for num in range(2, datalen):
  worksheet.write_formula(num - 1, columnLen, '=VLOOKUP(G' + str(num) + ',品类区分!A:C, 3, 0)')

header_format = workbook.add_format({
  'bold': True,
  'text_wrap': True,
  'valign': 'top',
  'fg_color': '#D7E4BC',
  'border': 1
})

for col_num, value in enumerate(xc.columns.values):
  worksheet.write(0, col_num, value, header_format)

worksheet.write(0, columnLen, '品类组', header_format)


pd.options.display.float_format = '{:,.3f}'.format # Limit output to 3 decimal places.
describe = xc.describe()
describe.to_excel(writer, sheet_name='分析页')

writer.save()

# output = pd.read_excel('output.xlsx', index_col=None)

# pd.options.display.float_format = '{:,.3f}'.format # Limit output to 3 decimal places.

# xlsx = pd.ExcelFile('123.xlsx')
# sheets = []
# for sheet in xlsx.sheet_names:
#     sheets.append(xlsx.parse(sheet))
# data = pd.concat(sheets, sort=True)
# # xc.describe()

# print(data)
# print(xc.head())


# xl.parse(sheet_name)  # read a specific sheet to DataFrame

# df = pd.read_excel('123.xlsx', encoding='utf8')

# df.head(2)

# print p