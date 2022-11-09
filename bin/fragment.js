const fs = require('fs')
const path = require('path')

const r = p => path.resolve(__dirname, p)

let result = fs.readFileSync(r('./data.json'))
result = JSON.parse(result)

const filteredData = result.data.__schema.types.filter(type => type.possibleTypes !== null)

result.data.__schema.types = filteredData

fs.writeFile(r('../src/client/fragmentTypes.json'), JSON.stringify(result.data), (err) => {
  if (err) {
    console.error('Error writing fragmentTypes file', err)
  } else {
    console.log('Fragment types successfully extracted!')
  }
})
