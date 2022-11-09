{
  var reservedMap = {
    'ALL': true,
    'AND': true,
    'AS': true,
    'ASC': true,

    'BETWEEN': true,
    'BY': true,

    'CASE': true,
    'CREATE': true,
    'CONTAINS': true,
    'CURRENT_DATE': true,
    'CURRENT_TIME': true,
    'CURRENT_TIMESTAMP': true,
    'CURRENT_USER': true,

    'DELETE': true,
    'DESC': true,
    'DISTINCT': true,
    'DROP': true,

    'ELSE': true,
    'END': true,
    'EXISTS': true,
    'EXPLAIN': true,

    'FALSE': true,
    'FROM': true,
    'FULL': true,

    'GROUP': true,

    'HAVING': true,

    'IN': true,
    'INDEX': true,
    'INNER': true,
    'INSERT': true,
    'INTO': true,
    'IS': true,

    'JOIN': true,

    'LEFT': true,
    'LIKE': true,
    'LIMIT': true,

    'NOT': true,
    'NULL': true,

    'ON': true,
    'OR': true,
    'ORDER': true,
    'OUTER': true,

    'REPLACE': true,
    'RIGHT': true,

    'SELECT': true,
    'SESSION_USER': true,
    'SET': true,
    'SHOW': true,
    'STATUS': true, // reserved (MySQL)
    'SYSTEM_USER': true,

    'TABLE': true,
    'THEN': true,
    'TRUE': true,
    'TYPE': true,   // reserved (MySQL)

    'UNION': true,
    'UPDATE': true,
    'USER': true,
    'USING': true,

    'VALUES': true,

    'WHEN': true,
    'WHERE': true

  };

  function createUnaryExpr(op, e) {
    return {
      type: 'unary_expr',
      operator: op,
      expr: e
    };
  }

  function createBinaryExpr(op, left, right) {
    return {
      type: 'binary_expr',
      operator: op,
      left: left,
      right: right
    };
  }

  function createBinaryExpr2(op, left, right) {
    var r = []
    r.push(right[3])
    r.push(right[5])
    r.push(right[7])

    return {
      type: 'binary_expr',
      operator: op,
      left: left,
      right: r
    };
  }

  function createList(head, tail) {
    var result = [head];
    for (var i = 0; i < tail.length; i++) {
      result.push(tail[i][3]);
    }
    return result;
  }
  function createDateList(head, tail) {
    var result = [head];
    for (var i = 0; i < tail.length; i++) {
      result.push(tail[i][3]);
    }
    return result;
  }

  function createBinaryExprChain(head, tail) {
    var result = head;
    for (var i = 0; i < tail.length; i++) {
      result = createBinaryExpr(tail[i][1], result, tail[i][3]);
    }
    return result;
  }
  function createBinaryExprChain2(head, tail) {
    var result = head;
    for (var i = 0; i < tail.length; i++) {
      result = createBinaryExpr2(tail[i][1], result, tail[i]);
    }
    return result;
  }

  function createBinaryExprChain3(head, tail) {
    var result = head;

    return {
      type: 'binary_expr',
      value: tail
    };
  }

  var cmpPrefixMap = {
    '+': true,
    '-': true,
    '*': true,
    '/': true,
    '>': true,
    '<': true,
    '!': true,
    '=': true,

    //between
    'B': true,
    'b': true,
    //for is or in
    'I': true,
    'i': true,
    //for like
    'L': true,
    'l': true,
    //for not
    'N': true,
    'n': true
  };

  // used for dependency analysis
  var varList = [];
}

start
  = union_stmt
  / update_stmt
  / replace_insert_stmt
  / proc_stmts

union_stmt
  = head:select_stmt tail:(__ KW_UNION __ select_stmt)* {
      var cur = head;
      for (var i = 0; i < tail.length; i++) {
        cur._next = tail[i][3];
        cur = cur._next
      }
      return head;
    }

select_stmt
  = select_stmt_nake
  / s:('(' __ select_stmt __ ')') {
      return s[2];
    }

select_stmt_nake
  = KW_SELECT           __
    opts:option_clause? __
    d:KW_DISTINCT?      __
    c:column_clause     __
    f:from_clause?      __
    w:where_clause?     __
    g:group_by_clause?  __
    h:having_clause?    __
    o:order_by_clause?  __
    l:limit_clause? {
      return {
        type: 'select',
        options: opts,
        distinct: d,
        columns: c,
        from: f,
        where: w,
        groupby: g,
        having: h,
        orderby: o,
        limit: l
      };
  }

