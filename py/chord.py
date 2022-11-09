#!/usr/bin/python
# -*- coding: UTF-8 -*-

import pandas as pd
import json
import sys
from chord import chord

def unique(arr):
  return list(set(arr))

def get_all_node_keys(data, sourceKey, targetKey):
  sourceKeys = unique(data[sourceKey])
  targetKeys = unique(data[targetKey])
  allKeys = unique(sourceKeys + targetKeys)

  return pd.Series(allKeys)

def make_nodes(keys, data, sourceKey, targetKey):
  newData = data.groupby([sourceKey, targetKey]).size()
  # get_value = lambda key: data.groupby(sourceKey).count()
  # values = list(map(get_value, keys))
  return newData

def make_links(filename, sheet_name, source, target):
  xls = pd.ExcelFile(filename)
  data = xls.parse(sheet_name)
  keys = get_all_node_keys(data, source, target)
  newData = make_nodes(keys, data, source, target)

  data_val = list(map(lambda y:list(map(lambda x: ([x], [y]), keys)), keys))

  df = pd.DataFrame(index=keys, columns=keys, data=data_val)

  def applymap_item(x):
      values = newData.loc[x].values
      if (len(values)):
          return values[0]
      else:   
          return 0

  links = df.applymap(applymap_item)

  return links