import { google } from 'googleapis';
import { readFileSync } from 'fs';

const credentials = JSON.parse(readFileSync('/home/firefly/.hermes/google-credentials/qr-menu-api.json', 'utf8'));

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const service = google.sheets({ version: 'v4', auth });

const spreadsheetId = '1_97sZm46nIe-sfUtPFV4ljj2W8djHyvpWcRymgBFIFA';

// Clear the default sheet and write Cafe Aurora data
const res = await service.spreadsheets.values.update({
  spreadsheetId,
  range: 'Sheet1!A1',
  resource: {
    values: [
      // Config rows
      ['type', 'key', 'value'],
      ['config', 'shop_name', 'Cafe Aurora'],
      ['config', 'template', 'with-images'],
      ['config', 'theme_bg', '#FAFAFA'],
      ['config', 'theme_accent', '#E85A2C'],
      ['config', 'theme_text', '#2D2D2D'],
      ['config', 'theme_header', '#1A1A1A'],
      ['config', 'theme_header_text', '#FFFFFF'],
      ['config', 'currency', 'K'],
      ['config', 'currency_position', 'after'],
      ['config', 'tagline', 'Premium coffee & brunch'],
      // Item header
      ['type', 'name', 'description', 'price', 'image', 'category'],
      // Menu items
      ['item', 'Espresso', 'Rich and bold single shot espresso', '2500', 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400', 'Coffee'],
      ['item', 'Cappuccino', 'Espresso with steamed milk and foam', '3500', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', 'Coffee'],
      ['item', 'Latte', 'Smooth espresso with velvety steamed milk', '3800', 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400', 'Coffee'],
      ['item', 'Americano', 'Espresso diluted with hot water', '2800', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400', 'Coffee'],
      ['item', 'Mocha', 'Chocolate espresso with steamed milk', '4000', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc87?w=400', 'Coffee'],
      ['item', 'Matcha Latte', 'Japanese green tea with steamed milk', '4500', 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400', 'Specialty Drinks'],
      ['item', 'Cold Brew', 'Slow-steeped for 12 hours', '4000', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', 'Cold Drinks'],
      ['item', 'Avocado Toast', 'Smashed avocado on sourdough with cherry tomatoes', '6500', 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400', 'Brunch'],
      ['item', 'Eggs Benedict', 'Poached eggs with hollandaise on English muffin', '8500', 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400', 'Brunch'],
      ['item', 'Croissant Sandwich', 'Buttery croissant with ham and gruyere', '7500', 'https://images.unsplash.com/photo-1623334044303-241021148842?w=400', 'Brunch'],
      ['item', 'Caesar Salad', 'Romaine, parmesan, croutons, caesar dressing', '6000', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400', 'Salads'],
      ['item', 'Greek Salad', 'Feta, olives, cucumber, tomatoes, onions', '6500', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400', 'Salads'],
      ['item', 'Tiramisu', 'Classic Italian coffee-flavored dessert', '5500', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', 'Desserts'],
      ['item', 'Chocolate Cake', 'Rich dark chocolate layer cake', '5000', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', 'Desserts'],
      ['item', 'Cheesecake', 'New York style creamy cheesecake', '5500', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400', 'Desserts'],
    ],
  },
  valueInputOption: 'RAW',
});

console.log('✅ Sheet updated!');
console.log('Cells updated:', res.data.updatedCells);

// Now get the spreadsheet to check it
const getRes = await service.spreadsheets.get({
  spreadsheetId,
  includeGridData: false,
});

console.log('📋 Sheet title:', getRes.data.properties?.title);
console.log('🔢 Sheets:', getRes.data.sheets?.map(s => s.properties?.title));
