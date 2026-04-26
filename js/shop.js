/**
 * Shop Config Loader
 * @module shop
 */

/** @type {Array|null} Cached shop list */
let cachedShops = null;

/**
 * Fetch the list of all shops from the static shops.json file.
 * @returns {Promise<Array>}
 */
export async function getShopList() {
    if (cachedShops !== null) {
        return cachedShops;
    }

    const response = await fetch('/data/shops.json');
    if (!response.ok) {
        throw new Error(`Failed to load shops.json: ${response.status}`);
    }

    cachedShops = await response.json();
    if (!Array.isArray(cachedShops)) {
        throw new Error('shops.json must contain an array');
    }

    return cachedShops;
}

/**
 * Get a single shop by ID (case-insensitive).
 * @param {string} shopId
 * @returns {Promise<Object|null>}
 */
export async function getShop(shopId) {
    if (!shopId || typeof shopId !== 'string') {
        return null;
    }

    const sanitizedId = shopId.trim().toLowerCase();
    const shops = await getShopList();
    const shop = shops.find(s => s.id && s.id.toLowerCase() === sanitizedId);
    return shop || null;
}

/**
 * Get the first shop in the list (used as default).
 * @returns {Promise<Object|null>}
 */
export async function getDefaultShop() {
    const shops = await getShopList();
    return shops.length > 0 ? shops[0] : null;
}

/**
 * Clear cached shop list.
 */
export function clearCache() {
    cachedShops = null;
}
