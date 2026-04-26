import { google } from 'googleapis';
import { readFileSync } from 'fs';

const creds = JSON.parse(readFileSync('/home/firefly/.hermes/google-credentials/qr-menu-api.json'));
const SPREADSHEET_ID = '1uQx2IHul_2VDEVg4Hm9WNPJ1clTnQVxJvv9n1LcQzP4';

const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

try {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A1:E5',
  });
  console.log('Current sheet data (first 5 rows):');
  console.log(JSON.stringify(res.data.values, null, 2));
} catch (err) {
  console.error('Error:', err.message);
}
