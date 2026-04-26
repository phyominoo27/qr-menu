/**
 * App Orchestrator
 * @module app
 */

import * as shop from './shop.js';
import * as menu from './menu.js';
import * as ui from './ui.js';

/** @type {string|null} Current shop ID */
let currentShopId = null;
/** @type {Object|null} Current shop config */
let currentShop = null;
/** @type {Object|null} Current menu data */
let currentMenu = null;
/** @type {string} Active category filter */
let activeCategory = '';

/**
 * Initialize the application.
 */
async function init() {
    // Initialize UI first
    ui.initUI(document.getElementById('app'));

    try {
        // Render loading state
        ui.mount(`
            ${ui.renderHeader({ shop_name: 'Loading...', tagline: '' })}
            ${ui.renderLoading('with-images')}
        `);

        // Parse shop from URL
        currentShopId = parseShopFromURL();

        let shopConfig;

        if (currentShopId) {
            shopConfig = await shop.getShop(currentShopId);
            if (!shopConfig) {
                renderShopNotFound(currentShopId);
                return;
            }
        } else {
            // No shop param — use first shop as default
            const defaultShop = await shop.getDefaultShop();
            if (!defaultShop) {
                renderNoShopsAvailable();
                return;
            }
            shopConfig = defaultShop;
            currentShopId = defaultShop.id;
        }

        currentShop = shopConfig;

        // Load menu
        await loadMenu(currentShopId, shopConfig);

    } catch (error) {
        console.error('[app] Init error:', error);
        renderUnexpectedError(error.message);
    }
}

/**
 * Parse shop ID from URL query parameters.
 * @returns {string|null}
 */
function parseShopFromURL() {
    const params = new URLSearchParams(window.location.search);
    const shopParam = params.get('shop');
    if (!shopParam) return null;
    // Sanitize: only allow alphanumeric, hyphens, underscores
    return shopParam.replace(/[^a-zA-Z0-9_-]/g, '');
}

/**
 * Load menu data for a shop.
 * @param {string} shopId
 * @param {Object} shopConfig
 */
async function loadMenu(shopId, shopConfig) {
    // Update loading with shop header
    ui.mount(`
        ${ui.renderHeader(shopConfig)}
        ${ui.renderLoading(shopConfig.template || 'with-images')}
    `);

    try {
        const menuData = await menu.fetchMenu(shopId);
        currentMenu = menuData;

        // Apply theme
        ui.applyTheme(menuData.config);

        // Render full menu
        renderFullMenu(menuData, shopConfig);

    } catch (error) {
        console.error('[app] Failed to load menu:', error);
        renderLoadError(shopId, shopConfig, error.message);
    }
}

/**
 * Render the complete menu UI.
 * @param {Object} menuData
 * @param {Object} shopConfig
 */
function renderFullMenu(menuData, shopConfig) {
    const template = menuData.config.template || 'with-images';

    const html = `
        ${ui.renderHeader(menuData.config)}
        ${ui.renderMenu(menuData.items, menuData.config, template, activeCategory)}
    `;

    ui.mount(html);

    // Attach category listeners
    attachCategoryListeners(menuData, menuData.config, template);

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const newShopId = parseShopFromURL();
        if (newShopId && newShopId !== currentShopId) {
            currentShopId = newShopId;
            activeCategory = '';
            shop.getShop(newShopId).then(config => {
                if (config) {
                    currentShop = config;
                    loadMenu(newShopId, config);
                } else {
                    renderShopNotFound(newShopId);
                }
            });
        }
    });
}

/**
 * Attach click listeners for category pills.
 * @param {Object} menuData
 * @param {Object} config
 * @param {string} template
 */
function attachCategoryListeners(menuData, config, template) {
    const categoryNav = document.querySelector('.category-nav');
    if (!categoryNav) return;

    categoryNav.addEventListener('click', (event) => {
        const pill = event.target.closest('.category-pill');
        if (!pill) return;

        const category = pill.dataset.category || '';

        // Update active state
        document.querySelectorAll('.category-pill').forEach(p => {
            p.classList.remove('active');
        });
        pill.classList.add('active');

        activeCategory = category;

        // Re-render menu content
        const menuContent = document.querySelector('.menu-content');
        if (menuContent) {
            const categories = menu.getCategories(menuData.items);
            let html = '';

            if (activeCategory) {
                const filtered = menu.filterByCategory(menuData.items, activeCategory);
                html = ui.renderCategorySection(activeCategory, filtered, config, template);
            } else {
                for (const cat of categories) {
                    const catItems = menu.filterByCategory(menuData.items, cat);
                    if (catItems.length > 0) {
                        html += ui.renderCategorySection(cat, catItems, config, template);
                    }
                }
            }

            menuContent.innerHTML = html || ui.renderEmpty();
        }
    });
}

/**
 * Render shop not found error.
 * @param {string} shopId
 */
function renderShopNotFound(shopId) {
    ui.applyTheme({
        theme_bg: '#FFFFFF',
        theme_accent: '#C4956A',
        theme_text: '#2D2D2D',
        theme_header: '#3D2B1F',
    });

    ui.mount(`
        ${ui.renderHeader({ shop_name: 'Menu', tagline: '' })}
        ${ui.renderShopNotFound(shopId)}
    `);
}

/**
 * Render no shops available error.
 */
function renderNoShopsAvailable() {
    ui.applyTheme({
        theme_bg: '#FFFFFF',
        theme_accent: '#C4956A',
        theme_text: '#2D2D2D',
        theme_header: '#3D2B1F',
    });

    ui.mount(`
        ${ui.renderHeader({ shop_name: 'Menu', tagline: '' })}
        ${ui.renderError('No Shops Available', 'There are no shops configured yet. Contact the administrator.')}
    `);
}

/**
 * Render load error with retry.
 * @param {string} shopId
 * @param {Object} shopConfig
 * @param {string} errorMessage
 */
function renderLoadError(shopId, shopConfig, errorMessage) {
    ui.mount(`
        ${ui.renderHeader(shopConfig)}
        ${ui.renderError('Unable to Load Menu', 'Please check your connection and try again.')}
        <div style="text-align:center;padding:16px;">
            <button onclick="location.reload()" style="
                display:inline-flex;align-items:center;gap:8px;
                padding:12px 24px;background-color:var(--theme-accent);
                color:white;font-weight:600;font-size:0.9375rem;
                border-radius:9999px;border:none;cursor:pointer;
            ">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
                </svg>
                Try Again
            </button>
        </div>
    `);
}

/**
 * Render unexpected error.
 * @param {string} message
 */
function renderUnexpectedError(message) {
    ui.applyTheme({
        theme_bg: '#FFFFFF',
        theme_accent: '#EF4444',
        theme_text: '#2D2D2D',
        theme_header: '#3D2B1F',
    });

    ui.mount(`
        ${ui.renderHeader({ shop_name: 'Error', tagline: '' })}
        ${ui.renderError('Something Went Wrong', message || 'An unexpected error occurred.')}
    `);
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
