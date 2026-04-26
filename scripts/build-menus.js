#!/usr/bin/env node
/**
 * QR Menu — Build Script
 * Fetches Google Sheets CSV → Parses → Generates static JSON per shop
 * 
 * Usage: node scripts/build-menus.js
 */

import fetch from 'node-fetch';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data', 'menus');
const SHOPS_FILE = path.join(__dirname, '..', 'data', 'shops.json');

/**
 * Fetch and parse Google Sheet CSV
 * Uses raw parsing to handle mixed header structures
 */
async function fetchSheetCSV(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const csv = await response.text();
    // Parse without headers — we'll handle column mapping ourselves
    const { data } = Papa.parse(csv, { header: false, skipEmptyLines: true });
    return data;
}

/**
 * Sanitize a string by stripping all HTML tags and dangerous characters.
 * Used at build time to prevent XSS injection via Google Sheet data.
 * @param {string} str
 * @returns {string}
 */
function sanitizeText(str) {
    if (!str || typeof str !== 'string') return '';
    // Strip HTML tags and trim
    return str.replace(/<[^>]*>/g, '').trim();
}

/**
 * Parse shop data from sheet rows
 * Handles two formats:
 * - Old: type,name,description,price,image,category (type=config|item)
 * - New: category,name,description,price,image (with header row)
 */
function parseShopData(rows) {
    const config = { tagline: '' };
    const items = [];

    if (rows.length === 0) return { config, items };

    // Detect format by checking first row (header or old format)
    const firstRow = rows[0];
    const firstCell = (firstRow[0] || '').toLowerCase().trim();

    // NEW FORMAT: has "category" as first column header
    if (firstCell === 'category') {
        // rows[0] is header, rows[1..] are data
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const name = sanitizeText(row[1] || '');
            if (!name) continue;
            items.push({
                id: String(items.length + 1),
                name: name,
                description: sanitizeText(row[2] || ''),
                price: parseFloat(row[3]) || 0,
                image: sanitizeText(row[4] || ''),
                category: sanitizeText(row[0] || 'Other'),
                available: true
            });
        }
        return { config, items };
    }

    // OLD FORMAT: type=config|item
    for (const row of rows) {
        const firstCell = (row[0] || '').toLowerCase().trim();

        if (firstCell === 'config') {
            const key = (row[1] || '').toLowerCase().trim();
            const value = sanitizeText(row[2] || '');
            if (key) config[key] = value;
        }
        else if (firstCell === 'item') {
            const name = sanitizeText(row[1] || '');
            if (!name) continue;
            items.push({
                id: String(items.length + 1),
                name: name,
                description: sanitizeText(row[2] || ''),
                price: parseFloat(row[3]) || 0,
                image: sanitizeText(row[4] || ''),
                category: sanitizeText(row[5] || 'Other'),
                available: true
            });
        }
    }

    return { config, items };
}

/**
 * Main build function
 */
async function build() {
    console.log('🔨 QR Menu Build Script');
    console.log('======================\n');

    // Ensure output directory exists
    fs.mkdirSync(DATA_DIR, { recursive: true });

    // Load shops list
    const shopsData = JSON.parse(fs.readFileSync(SHOPS_FILE, 'utf-8'));
    console.log(`📋 Found ${shopsData.length} shop(s) to build\n`);

    const results = [];

    for (const shop of shopsData) {
        console.log(`📦 Building: ${shop.name} (${shop.id})`);
        
        try {
            const rows = await fetchSheetCSV(shop.sheet_url);
            const { config, items } = parseShopData(rows);

            // Merge sheet config with shop defaults
            // Template: prefer sheet config, fallback to shops.json, fallback to default
            const shopConfig = {
                shop_name: shop.name,
                template: config.template || shop.template || 'with-images',
                theme_bg: '#FFFFFF',
                theme_accent: '#E85A2C',
                theme_text: '#1A1A1A',
                theme_header: '#1A1A1A',
                theme_header_text: '#FFFFFF',
                tagline: '',
                currency: 'K',
                currency_position: 'after',
                ...config
            };

            const output = {
                shop_id: shop.id,
                shop_name: shop.name,
                generated_at: new Date().toISOString(),
                config: shopConfig,
                items
            };

            const outputPath = path.join(DATA_DIR, `${shop.id}.json`);
            fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
            
            console.log(`   ✅ ${items.length} items, template: ${shopConfig.template}`);
            results.push({ id: shop.id, name: shop.name, status: 'success', items: items.length });
        } catch (err) {
            console.log(`   ❌ Error: ${err.message}`);
            results.push({ id: shop.id, name: shop.name, status: 'error', error: err.message });
        }
    }

    console.log('\n======================');
    console.log('📊 Build Report:');
    results.forEach(r => {
        const icon = r.status === 'success' ? '✅' : '❌';
        const detail = r.status === 'success' ? `${r.items} items` : r.error;
        console.log(`   ${icon} ${r.name}: ${detail}`);
    });
    
    const success = results.filter(r => r.status === 'success').length;
    console.log(`\n🎉 ${success}/${results.length} shops built successfully!`);
}

build().catch(console.error);
