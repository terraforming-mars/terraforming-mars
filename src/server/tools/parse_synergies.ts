// Parses .csv file and extracts synergies, converting to a JSON object and writing to synergies.json

require('dotenv').config();

import * as fs from 'fs';
import * as path from 'path';
import {milestoneNames} from '../../common/ma/MilestoneName';
import {awardNames} from '../../common/ma/AwardName';

const projectRoot = '.';
// Change to match actual CSV file name.
const csvPath = path.join(projectRoot, 'synergy78.csv');
const jsonPath = path.join(projectRoot, 'src/server/ma/synergies.json');

const validNames = new Set([...milestoneNames, ...awardNames]);

console.log(`Found ${validNames.size} valid names.`);

const renames: Record<string, string> = {
  'Edgelord': 'Excavator',
  'Metallurgist': 'Smith',
  'Philanthropist': 'Philantropist',
  'Suburbian': 'Edgedancer',
  'Merchant': 'Trader',
};

function cleanName(name: string): string {
  const cleanedName = name.replace(/[*"]/g, '').trim().replace(/\s+/g, ' ');
  return renames[cleanedName] || cleanedName;
}

function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i++;
        } else {
          // End of quote
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\r') {
        // Handle CRLF or CR
        if (nextChar === '\n') {
          i++;
        }
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  // Push the last field/row if exists
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

const synergies: Record<string, number> = {};

try {
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCsv(csvData);

  console.log(`Parsed ${rows.length} rows.`);

  if (rows.length < 4) {
    console.error('CSV too short');
    process.exit(1);
  }

  // Row 2 (index 2) is the header row containing names
  const headerRow = rows[2];
  const colIndexToName: Record<number, string> = {};

  // Debug header row
  // console.log('Header row:', headerRow);

  for (let i = 4; i < headerRow.length; i++) {
    const name = cleanName(headerRow[i]);
    if (name && validNames.has(name as any)) {
      colIndexToName[i] = name;
    }
  }

  console.log(`Mapped ${Object.keys(colIndexToName).length} columns.`);

  for (let rowIdx = 3; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx];
    if (row.length < 3) continue;

    const rowNameRaw = row[2];
    if (!rowNameRaw || !rowNameRaw.trim()) continue;

    const rowName = cleanName(rowNameRaw);
    if (!validNames.has(rowName as any)) continue;

    for (let colIdx = 4; colIdx < row.length; colIdx++) {
      if (!colIndexToName[colIdx]) continue;

      const colName = colIndexToName[colIdx];
      if (rowName === colName) continue;

      const valStr = row[colIdx]?.trim();
      if (!valStr || valStr.toLowerCase() === 'nan') continue;

      const val = parseFloat(valStr);
      if (val > 0) {
        const pair = [rowName, colName].sort().join('|');
        synergies[pair] = Math.max(synergies[pair] || 0, val);
      }
    }
  }

  console.log(`Found ${Object.keys(synergies).length} synergies.`);

  const sortedSynergies = Object.entries(synergies).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });

  const outputData = sortedSynergies.map(([pair, weight]) => {
    const [name1, name2] = pair.split('|');
    return [name1, name2, weight];
  });

  fs.writeFileSync(jsonPath, JSON.stringify(outputData, null, 2), 'utf-8');
  console.log(`Successfully wrote ${jsonPath}`);
} catch (e) {
  console.error('Error processing CSV:', e);
  process.exit(1);
}
