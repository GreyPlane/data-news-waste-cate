const XLSX = require('xlsx');
const fs = require('fs');

const fileName = process.argv[2];
console.log(fileName);
const workbook = XLSX.readFile(fileName);
const json = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1);
fs.writeFileSync(`${fileName}.json`, JSON.stringify(json));
