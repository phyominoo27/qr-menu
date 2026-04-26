import { google } from 'googleapis';
import fetch from 'node-fetch';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const creds = JSON.parse(readFileSync('/home/firefly/.hermes/google-credentials/qr-menu-api.json'));

const BASE_URL = 'https://qr-menu-opal.vercel.app';

// QR code API - using goqr.me (free, no API key needed)
async function generateQR(text, size = 400) {
    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=${size}x${size}&margin=10&format=png`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`QR API error: ${response.status}`);
    return response.buffer();
}

const shops = [
    {
        id: 'cafe-aurora',
        name: 'Cafe Aurora',
        sheet_id: '1_97sZm46nIe-sfUtPFV4ljj2W8djHyvpWcRymgBFIFA',
        menu_url: `${BASE_URL}/?shop=cafe-aurora`
    },
    {
        id: 'velvet-bar',
        name: 'Velvet Bar',
        sheet_id: '1uQx2IHul_2VDEVg4Hm9WNPJ1clTnQVxJvv9n1LcQzP4',
        menu_url: `${BASE_URL}/?shop=velvet-bar`
    }
];

const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Save QR images locally first
const qrDir = path.join(__dirname, '..', 'qrcodes');
import { mkdirSync } from 'fs';
mkdirSync(qrDir, { recursive: true });

console.log('🖼️ Generating QR codes...\n');

for (const shop of shops) {
    console.log(`📦 ${shop.name}:`);
    console.log(`   URL: ${shop.menu_url}`);

    // Generate QR code
    const qrBuffer = await generateQR(shop.menu_url, 400);
    const qrPath = path.join(qrDir, `${shop.id}-qr.png`);
    writeFileSync(qrPath, qrBuffer);
    console.log(`   ✅ QR saved: ${qrPath}`);

        // Check and update header in column F
        try {
            const getRes = await sheets.spreadsheets.values.get({
                spreadsheetId: shop.sheet_id,
                range: 'F1:F1',
            });

            const headerF = getRes.data.values?.[0]?.[0] || '';

            if (headerF.toLowerCase() !== 'qr_code') {
                // Update header F1
                await sheets.spreadsheets.values.update({
                    spreadsheetId: shop.sheet_id,
                    range: 'F1',
                    valueInputOption: 'RAW',
                    resource: { values: [['qr_code']] },
                });
            }

            // Update QR URL in F2
            await sheets.spreadsheets.values.update({
                spreadsheetId: shop.sheet_id,
                range: 'F2',
                valueInputOption: 'RAW',
                resource: { values: [[`https://qr-menu-opal.vercel.app/qrcodes/${shop.id}-qr.png`]] },
            });

            console.log(`   ✅ QR URL added to Google Sheet column F`);
        } catch (err) {
            console.error(`   ❌ Sheet error: ${err.message}`);
        }
    } catch (err) {
        console.error(`   ❌ QR generation error: ${err.message}`);
    }
    console.log('');

// Print QR URLs for reference
console.log('\n📋 QR Code URLs:');
for (const shop of shops) {
    console.log(`   ${shop.name}: https://qr-menu-opal.vercel.app/qrcodes/${shop.id}-qr.png`);
}
