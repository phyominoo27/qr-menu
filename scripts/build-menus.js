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
 * Parse shop data from sheet rows
 * Handles mixed row types: config rows and item rows have different structures
 */
function parseShopData(rows) {
    const config = { tagline: '' };
    const items = [];

    for (const row of rows) {
        // Get the first cell to determine row type
        const firstCell = (row[0] || '').toLowerCase().trim();

        if (firstCell === 'config') {
            // Config row: type,key,value,...
            const key = (row[1] || '').toLowerCase().trim();
            const value = row[2] || '';
            if (key) config[key] = value;
        }
        else if (firstCell === 'item') {
            // Item row: type,name,description,price,image,category
            const name = row[1] || '';
            if (!name) continue;
            
            items.push({
                id: String(items.length + 1),
                name: name,
                description: row[2] || '',
                price: parseFloat(row[3]) || 0,
                image: row[4] || '',
                category: row[5] || 'Other',
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
            const shopConfig = {
                shop_name: shop.name,
                template: 'with-images',
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
