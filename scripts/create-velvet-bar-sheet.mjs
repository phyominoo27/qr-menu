import { google } from 'googleapis';
import { readFileSync } from 'fs';

const credentials = JSON.parse(readFileSync('/home/firefly/.hermes/google-credentials/qr-menu-api.json', 'utf8'));

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const service = google.sheets({ version: 'v4', auth });

// Create a new spreadsheet for Velvet Bar
const createRes = await service.spreadsheets.create({
  resource: {
    properties: {
      title: 'Velvet Bar Menu',
    },
  },
});

const spreadsheetId = createRes.data.spreadsheetId;
console.log('✅ Spreadsheet created!');
console.log('🔗 Spreadsheet ID:', spreadsheetId);
console.log('🌐 URL: https://docs.google.com/spreadsheets/d/' + spreadsheetId);

// Fill with Velvet Bar data
const res = await service.spreadsheets.values.update({
  spreadsheetId,
  range: 'Sheet1!A1',
  resource: {
    values: [
      // Config rows
      ['type', 'key', 'value'],
      ['config', 'shop_name', 'Velvet Bar'],
      ['config', 'template', 'without-images'],
      ['config', 'theme_bg', '#0D0D0D'],
      ['config', 'theme_accent', '#C9A84C'],
      ['config', 'theme_accent_light', '#2A2418'],
      ['config', 'theme_text', '#B0A090'],
      ['config', 'theme_text_muted', '#AAAAAA'],
      ['config', 'theme_header', '#0A0A0A'],
      ['config', 'theme_header_text', '#C9A84C'],
      ['config', 'theme_card_bg', '#1A1A1A'],
      ['config', 'theme_card_border', '#2A2A2A'],
      ['config', 'currency', 'K'],
      ['config', 'currency_position', 'after'],
      ['config', 'tagline', 'Craft cocktails & fine spirits'],
      // Item header
      ['type', 'name', 'description', 'price', 'image', 'category'],
      // Signature Cocktails
      ['item', 'Velvet Old Fashioned', 'Bourbon, bitters, sugar, orange peel, cherry', '12000', '', 'Signature Cocktails'],
      ['item', 'Smoky Margarita', 'Tequila, mezcal, lime, agave, smoked salt', '11000', '', 'Signature Cocktails'],
      ['item', 'Midnight Negroni', 'Gin, Campari, sweet vermouth, black walnut bitters', '10000', '', 'Signature Cocktails'],
      ['item', 'Golden Espresso Martini', 'Vodka, Kahlúa, espresso, vanilla', '13000', '', 'Signature Cocktails'],
      ['item', 'Velvet Mule', 'Vodka, ginger beer, lime, cucumber', '9500', '', 'Signature Cocktails'],
      // Classic Cocktails
      ['item', 'Mojito', 'White rum, mint, lime, sugar, soda', '8000', '', 'Classic Cocktails'],
      ['item', 'Daiquiri', 'White rum, lime juice, simple syrup', '8000', '', 'Classic Cocktails'],
      ['item', 'Whiskey Sour', 'Bourbon, lemon juice, simple syrup, egg white', '9000', '', 'Classic Cocktails'],
      ['item', 'Manhattan', 'Rye whiskey, sweet vermouth, bitters', '10000', '', 'Classic Cocktails'],
      ['item', 'Long Island Iced Tea', 'Vodka, gin, rum, tequila, triple sec, lemon, coke', '12000', '', 'Classic Cocktails'],
      // Whisky
      ['item', 'Chivas Regal 12yr', 'Single malt Scotch whisky', '15000', '', 'Whisky'],
      ['item', 'Glenfiddich 15yr', 'Single malt Scotch whisky', '18000', '', 'Whisky'],
      ['item', 'Jameson', 'Irish whiskey', '9000', '', 'Whisky'],
      ['item', 'Jack Daniel\'s', 'Tennessee whiskey', '10000', '', 'Whisky'],
      // Cognac
      ['item', 'Hennessy VS', 'Fine champagne cognac', '14000', '', 'Cognac'],
      ['item', 'Remy Martin VSOP', 'Fine champagne cognac', '16000', '', 'Cognac'],
      ['item', 'Courvoisier Napoleon', 'Premium cognac', '18000', '', 'Cognac'],
      // Bar Bites
      ['item', 'Truffle Fries', 'Crispy fries with truffle oil and parmesan', '7000', '', 'Bar Bites'],
      ['item', 'Loaded Nachos', 'Tortilla chips, cheese, jalapeños, guacamole, sour cream', '9000', '', 'Bar Bites'],
      ['item', 'Chicken Wings (6pcs)', 'Crispy wings with your choice of sauce', '8000', '', 'Bar Bites'],
      ['item', 'Cheese Platter', 'Selection of imported cheeses with crackers', '12000', '', 'Bar Bites'],
      ['item', 'Marinated Olives', 'Mixed olives with herbs and olive oil', '5000', '', 'Bar Bites'],
      // Special
      ['item', 'Shisha (1 flavor)', 'Choose from: apple, mint, grape, strawberry', '15000', '', 'Special'],
      ['item', 'Premium Shisha', 'Choice of premium shisha flavors', '25000', '', 'Special'],
    ],
  },
  valueInputOption: 'RAW',
});

console.log('✅ Sheet filled with', res.data.updatedCells, 'cells!');
console.log('\n📋 Next steps:');
console.log('1. Share the sheet with: qr-menu-editor@qr-menu-api-494512.iam.gserviceaccount.com (Viewer access)');
console.log('2. Publish to web: File → Share → Publish to web → CSV');
console.log('3. Tell me "done" and I\'ll update shops.json and redeploy!');