// MySQL extensions to standard SQL
option_clause
  = head:query_option tail:(__ query_option)* {
    var opts = [head];
    for (var i = 0, l = tail.length; i < l; ++i) {
      opts.push(tail[i][1]);
    }
    return opts;
  }

query_option
  = option:(
        OPT_SQL_CALC_FOUND_ROWS
        / (OPT_SQL_CACHE / OPT_SQL_NO_CACHE)
        / OPT_SQL_BIG_RESULT
        / OPT_SQL_SMALL_RESULT
        / OPT_SQL_BUFFER_RESULT
    ) { return option; }

column_clause
  = (KW_ALL / (STAR !ident_start)) { return '*'; }
  / is_no

is_no
  = head:column_list_item tail:(__ COMMA __ column_list_item)*{
    return createList(head, tail);
  }

column_list_item
  = tbl:ident __ DOT __ STAR {
      return {
        expr: {
          type: 'column_ref',
          table: tbl,
          column: '*'
        },
        as: null
      };
    }
  / e:expr __ alias:alias_clause? {
      return { expr: e, as: alias };
    }

alias_clause
  = KW_AS? __ i:ident { return i; }

from_clause
  = KW_FROM __ l:table_ref_list { return l; }

table_ref_list
  = head:table_base
    tail:table_ref* {
      tail.unshift(head);
      return tail;
    }

table_ref
  = __ COMMA __ t:table_base { return t; }
  / __ t:table_join { return t; }


table_join
  = op:join_op __ t:table_base __ KW_USING __ LPAREN __ head:ident_name tail:(__ COMMA __ ident_name)* __ RPAREN {
      t.join = op;
      t.using = createList(head, tail);
      return t;
    }
  / op:join_op __ t:table_base __ expr:on_clause? {
      t.join = op;
      t.on   = expr;
      return t;
    }
  / op:join_op __ LPAREN __ stmt:union_stmt __ RPAREN __ KW_AS? __ alias:ident __ expr:on_clause? {
    stmt.parentheses = true;
    return {
      expr: stmt,
      as: alias,
      join: op,
      on: expr
    };
  }

//NOTE that, the table assigned to `var` shouldn't write in `table_join`
table_base
  = KW_DUAL {
      return {
        type: 'dual'
      };
  }
  / t:table_name __ KW_AS? __ alias:ident? {
      if (t.type === 'var') {
        t.as = alias;
        return t;
      } else {
        return {
          db: t.db,
          table: t.table,
          as: alias
        };
      }
    }
  / LPAREN __ stmt:union_stmt __ RPAREN __ KW_AS? __ alias:ident {
      stmt.parentheses = true;
      return {
        expr: stmt,
        as: alias
      };
    }

join_op
  = KW_LEFT __ KW_OUTER? __ KW_JOIN { return 'LEFT JOIN'; }
  / KW_RIGHT __ KW_OUTER? __ KW_JOIN { return 'RIGHT JOIN'; }
  / KW_FULL __ KW_OUTER? __ KW_JOIN { return 'FULL JOIN'; }
  / (KW_INNER __)? KW_JOIN { return 'INNER JOIN'; }

table_name
  = dt:ident tail:(__ DOT __ ident)? {
      var obj = { db: null, table: dt };
      if (tail !== null) {
        obj.db = dt;
        obj.table = tail[3];
      }
      return obj;
    }
  / v:var_decl {
      v.db = null;
      v.table = v.name;
      return v;
    }

on_clause
  = KW_ON __ e:expr { return e; }

where_clause
  = KW_WHERE __ e:expr { return e; }

group_by_clause
  = KW_GROUP __ KW_BY __ l:column_ref_list { return l; }

column_ref_list
  = head:column_ref tail:(__ COMMA __ column_ref)* {
      return createList(head, tail);
    }

having_clause
  = KW_HAVING __ e:expr { return e; }

order_by_clause
  = KW_ORDER __ KW_BY __ l:order_by_list { return l; }

order_by_list
  = head:order_by_element tail:(__ COMMA __ order_by_element)* {
      return createList(head, tail);
    }

order_by_element
  = e:expr __ d:(KW_DESC / KW_ASC)? {
    var obj = { expr: e, type: 'ASC' };
    if (d === 'DESC') obj.type = 'DESC';
    return obj;
  }

number_or_param
  = literal_numeric
  / param

limit_clause
  = KW_LIMIT __ i1:(number_or_param) __ tail:(COMMA __ number_or_param)? {
      var res = [i1];
      if (tail === null) res.unshift({ type: 'number', value: 0 });
      else res.push(tail[2]);
      return res;
    }

