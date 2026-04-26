import { google } from 'googleapis';
import { readFileSync } from 'fs';

const credentials = JSON.parse(readFileSync('/home/firefly/.hermes/google-credentials/qr-menu-api.json', 'utf8'));

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Test: List spreadsheets
const res = await sheets.spreadsheets.get({});
console.log('✅ Google Sheets API connected!');
console.log('📋 Found', res.data.spreadsheets?.length || 0, 'spreadsheets');
