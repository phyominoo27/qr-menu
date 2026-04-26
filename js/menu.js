/**
 * Menu Data Loader
 * @module menu
 */

/** @type {Map} In-memory cache */
const menuCache = new Map();

/**
 * Fetch and parse a shop's menu data from pre-built JSON.
 * @param {string} shopId
 * @returns {Promise<Object>}
 */
export async function fetchMenu(shopId) {
    if (!shopId) throw new Error('shopId is required');

    if (menuCache.has(shopId)) {
        return menuCache.get(shopId);
    }

    const menuUrl = `/data/menus/${shopId}.json`;
    const response = await fetch(menuUrl);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Menu not found for shop "${shopId}". Check the shop ID.`);
        }
        throw new Error(`Failed to load menu: ${response.status}`);
    }

    const data = await response.json();
    const processed = processMenuData(data);
    menuCache.set(shopId, processed);
    return processed;
}

/**
 * Process and normalize menu data.
 * @param {Object} data
 * @returns {Object}
 */
export function processMenuData(data) {
    const config = {
        shop_name: data.config?.shop_name || 'Our Menu',
        template: data.config?.template || 'with-images',
        theme_bg: data.config?.theme_bg || '#FFFFFF',
        theme_accent: data.config?.theme_accent || '#C4956A',
        theme_text: data.config?.theme_text || '#2D2D2D',
        theme_header: data.config?.theme_header || '#3D2B1F',
        theme_header_text: data.config?.theme_header_text || '#FFFFFF',
        currency: data.config?.currency || '$',
        currency_position: data.config?.currency_position || 'before',
        tagline: data.config?.tagline || '',
        logo_url: data.config?.logo_url || '',
    };

    const items = (data.items || []).map((item, index) => {
        const rawPrice = item.price || '0';
        const numericPrice = parseFloat(String(rawPrice).replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;

        return {
            id: item.id || `item-${index}`,
            name: item.name || 'Unnamed Item',
            description: item.description || '',
            price: numericPrice,
            rawPrice: String(rawPrice),
            image: item.image || '',
            category: item.category || '',
            available: item.available !== false,
        };
    });

    return { config, items };
}

/**
 * Format a price value with currency symbol.
 * @param {number} price
 * @param {string} currency
 * @param {string} position
 * @returns {string}
 */
export function formatPrice(price, currency = '$', position = 'before') {
    const formatted = typeof price === 'number'
        ? price.toFixed(2).replace(/\.00$/, '')
        : String(price);
    return position === 'after' ? `${formatted}${currency}` : `${currency}${formatted}`;
}

/**
 * Get all unique categories from menu items.
 * @param {Array} items
 * @returns {Array<string>}
 */
export function getCategories(items) {
    const seen = new Set();
    const categories = [];
    for (const item of items) {
        const cat = (item.category || '').trim();
        if (cat && !seen.has(cat)) {
            seen.add(cat);
            categories.push(cat);
        }
    }
    return categories;
}

/**
 * Filter menu items by category.
 * @param {Array} items
 * @param {string} category
 * @returns {Array}
 */
export function filterByCategory(items, category) {
    if (!category || category.trim() === '') {
        return items.filter(item => item.available);
    }
    return items.filter(item =>
        item.available &&
        (item.category || '').toLowerCase() === category.toLowerCase()
    );
}

/**
 * Clear menu cache.
 */
export function clearCache() {
    menuCache.clear();
}
