import { google } from 'googleapis';
import { readFileSync } from 'fs';

const credentials = JSON.parse(readFileSync('/home/firefly/.hermes/google-credentials/qr-menu-api.json', 'utf8'));

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const service = google.sheets({ version: 'v4', auth });

// Create a new spreadsheet
const createRes = await service.spreadsheets.create({
  resource: {
    properties: {
      title: 'QR Menu Test - Cafe Aurora',
    },
  },
});

console.log('✅ Spreadsheet created!');
console.log('🔗 Spreadsheet ID:', createRes.data.spreadsheetId);
console.log('🌐 URL: https://docs.google.com/spreadsheets/d/' + createRes.data.spreadsheetId);
