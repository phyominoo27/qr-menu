import XLSX from 'xlsx';

// ============ CAFE AURORA DATA ============
const cafeAuroraItems = [
  // Coffee & Tea
  ['Coffee & Tea', 'Espresso', 'Rich and bold single shot', '2.50', 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400'],
  ['Coffee & Tea', 'Cappuccino', 'Espresso with steamed milk foam', '4.00', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400'],
  ['Coffee & Tea', 'Latte', 'Espresso with steamed milk', '4.50', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'],
  ['Coffee & Tea', 'Cold Brew', 'Smooth cold-steeped coffee', '5.00', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'],
  ['Coffee & Tea', 'Matcha Latte', 'Japanese green tea with milk', '5.50', 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400'],
  ['Coffee & Tea', 'Earl Grey Tea', 'Classic bergamot-infused black tea', '3.50', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400'],

  // Light Bites
  ['Light Bites', 'Avocado Toast', 'Smashed avocado on sourdough', '8.00', 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400'],
  ['Light Bites', 'Croissant', 'Buttery French pastry', '4.00', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'],
  ['Light Bites', 'Greek Salad', 'Feta, olives, cucumber, tomato', '9.00', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400'],

  // Main Dishes
  ['Main Dishes', 'Spaghetti Carbonara', 'Creamy egg, pancetta, parmesan', '14.00', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400'],
  ['Main Dishes', 'Grilled Salmon', 'Atlantic salmon with herbs', '18.00', 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400'],
  ['Main Dishes', 'Mushroom Risotto', 'Creamy arborio rice with mushrooms', '13.00', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400'],
  ['Main Dishes', 'Beef Burger', 'Angus beef, cheese, fries', '15.00', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'],
  ['Main Dishes', 'Chicken Caesar Salad', 'Romaine, grilled chicken, caesar', '12.00', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400'],

  // Desserts
  ['Desserts', 'Tiramisu', 'Coffee-soaked ladyfingers, mascarpone', '7.00', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400'],
  ['Desserts', 'Chocolate Lava Cake', 'Warm molten chocolate cake', '8.00', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400'],
];

// ============ VELVET BAR DATA ============
const velvetBarItems = [
  // Whiskies
  ['Whiskies', 'Johnnie Walker Black Label', '12-year blended Scotch whisky', '12', ''],
  ['Whiskies', 'Glenfiddich 15 Year', 'Single malt Scotch, rich fruit and oak', '18', ''],
  ['Whiskies', 'Jameson Irish Whiskey', 'Triple-distilled Irish whiskey', '9', ''],
  ['Whiskies', 'Maker\'s Mark Bourbon', 'Kentucky straight bourbon whiskey', '11', ''],
  ['Whiskies', 'Woodford Reserve', 'Artisan bourbon with complex flavor', '14', ''],

  // Cocktails
  ['Cocktails', 'Velvet Martini', 'Vodka, white crème de cacao, cream', '15', ''],
  ['Cocktails', 'Old Fashioned', 'Bourbon, bitters, sugar, orange zest', '14', ''],
  ['Cocktails', 'Espresso Martini', 'Vodka, fresh espresso, coffee liqueur', '15', ''],
  ['Cocktails', 'Mojito', 'White rum, mint, lime, sugar, soda', '12', ''],
  ['Cocktails', 'Negroni', 'Gin, Campari, sweet vermouth', '13', ''],

  // Gins
  ['Gins', 'Tanqueray London Dry', 'Classic dry gin with juniper', '10', ''],
  ['Gins', 'Hendrick\'s Gin', 'Scottish gin with cucumber & rose', '12', ''],
  ['Gins', 'Bombay Sapphire', 'Aromatic gin with 10 botanicals', '10', ''],
  ['Gins', 'Monkey 47', 'Craft gin from the Black Forest', '16', ''],

  // Tequilas
  ['Tequilas', 'Patrón Silver', '100% agave silver tequila', '12', ''],
  ['Tequilas', 'Don Julio Anejo', 'Aged 18 months, rich and smooth', '16', ''],

  // Mocktails
  ['Mocktails', 'Virgin Mojito', 'Mint, lime, sugar, soda — no alcohol', '7', ''],
  ['Mocktails', 'No-Tini', 'Seedlip Grove, citrus, tonic', '8', ''],

  // Wines
  ['Wines', 'Cabernet Sauvignon', 'Full-bodied red wine', '10', ''],
  ['Wines', 'Chardonnay', 'Dry white wine', '9', ''],
  ['Wines', 'Prosecco', 'Italian sparkling wine', '8', ''],

  // Beers
  ['Beers', 'Heineken Lager', 'Dutch pale lager beer', '7', ''],
  ['Beers', 'IPA Craft Beer', 'India pale ale with citrus notes', '9', ''],
  ['Beers', 'Corona Extra', 'Mexican pale lager', '7', ''],
];

// ============ BUILD WORKBOOK ============
const wb = XLSX.utils.book_new();

// --- Sheet 1: Cafe Aurora ---
const cafeHeader = [['category', 'name', 'description', 'price (USD)', 'image_url']];
const cafeAllRows = [...cafeHeader, ...cafeAuroraItems];
const cafeWs = XLSX.utils.aoa_to_sheet(cafeAllRows);
cafeWs['!cols'] = [
  { wch: 20 }, { wch: 30 }, { wch: 40 }, { wch: 12 }, { wch: 60 }
];
XLSX.utils.book_append_sheet(wb, cafeWs, 'Cafe Aurora');

// --- Sheet 2: Velvet Bar ---
const velvetHeader = [['category', 'name', 'description', 'price (USD)', 'image_url']];
const velvetAllRows = [...velvetHeader, ...velvetBarItems];
const velvetWs = XLSX.utils.aoa_to_sheet(velvetAllRows);
velvetWs['!cols'] = [
  { wch: 20 }, { wch: 30 }, { wch: 40 }, { wch: 12 }, { wch: 60 }
];
XLSX.utils.book_append_sheet(wb, velvetWs, 'Velvet Bar');

// --- Sheet 3: Instructions ---
const instructions = [
  ['QR MENU — GOOGLE SHEET SETUP GUIDE'],
  [''],
  ['📋 FORMAT RULES:'],
  ['• Row 1 = Header (do not change)'],
  ['• Row 2 onwards = Your menu items'],
  ['• Column A: category — e.g. "Coffee & Tea", "Main Dishes"'],
  ['• Column B: name — item name'],
  ['• Column C: description — short description'],
  ['• Column D: price — number only (e.g. 12.50)'],
  ['• Column E: image_url — full URL to image (or leave blank)'],
  [''],
  ['🖼️ IMAGE TIPS:'],
  ['• Use imgbb.com or similar to upload photos'],
  ['• Or leave blank — items will show without images'],
  ['• Recommended size: 400x400px minimum'],
  [''],
  ['🔗 GOOGLE SHEETS SETUP:'],
  ['1. Copy the data from this Excel file into a new Google Sheet'],
  ['2. Share the sheet with: qr-menu-editor@qr-menu-api-494512.iam.gserviceaccount.com (Reader)'],
  ['3. Get the sheet URL and share it with us to deploy'],
  [''],
  ['📱 PREVIEW:'],
  ['Cafe Aurora: https://qr-menu-opal.vercel.app/?shop=cafe-aurora'],
  ['Velvet Bar: https://qr-menu-opal.vercel.app/?shop=velvet-bar'],
];
const instrWs = XLSX.utils.aoa_to_sheet(instructions);
instrWs['!cols'] = [{ wch: 70 }];
XLSX.utils.book_append_sheet(wb, instrWs, '📖 Instructions');

XLSX.writeFile(wb, '/home/firefly/qr-menu/QR-Menu-Template.xlsx');
console.log('✅ Excel file created: /home/firefly/qr-menu/QR-Menu-Template.xlsx');
console.log('   • Sheet 1: Cafe Aurora (15 items)');
console.log('   • Sheet 2: Velvet Bar (24 items)');
console.log('   • Sheet 3: Setup Instructions');
