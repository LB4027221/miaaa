#!/usr/bin/python
# -*- coding: UTF-8 -*-

import sys
import json
import pandas as pd
import xlsxwriter
import os
import pymysql
import re

from datetime import datetime, timedelta
from xlsxwriter.utility import xl_rowcol_to_cell

from openpyxl.formula import Tokenizer
from openpyxl import load_workbook

msg = json.loads(sys.argv[1])
sql = msg['sql']
host = msg['host']
user = msg['user']
passwd = msg['passwd']
orient = msg['orient']

conn = pymysql.connect(host=host, port=3306, user=user, passwd=passwd)
data = pd.read_sql(sql, conn)

msg = data.to_json(orient=orient, date_format='iso')

sys.stdout.write(json.dumps(msg))
sys.stdout.flush()

sys.exit()
