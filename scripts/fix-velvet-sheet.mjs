import { google } from 'googleapis';
import { readFileSync } from 'fs';

const creds = JSON.parse(readFileSync('/home/firefly/.hermes/google-credentials/qr-menu-api.json'));
const SPREADSHEET_ID = '1uQx2IHul_2VDEVg4Hm9WNPJ1clTnQVxJvv9n1LcQzP4';

const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Correct format: category | name | description | price | image
const velvetBarItems = [
  ['category', 'name', 'description', 'price', 'image'],
  ['Whiskies', 'Johnnie Walker Black Label', '12-year blended Scotch whisky', '12', ''],
  ['Whiskies', 'Glenfiddich 15 Year', 'Single malt Scotch, rich fruit and oak', '18', ''],
  ['Whiskies', 'Jameson Irish Whiskey', 'Triple-distilled Irish whiskey', '9', ''],
  ['Whiskies', 'Maker\'s Mark Bourbon', 'Kentucky straight bourbon whiskey', '11', ''],
  ['Whiskies', 'Woodford Reserve', 'Artisan bourbon with complex flavor', '14', ''],
  ['Cocktails', 'Velvet Martini', 'Vodka, white crème de cacao, cream', '15', ''],
  ['Cocktails', 'Old Fashioned', 'Bourbon, bitters, sugar, orange zest', '14', ''],
  ['Cocktails', 'Espresso Martini', 'Vodka, fresh espresso, coffee liqueur', '15', ''],
  ['Cocktails', 'Mojito', 'White rum, mint, lime, sugar, soda', '12', ''],
  ['Cocktails', 'Negroni', 'Gin, Campari, sweet vermouth', '13', ''],
  ['Gins', 'Tanqueray London Dry', 'Classic dry gin with juniper', '10', ''],
  ['Gins', 'Hendrick\'s Gin', 'Scottish gin with cucumber & rose', '12', ''],
  ['Gins', 'Bombay Sapphire', 'Aromatic gin with 10 botanicals', '10', ''],
  ['Gins', 'Monkey 47', 'Craft gin from the Black Forest', '16', ''],
  ['Tequilas', 'Patrón Silver', '100% agave silver tequila', '12', ''],
  ['Tequilas', 'Don Julio Anejo', 'Aged 18 months, rich and smooth', '16', ''],
  ['Mocktails', 'Virgin Mojito', 'Mint, lime, sugar, soda — no alcohol', '7', ''],
  ['Mocktails', 'No-Tini', 'Seedlip Grove, citrus, tonic', '8', ''],
  ['Wines', 'Cabernet Sauvignon', 'Full-bodied red wine', '10', ''],
  ['Wines', 'Chardonnay', 'Dry white wine', '9', ''],
  ['Wines', 'Prosecco', 'Italian sparkling wine', '8', ''],
  ['Beers', 'Heineken Lager', 'Dutch pale lager beer', '7', ''],
  ['Beers', 'IPA Craft Beer', 'India pale ale with citrus notes', '9', ''],
  ['Beers', 'Corona Extra', 'Mexican pale lager', '7', ''],
];

try {
  // Clear entire sheet
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A1:Z100',
  });

  // Write correct data
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A1',
    valueInputOption: 'RAW',
    resource: { values: velvetBarItems },
  });

  console.log('✅ Velvet Bar sheet fixed with correct format!');
  console.log(`   ${velvetBarItems.length - 1} items written`);
} catch (err) {
  console.error('❌ Error:', err.message);
}