update_stmt
  = KW_UPDATE    __
    t:table_name __
    KW_SET       __
    l:set_list   __
    w:where_clause {
      return {
        type: 'update',
        db: t.db,
        table: t.table,
        set: l,
        where: w
      };
    }

set_list
  = head:set_item tail:(__ COMMA __ set_item)* {
      return createList(head, tail);
    }

/**
 * here only use `additive_expr` to support 'col1 = col1+2'
 * if you want to use lower operator, please use '()' like below
 * 'col1 = (col2 > 3)'
 */
set_item
  = c:column_name __ '=' __ v:additive_expr {
      return { column: c, value: v };
    }

replace_insert_stmt
  = ri:replace_insert       __
    KW_INTO                 __
    t:table_name  __ LPAREN __
    c:column_list  __ RPAREN __
    v:value_clause {
      return {
        type: ri,
        db: t.db,
        table: t.table,
        columns: c,
        values: v
      };
    }

replace_insert
  = KW_INSERT   { return 'insert'; }
  / KW_REPLACE  { return 'replace'; }

value_clause
  = KW_VALUES __ l:value_list  { return l; }

value_list
  = head:value_item tail:(__ COMMA __ value_item)* {
      return createList(head, tail);
    }

value_item
  = LPAREN __ l:expr_list  __ RPAREN {
      return l;
    }

expr_list
  = head:expr tail:(__ COMMA __ expr __ number __ expr)* {
      var el = { type: 'expr_list' };
      el.value = createList(head, tail);
      return el;
    }
  
    / head:expr tail:(__ COMMA __ expr __)* {
      var el = { type: 'expr_list' };
      el.value = createList(head, tail);
      return el;
    }

case_expr
  = KW_CASE                         __
    expr:expr?                      __
    condition_list:case_when_then+  __
    otherwise:case_else?            __
    KW_END __ KW_CASE? {
      if (otherwise) condition_list.push(otherwise);
      return {
        type: 'case',
        expr: expr || null,
        args: condition_list
      };
    }

case_when_then
  = KW_WHEN __ condition:expr __ KW_THEN __ result:expr __ {
    return {
      type: 'when',
      cond: condition,
      result: result
    };
  }

case_else = KW_ELSE __ result:expr {
    return { type: 'else', result: result };
  }

/**
 * Borrowed from PL/SQL ,the priority of below list IS ORDER BY DESC
 * ---------------------------------------------------------------------------------------------------
 * | +, -                                                     | identity, negation                   |
 * | *, /                                                     | multiplication, division             |
 * | +, -                                                     | addition, subtraction, concatenation |
 * | =, <, >, <=, >=, <>, !=, IS, LIKE, BETWEEN, IN           | comparion                            |
 * | !, NOT                                                   | logical negation                     |
 * | AND                                                      | conjunction                          |
 * | OR                                                       | inclusion                            |
 * ---------------------------------------------------------------------------------------------------
 */

expr
  = or_expr
  / select_stmt

or_expr
  = head:and_expr tail:(__ KW_OR __ and_expr)* {
      return createBinaryExprChain(head, tail);
    }

and_expr
  = head:not_expr tail:(__ KW_AND __ not_expr)* {
      return createBinaryExprChain(head, tail);
    }

//here we should use `NOT` instead of `comparision_expr` to support chain-expr
not_expr
  = comparison_expr
  / exists_expr
  / (KW_NOT / "!" !"=") __ expr:not_expr {
      return createUnaryExpr('NOT', expr);
    }

comparison_expr
  = left:additive_expr __ rh:comparison_op_right? {
      if (rh === null) return left;
      else if (rh.type === 'arithmetic') return createBinaryExprChain(left, rh.tail);
      else return createBinaryExpr(rh.op, left, rh.right);
    }

exists_expr
  = op:exists_op __ LPAREN __ stmt:union_stmt __ RPAREN {
    stmt.parentheses = true;
    return createUnaryExpr(op, stmt);
  }

exists_op
  = nk:(KW_NOT __ KW_EXISTS) { return nk[0] + ' ' + nk[2]; }
  / KW_EXISTS

comparison_op_right
  = arithmetic_op_right
  / in_op_right
  / between_op_right
  / is_op_right
  / like_op_right

arithmetic_op_right
  = l:(__ arithmetic_comparison_operator __ additive_expr)+ {
      return { type: 'arithmetic', tail: l };
    }

arithmetic_comparison_operator
  = ">=" / ">" / "<=" / "<>" / "<" / "=" / "!="

