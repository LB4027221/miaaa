const peg = require('pegjs')
const fs = require('fs')
const path = require('path')

const r = p => path.resolve(__dirname, p)

const ast = fs.readFileSync(r('./ast.pegjs'))

const parser = peg.generate(ast)

module.exports = parser
