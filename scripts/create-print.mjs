import Jimp from 'jimp';
import fetch from 'node-fetch';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'print-ready');
mkdirSync(outDir, { recursive: true });

const BASE_URL = 'https://qr-menu-opal.vercel.app';

// Fetch QR as base64
async function qrToBase64(url) {
    const res = await fetch(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=400x400&format=png&margin=0`);
    const buf = await res.buffer();
    return buf;
}

// Create a beautiful card using Jimp
async function createPrintReadyCard(shopName, shopId, menuUrl, outputPath) {
    // Card dimensions: 1200x1200 (square, good for printing)
    const W = 1200, H = 1200;
    const bg = new Jimp(W, H, 0x1a1a2eFF); // Dark navy

    // Load QR code
    const qrBuf = await qrToBase64(menuUrl);
    const qr = await Jimp.read(qrBuf);
    qr.resize(500, 500);

    // Calculate QR position (center)
    const qrX = (W - 500) / 2;
    const qrY = 280;

    // Create rounded rect mask for QR
    // Simple white border around QR
    const qrWithBorder = new Jimp(540, 540, 0xFFFFFFFF); // white border
    qrWithBorder.composite(qr, 20, 20);

    // Place QR on background
    bg.composite(qrWithBorder, qrX - 20, qrY);

    // Add decorative elements using pixels
    // Top accent line
    for (let x = 0; x < W; x++) {
        bg.setPixelColor(0xe85a2cFF, x, 0);      // orange top
        bg.setPixelColor(0xe85a2cFF, x, 1);
        bg.setPixelColor(0xe85a2cFF, x, 2);
        bg.setPixelColor(0xe85a2cFF, x, 3);
        bg.setPixelColor(0xe85a2cFF, x, 4);

        bg.setPixelColor(0xe85a2cFF, x, H-1);    // orange bottom
        bg.setPixelColor(0xe85a2cFF, x, H-2);
        bg.setPixelColor(0xe85a2cFF, x, H-3);
        bg.setPixelColor(0xe85a2cFF, x, H-4);
        bg.setPixelColor(0xe85a2cFF, x, H-5);
    }

    // Side accent lines (vertical orange bars on left and right)
    for (let y = 0; y < H; y++) {
        bg.setPixelColor(0xe85a2cFF, 0, y);
        bg.setPixelColor(0xe85a2cFF, 1, y);
        bg.setPixelColor(0xe85a2cFF, 2, y);
        bg.setPixelColor(0xe85a2cFF, 2, y);

        bg.setPixelColor(0xe85a2cFF, W-1, y);
        bg.setPixelColor(0xe85a2cFF, W-2, y);
        bg.setPixelColor(0xe85a2cFF, W-3, y);
    }

    // Draw decorative circles (dots pattern) using Jimp circle drawing
    const drawCircle = (x, y, r, color) => {
        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                if (dx*dx + dy*dy <= r*r) {
                    const px = x + dx, py = y + dy;
                    if (px >= 0 && px < W && py >= 0 && py < H) {
                        bg.setPixelColor(color, px, py);
                    }
                }
            }
        }
    };

    // Corner decorative dots - orange
    drawCircle(80, 80, 30, 0xe85a2cFF);
    drawCircle(W-80, 80, 30, 0xe85a2cFF);
    drawCircle(80, H-80, 30, 0xe85a2cFF);
    drawCircle(W-80, H-80, 30, 0xe85a2cFF);

    // Smaller decorative dots - lighter
    drawCircle(80, 160, 10, 0xe85a2cAA);
    drawCircle(W-80, 160, 10, 0xe85a2cAA);
    drawCircle(80, H-160, 10, 0xe85a2cAA);
    drawCircle(W-80, H-160, 10, 0xe85a2cAA);

    // Load fonts (Jimp needs .ttf files for text)
    // Since we don't have fonts, we'll save as is and add text via another method
    // Actually, let's use a simpler approach - create the card as SVG first

    await bg.writeAsync(outputPath);
    console.log(`✅ Saved: ${outputPath}`);
}

async function main() {
    const shops = [
        { name: 'Cafe Aurora', id: 'cafe-aurora', url: `${BASE_URL}/?shop=cafe-aurora` },
        { name: 'Velvet Bar', id: 'velvet-bar', url: `${BASE_URL}/?shop=velvet-bar` },
    ];

    for (const shop of shops) {
        await createPrintReadyCard(
            shop.name,
            shop.id,
            shop.url,
            path.join(outDir, `${shop.id}-print.png`)
        );
    }
}

main().catch(console.error);
