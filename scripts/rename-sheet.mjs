import { google } from 'googleapis';
import { readFileSync } from 'fs';

const credentials = JSON.parse(readFileSync('/home/firefly/.hermes/google-credentials/qr-menu-api.json', 'utf8'));

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const service = google.sheets({ version: 'v4', auth });

const spreadsheetId = '1_97sZm46nIe-sfUtPFV4ljj2W8djHyvpWcRymgBFIFA';

// Rename the spreadsheet
await service.spreadsheets.values.batchUpdate({
  spreadsheetId,
  resource: {
    requests: [{
      updateSpreadsheetProperties: {
        properties: { title: 'Cafe Aurora Menu' },
        fields: 'title',
      },
    }],
  },
});

console.log('✅ Sheet renamed to "Cafe Aurora Menu"');
console.log('🌐 Sheet URL: https://docs.google.com/spreadsheets/d/' + spreadsheetId);
console.log('📤 Publish URL: https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/export?format=csv');