is_op_right
  = KW_IS __ right:additive_expr {
      return { op: 'IS', right: right };
    }
  / (KW_IS __ KW_NOT) __ right:additive_expr {
      return { op: 'IS NOT', right: right };
  }

between_op_right
  = op:KW_BETWEEN __  begin:additive_expr __ KW_AND __ end:additive_expr {
      return {
        op: op,
        right: {
          type: 'expr_list',
          value: [begin, end]
        }
      };
    }

like_op
  = nk:(KW_NOT __ KW_LIKE) { return nk[0] + ' ' + nk[2]; }
  / KW_LIKE

in_op
  = nk:(KW_NOT __ KW_IN) { return nk[0] + ' ' + nk[2]; }
  / KW_IN

like_op_right
  = op:like_op __ right:comparison_expr {
      return { op: op, right: right };
    }

in_op_right
  = op:in_op __ LPAREN  __ l:expr_list __ RPAREN {
      return { op: op, right: l };
    }
  / op:in_op __ e:var_decl {
      return { op: op, right: e };
    }

additive_expr
  = head:multiplicative_expr
    tail:(__ additive_operator  __ multiplicative_expr)* {
      return createBinaryExprChain(head, tail);
    }

date_fun_expr
  = __ head:multiplicative_expr __
    tail:(__ COMMA  __ multiplicative_expr __ literal __ literal) * {
      return createBinaryExprChain2(head, tail);
    }

date_format_expr
  = __ head:multiplicative_expr __
    "," __ tail:quoted_arg __ {
      return [head, tail];
    }

substring_expr
  = __ head:multiplicative_expr __ 
    start:substring_start end:substring_end? {
      return [head, start, end]
    }

substring_start
  = __ COMMA __ value:literal_numeric __ {
    return value;
  }

substring_end
  = __ COMMA __ value:literal_numeric __ {
    return value;
  }

additive_operator
  = "+" / "-"

multiplicative_expr
  = head:primary
    tail:(__ multiplicative_operator  __ primary)* {
      return createBinaryExprChain(head, tail);
    }

multiplicative_operator
  = "*" / "/" / "%"

primary
  = literal
  / cast_expr
  / aggr_func
  / func_call
  / case_expr
  / column_ref
  / param
  / LPAREN __ e:expr __ RPAREN {
      e.parentheses = true;
      return e;
    }
  / var_decl

column_ref
  = tbl:ident __ DOT __ col:column {
      return {
        type: 'column_ref',
        table: tbl,
        column: col
      };
    }
  / col:column {
      return {
        type: 'column_ref',
        table: null,
        column: col
      };
    }

column_list
  = head:column tail:(__ COMMA __ column)* {
      return createList(head, tail);
    }

ident
  = name:ident_name !{ return reservedMap[name.toUpperCase()] === true; } {
      return name;
    }
  / name:quoted_ident {
      return name;
    }

quoted_ident
  = double_quoted_ident
  / single_quoted_ident
  / backticks_quoted_ident

double_quoted_ident
  = '"' chars:[^"]+ '"' { return chars.join(''); }

single_quoted_ident
  = "'" chars:[^']+ "'" { return chars.join(''); }

backticks_quoted_ident
  = "`" chars:[^`]+ "`" { return chars.join(''); }

column
  = name:column_name !{ return reservedMap[name.toUpperCase()] === true; } { return name; }
  / quoted_ident

column_name
  =  start:ident_start parts:column_part* { return start + parts.join(''); }

ident_name
  =  start:ident_start parts:ident_part* { return start + parts.join(''); }

ident_start = [A-Za-z_]

ident_part  = [A-Za-z0-9_]

// to support column name like `cf1:name` in hbase
column_part  = [A-Za-z0-9_:]

param
  = l:(':' ident_name) {
      return { type: 'param', value: l[1] };
    }

aggr_func
  = aggr_fun_count
  / args_fun_dateformat
  / args_fun_substring
  / aggr_fun_smma
  / args_fun_date

args_fun_substring
 = name:KW_SUBSTRING __ LPAREN __ e:substring_expr __ RPAREN {
   return {
      type: 'aggr_func',
      name: name,
      args: {
        expr: e
      }
   }
 } 

aggr_fun_smma
  = name:KW_SUM_MAX_MIN_AVG  __ LPAREN __ e:additive_expr __ RPAREN {
      return {
        type: 'aggr_func',
        name: name,
        args: {
          expr: e
        }
      };
    }

args_fun_date
  = name:KW_DATE_FN  __ LPAREN __ e:date_fun_expr __ RPAREN {
      return {
        type: 'aggr_func',
        name: name,
        args: {
          expr: e
        }
      };
    }

args_fun_dateformat
  = name:KW_DATE_FORMAT __ LPAREN __ e:date_format_expr __ RPAREN {
      return {
        type: 'aggr_func',
        name: name,
        args: {
          expr: e
        }
      };
    }

KW_DATE_FN
  = KW_DATE_ADD
    / KW_DATE_SUB

KW_SUM_MAX_MIN_AVG
  = KW_SUM / KW_MAX / KW_MIN / KW_AVG

aggr_fun_count
  = name:KW_COUNT __ LPAREN __ arg:count_arg __ RPAREN {
      return {
        type: 'aggr_func',
        name: name,
        args: arg
      };
    }

count_arg
  = e:star_expr { return { expr: e }; }
  / d:KW_DISTINCT? __ c:column_ref { return { distinct: d, expr: c }; }

star_expr
  = "*" { return { type: 'star', value: '*' }; }

func_call
  = name:ident __ LPAREN __ l:expr_list? __ RPAREN {
      return {
        type: 'function',
        name: name,
        args: l ? l: { type: 'expr_list', value: [] }
      };
    }
  / name:scalar_func {
      return {
        type: 'function',
        name: name,
        args: { type: 'expr_list', value: [] }
      };
    }

scalar_func
  = KW_CURRENT_DATE
  / KW_CURRENT_TIME
  / KW_CURRENT_TIMESTAMP
  / KW_CURRENT_USER
  / KW_USER
  / KW_SESSION_USER
  / KW_SYSTEM_USER

cast_expr
  = KW_CAST __ LPAREN __ e:expr __ KW_AS __ t:data_type __ RPAREN {
    return {
      type: 'cast',
      expr: e,
      target: t
    };
  }
  / KW_CAST __ LPAREN __ e:expr __ KW_AS __ s:signedness __ t:KW_INTEGER? __ RPAREN { /* MySQL cast to un-/signed integer */
    return {
      type: 'cast',
      expr: e,
      target: {
        dataType: s + (t ? ' ' + t: '')
      }
    };
  }

signedness
  = KW_SIGNED
  / KW_UNSIGNED

literal
  = literal_string
  / literal_numeric
  / literal_bool
  / literal_null
  / literal_datetime
  / literal_interval
  / literal_datetype

literal_list
  = head:literal tail:(__ COMMA __ literal)* {
      return createList(head, tail);
    }

literal_null
  = KW_NULL {
      return { type: 'null', value: null };
    }
literal_interval
  = KW_INTERVAL {
    return { type: 'interval', value: 'interval' }
  }

literal_datetype
  = value:date_arg_type {
    return { type: 'dateType', value: value }
  }

literal_bool
  = KW_TRUE {
      return { type: 'bool', value: true };
    }
  / KW_FALSE {
      return { type: 'bool', value: false };
    }

literal_string
  = ca:("'" single_char* "'") {
      return {
        type: 'string',
        value: ca[1].join('')
      };
    }

literal_datetime
  = type:(KW_TIME / KW_DATE / KW_TIMESTAMP) __ ca:("'" single_char* "'") {
      return {
        type: type.toLowerCase(),
        value: ca[1].join('')
      };
    }

single_char
  = [^'\\\0-\x1F\x7f]
  / escape_char

escape_char
  = "\\'"  { return "'";  }
  / '\\"'  { return '"';  }
  / "\\\\" { return "\\"; }
  / "\\/"  { return "/";  }
  / "\\b"  { return "\b"; }
  / "\\f"  { return "\f"; }
  / "\\n"  { return "\n"; }
  / "\\r"  { return "\r"; }
  / "\\t"  { return "\t"; }
  / "\\u" h1:hexDigit h2:hexDigit h3:hexDigit h4:hexDigit {
      return String.fromCharCode(parseInt("0x" + h1 + h2 + h3 + h4));
    }

line_terminator
  = [\n\r]

literal_numeric
  = n:number {
      return { type: 'number', value: n };
    }

number
  = int_:int frac:frac exp:exp __ { return parseFloat(int_ + frac + exp); }
  / int_:int frac:frac __         { return parseFloat(int_ + frac); }
  / int_:int exp:exp __           { return parseFloat(int_ + exp); }
  / int_:int __                   { return parseFloat(int_); }

int
  = digit19:digit19 digits:digits { return digit19 + digits; }
  / digit:digit
  / op:("-" / "+" ) digit19:digit19 digits:digits { return "-" + digit19 + digits; }
  / op:("-" / "+" ) digit:digit { return "-" + digit; }

frac
  = "." digits:digits { return "." + digits; }

exp
  = e:e digits:digits { return e + digits; }

digits
  = digits:digit+ { return digits.join(""); }

digit   = [0-9]
digit19 = [1-9]

hexDigit
  = [0-9a-fA-F]

e
  = e:[eE] sign:[+-]? { return e + (sign !== null ? sign: ''); }


KW_NULL     = "NULL"i     !ident_start
KW_TRUE     = "TRUE"i     !ident_start
KW_FALSE    = "FALSE"i    !ident_start

KW_SHOW     = "SHOW"i     !ident_start
KW_DROP     = "DROP"i     !ident_start
KW_SELECT   = "SELECT"i   !ident_start
KW_UPDATE   = "UPDATE"i   !ident_start
KW_CREATE   = "CREATE"i   !ident_start
KW_DELETE   = "DELETE"i   !ident_start
KW_INSERT   = "INSERT"i   !ident_start
KW_REPLACE  = "REPLACE"i  !ident_start
KW_EXPLAIN  = "EXPLAIN"i  !ident_start

KW_INTO     = "INTO"i     !ident_start
KW_FROM     = "FROM"i     !ident_start
KW_SET      = "SET"i      !ident_start

KW_AS       = "AS"i       !ident_start
KW_TABLE    = "TABLE"i    !ident_start

KW_ON       = "ON"i       !ident_start
KW_LEFT     = "LEFT"i     !ident_start
KW_RIGHT    = "RIGHT"i    !ident_start
KW_FULL     = "FULL"i     !ident_start
KW_INNER    = "INNER"i    !ident_start
KW_JOIN     = "JOIN"i     !ident_start
KW_OUTER    = "OUTER"i    !ident_start
KW_UNION    = "UNION"i    !ident_start
KW_VALUES   = "VALUES"i   !ident_start
KW_USING    = "USING"i    !ident_start

KW_WHERE    = "WHERE"i    !ident_start

KW_GROUP    = "GROUP"i    !ident_start
KW_BY       = "BY"i       !ident_start
KW_ORDER    = "ORDER"i    !ident_start
KW_HAVING   = "HAVING"i   !ident_start

KW_LIMIT    = "LIMIT"i    !ident_start

KW_ASC      = "ASC"i      !ident_start { return 'ASC'; }
KW_DESC     = "DESC"i     !ident_start { return 'DESC'; }

KW_ALL      = "ALL"i      !ident_start { return 'ALL'; }
KW_DISTINCT = "DISTINCT"i !ident_start { return 'DISTINCT';}

KW_BETWEEN  = "BETWEEN"i  !ident_start { return 'BETWEEN'; }
KW_IN       = "IN"i       !ident_start { return 'IN'; }
KW_IS       = "IS"i       !ident_start { return 'IS'; }
KW_LIKE     = "LIKE"i     !ident_start { return 'LIKE'; }
KW_EXISTS   = "EXISTS"i   !ident_start { return 'EXISTS'; }

KW_NOT      = "NOT"i      !ident_start { return 'NOT'; }
KW_AND      = "AND"i      !ident_start { return 'AND'; }
KW_OR       = "OR"i       !ident_start { return 'OR'; }

KW_COUNT    = "COUNT"i    !ident_start { return 'COUNT'; }
KW_MAX      = "MAX"i      !ident_start { return 'MAX'; }
KW_MIN      = "MIN"i      !ident_start { return 'MIN'; }
KW_SUM      = "SUM"i      !ident_start { return 'SUM'; }
KW_AVG      = "AVG"i      !ident_start { return 'AVG'; }

KW_CASE     = "CASE"i     !ident_start
KW_WHEN     = "WHEN"i     !ident_start
KW_THEN     = "THEN"i     !ident_start
KW_ELSE     = "ELSE"i     !ident_start
KW_END      = "END"i      !ident_start

KW_CAST     = "CAST"i     !ident_start

KW_CHAR     = "CHAR"i     !ident_start { return 'CHAR'; }
KW_VARCHAR  = "VARCHAR"i  !ident_start { return 'VARCHAR';}
KW_NUMERIC  = "NUMERIC"i  !ident_start { return 'NUMERIC'; }
KW_DECIMAL  = "DECIMAL"i  !ident_start { return 'DECIMAL'; }
KW_SIGNED   = "SIGNED"i   !ident_start { return 'SIGNED'; }
KW_UNSIGNED = "UNSIGNED"i !ident_start { return 'UNSIGNED'; }
KW_INT      = "INT"i      !ident_start { return 'INT'; }
KW_INTEGER  = "INTEGER"i  !ident_start { return 'INTEGER'; }
KW_SMALLINT = "SMALLINT"i !ident_start { return 'SMALLINT'; }
KW_DATE     = "DATE"i     !ident_start { return 'DATE'; }
KW_TIME     = "TIME"i     !ident_start { return 'TIME'; }
KW_TIMESTAMP= "TIMESTAMP"i!ident_start { return 'TIMESTAMP'; }
KW_USER     = "USER"i     !ident_start { return 'USER'; }

KW_CURRENT_DATE     = "CURRENT_DATE"i !ident_start { return 'CURRENT_DATE'; }
KW_CURRENT_TIME     = "CURRENT_TIME"i !ident_start { return 'CURRENT_TIME'; }
KW_CURRENT_TIMESTAMP= "CURRENT_TIMESTAMP"i !ident_start { return 'CURRENT_TIMESTAMP'; }
KW_CURRENT_USER     = "CURRENT_USER"i !ident_start { return 'CURRENT_USER'; }
KW_SESSION_USER     = "SESSION_USER"i !ident_start { return 'SESSION_USER'; }
KW_SYSTEM_USER      = "SYSTEM_USER"i !ident_start { return 'SYSTEM_USER'; }

KW_SUBSTRING        = "SUBSTRING"i !ident_start { return 'SUBSTRING'; }
KW_DATE_FORMAT      = "DATE_FORMAT"i !ident_start { return 'DATE_FORMAT'; }
KW_DATE_ADD         = "DATE_ADD"i !ident_start { return 'DATE_ADD'; }
KW_DATE_SUB         = "DATE_SUB"i !ident_start { return 'DATE_SUB'; }
KW_SECOND           = "SECOND"i !ident_start { return 'SECOND'; }
KW_MINUTE           = "MINUTE"i !ident_start { return 'MINUTE'; }
KW_HOUR             = "HOUR"i !ident_start { return 'HOUR'; }
KW_DAY              = "DAY"i !ident_start { return 'DAY'; }
KW_WEEK             = "WEEK"i !ident_start { return 'WEEK'; }
KW_MONTH            = "MONTH"i !ident_start { return 'MONTH'; }
KW_QUARTER          = "QUARTER"i !ident_start { return 'QUARTER'; }
KW_YEAR             = "YEAR"i !ident_start { return 'YEAR'; }
KW_SECOND_MICROSECOND      = "SECOND_MICROSECOND"i !ident_start { return 'SECOND_MICROSECOND'; }
KW_MINUTE_MICROSECOND      = "MINUTE_MICROSECOND"i !ident_start { return 'MINUTE_MICROSECOND'; }
KW_MINUTE_SECOND      = "MINUTE_SECOND"i !ident_start { return 'MINUTE_SECOND'; }
KW_HOUR_MICROSECOND   = "HOUR_MICROSECOND"i !ident_start { return 'HOUR_MICROSECOND'; }
KW_HOUR_SECOND      = "HOUR_SECOND"i !ident_start { return 'HOUR_SECOND'; }
KW_HOUR_MINUTE      = "HOUR_MINUTE"i !ident_start { return 'HOUR_MINUTE'; }
KW_DAY_MICROSECOND      = "DAY_MICROSECOND"i !ident_start { return 'DAY_MICROSECOND'; }
KW_DAY_SECOND      = "DAY_SECOND"i !ident_start { return 'DAY_SECOND'; }
KW_DAY_MINUTE      = "DAY_MINUTE"i !ident_start { return 'DAY_MINUTE'; }
KW_DAY_HOUR        = "DAY_HOUR"i !ident_start { return 'DAY_HOUR'; }
KW_YEAR_MONTH      = "YEAR_MONTH"i !ident_start { return 'YEAR_MONTH'; }
 
KW_INTERVAL      = "INTERVAL"i !ident_start { return 'INTERVAL'; }

KW_VAR_PRE = '$'
KW_RETURN = 'return'i
KW_ASSIGN = ':='

KW_DUAL = "DUAL"

// MySQL extensions to SQL
OPT_SQL_CALC_FOUND_ROWS = "SQL_CALC_FOUND_ROWS"i
OPT_SQL_CACHE           = "SQL_CACHE"i
OPT_SQL_NO_CACHE        = "SQL_NO_CACHE"i
OPT_SQL_SMALL_RESULT    = "SQL_SMALL_RESULT"i
OPT_SQL_BIG_RESULT      = "SQL_BIG_RESULT"i
OPT_SQL_BUFFER_RESULT   = "SQL_BUFFER_RESULT"i

//special character
DOT       = '.'
COMMA     = ','
STAR      = '*'
LPAREN    = '('
RPAREN    = ')'

LBRAKE    = '['
RBRAKE    = ']'

// separator
__
  = (whitespace / comment)*

comment
  = block_comment
  / line_comment

block_comment
  = "/*" (!"*/" char)* "*/"

line_comment
  = "--" (!EOL char)*

char = .

whitespace =
  [ \t\n\r]

EOL
  = EOF
  / [\n\r]+

EOF = !.

//begin procedure extension
proc_stmts
  = proc_stmt*

proc_stmt
  = &{ varList = []; return true; } __ s:(assign_stmt / return_stmt) {
      return { stmt: s, vars: varList };
    }

assign_stmt
  = va:var_decl __ KW_ASSIGN __ e:proc_expr {
    return {
      type: 'assign',
      left: va,
      right: e
    };
  }

return_stmt
  = KW_RETURN __ e:proc_expr {
      return { type: 'return', expr: e };
    }

proc_expr
  = select_stmt
  / proc_join
  / proc_additive_expr
  / proc_array

proc_additive_expr
  = head:proc_multiplicative_expr
    tail:(__ additive_operator  __ proc_multiplicative_expr)* {
      return createBinaryExprChain(head, tail);
    }

proc_multiplicative_expr
  = head:proc_primary
    tail:(__ multiplicative_operator  __ proc_primary)* {
      return createBinaryExprChain(head, tail);
    }

proc_join
  = lt:var_decl __ op:join_op  __ rt:var_decl __ expr:on_clause {
      return {
        type: 'join',
        ltable: lt,
        rtable: rt,
        op: op,
        on: expr
      };
    }

proc_primary
  = literal
  / var_decl
  / proc_func_call
  / param
  / LPAREN __ e:proc_additive_expr __ RPAREN {
      e.parentheses = true;
      return e;
    }

proc_func_call
  = name:ident __ LPAREN __ l:proc_primary_list __ RPAREN {
      //compatible with original func_call
      return {
        type: 'function',
        name: name,
        args: {
          type: 'expr_list',
          value: l
        }
      };
    }

proc_primary_list
  = head:proc_primary tail:(__ COMMA __ proc_primary)* {
      return createList(head, tail);
    }

proc_array =
  LBRAKE __ l:proc_primary_list __ RBRAKE {
    return { type: 'array', value: l };
  }

var_decl
  = KW_VAR_PRE name:ident_name m:mem_chain {
    //push for analysis
    varList.push(name);
    return {
      type: 'var',
      name: name,
      members: m
    };
  }

mem_chain
  = l:('.' ident_name)* {
    var s = [];
    for (var i = 0; i < l.length; i++) {
      s.push(l[i][1]);
    }
    return s;
  }

data_type
  = character_string_type
  / numeric_type
  / datetime_type

character_string_type
  = t:(KW_CHAR / KW_VARCHAR) __ LPAREN __ l:[0-9]+ __ RPAREN __ {
    return { dataType: t, length: parseInt(l.join(''), 10) };
  }
  / t:KW_CHAR { return { dataType: t }; }
  / t:KW_VARCHAR { return { dataType: t }; }

numeric_type
  = t:(KW_NUMERIC / KW_DECIMAL / KW_INT / KW_INTEGER / KW_SMALLINT) { return { dataType: t }; }

datetime_type
  = t:(KW_DATE / KW_TIME / KW_TIMESTAMP) { return { dataType: t }; }


quoted_list
  = "'" / "`" / '"'

quoted_arg
  = quoted_list ca:date_operator_list quoted_list {
      return {
        type: 'string',
        value: ca.join('').replace(/,/g, '')
      }
    }


date_arg_type
  = KW_SECOND
    / KW_MINUTE
    / KW_HOUR
    / KW_DAY
    / KW_WEEK
    / KW_MONTH
    / KW_QUARTER
    / KW_YEAR
    / KW_SECOND_MICROSECOND
    / KW_MINUTE_MICROSECOND
    / KW_MINUTE_SECOND
    / KW_HOUR_MICROSECOND
    / KW_HOUR_SECOND
    / KW_HOUR_MINUTE
    / KW_DAY_MICROSECOND
    / KW_DAY_SECOND
    / KW_DAY_MINUTE
    / KW_DAY_HOUR
    / KW_YEAR_MONTH

date_operator_list
  = date_operator*

date_operator
  = "%" [a-zA-Z] "-"?