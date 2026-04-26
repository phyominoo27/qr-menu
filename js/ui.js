/**
 * UI Rendering Engine
 * @module ui
 */

import { formatPrice, getCategories, filterByCategory } from './menu.js';

/** @type {HTMLElement|null} */
let appMount = null;

/**
 * Initialize UI with mount point.
 * @param {HTMLElement} mountPoint
 */
export function initUI(mountPoint) {
    appMount = mountPoint;
}

/**
 * Apply dynamic theme colors from shop config.
 * @param {Object} config
 */
export function applyTheme(config) {
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', config.theme_bg || '#FFFFFF');
    root.style.setProperty('--theme-accent', config.theme_accent || '#E85A2C');
    root.style.setProperty('--theme-accent-light', config.theme_accent_light || '#FFF0EB');
    root.style.setProperty('--theme-text', config.theme_text || '#1A1A1A');
    root.style.setProperty('--theme-text-muted', config.theme_text_muted || '#6B7280');
    root.style.setProperty('--theme-header', config.theme_header || '#1A1A1A');
    root.style.setProperty('--theme-header-text', config.theme_header_text || '#FFFFFF');
    root.style.setProperty('--theme-card-bg', config.theme_card_bg || '#FFFFFF');
    root.style.setProperty('--theme-card-border', config.theme_card_border || '#F0F0F0');
    root.style.setProperty('--theme-shadow', config.theme_shadow || 'rgba(0, 0, 0, 0.06)');
    root.style.setProperty('--theme-shadow-hover', config.theme_shadow_hover || 'rgba(0, 0, 0, 0.12)');
    document.body.style.backgroundColor = config.theme_bg || '#FFFFFF';

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.setAttribute('content', config.theme_header || '#1A1A1A');
    }
}

/**
 * Escape HTML special characters.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
    if (!str || typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Get emoji icon for a category.
 * @param {string} category
 * @returns {string}
 */
export function getCategoryIcon(category) {
    const icons = {
        'ramen': '🍜', 'noodles': '🍜', 'soup': '🍲', 'rice': '🍚',
        'drinks': '🍹', 'beverages': '🍹', 'coffee': '☕', 'tea': '🍵',
        'dessert': '🍰', 'desserts': '🍰', 'cake': '🍰', 'pastry': '🥐',
        'breakfast': '🍳', 'lunch': '🍱', 'dinner': '🍽️', 'snacks': '🍿',
        'sides': '🥗', 'salad': '🥗', 'appetizer': '🥟', 'appetizers': '🥟',
        'main': '🍖', 'mains': '🍖', 'grilled': '🥩', 'seafood': '🐟',
        'fish': '🐟', 'vegetarian': '🥬', 'vegan': '🥬', 'juice': '🧃',
        'smoothie': '🥤', 'milk tea': '🧋', 'boba': '🧋', 'beer': '🍺',
        'wine': '🍷', 'cocktail': '🍸', 'cocktails': '🍸', 'special': '⭐',
        'specials': '⭐', 'recommended': '👋', 'new': '🆕',
    };
    const normalized = category.toLowerCase().trim();
    return icons[normalized] || '🍽️';
}

/**
 * Render the shop header.
 * @param {Object} config
 * @returns {string}
 */
export function renderHeader(config) {
    // Get shop initials for placeholder logo
    const getInitials = (name) => {
        if (!name) return '?';
        const words = name.trim().split(/\s+/);
        if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    };

    const logoHtml = config.logo_url
        ? `<img src="${escapeHtml(config.logo_url)}" alt="${escapeHtml(config.shop_name)}" class="menu-header__logo" loading="lazy" onerror="this.style.display='none'">`
        : `<div class="menu-header__logo menu-header__logo--placeholder">
            <span class="logo-initials">${getInitials(config.shop_name)}</span>
        </div>`;

    const taglineHtml = config.tagline
        ? `<p class="menu-header__tagline burmese-text">${escapeHtml(config.tagline)}</p>`
        : '';

    return `
        <header class="menu-header">
            ${logoHtml}
            <div class="menu-header__info">
                <h1 class="menu-header__name burmese-text">${escapeHtml(config.shop_name)}</h1>
                ${taglineHtml}
            </div>
        </header>
    `;
}

/**
 * Render loading skeleton.
 * @param {string} template
 * @returns {string}
 */
export function renderLoading(template) {
    if (template === 'without-images') {
        return `
            <div class="menu-content">
                ${[1,2,3,4,5].map(() => `
                    <div class="skeleton-item">
                        <div class="skeleton-item__row">
                            <div class="skeleton-item__line skeleton-item__line--name skeleton"></div>
                            <div class="skeleton-item__line skeleton-item__line--price skeleton"></div>
                        </div>
                        <div class="skeleton-item__desc-line skeleton"></div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    return `
        <div class="menu-content">
            ${[1,2,3,4,5].map(() => `
                <div class="skeleton-card">
                    <div class="skeleton-card__image skeleton"></div>
                    <div class="skeleton-card__content">
                        <div class="skeleton-card__line skeleton-card__line--short skeleton"></div>
                        <div class="skeleton-card__line skeleton-card__line--long skeleton"></div>
                        <div class="skeleton-card__line skeleton-card__line--medium skeleton"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Render category navigation pills.
 * @param {Array<string>} categories
 * @param {string} activeCategory
 * @returns {string}
 */
export function renderCategoryNav(categories, activeCategory = '') {
    if (categories.length <= 1) return '';

    const pills = [
        `<button class="category-pill ${!activeCategory ? 'active' : ''} burmese-text" data-category="">All</button>`,
        ...categories.map(cat =>
            `<button class="category-pill ${activeCategory === cat ? 'active' : ''} burmese-text" data-category="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`
        )
    ].join('');

    return `<nav class="category-nav" aria-label="Menu categories">${pills}</nav>`;
}

/**
 * Render a photo card (WITH IMAGES template).
 * @param {Object} item
 * @param {Object} config
 * @returns {string}
 */
export function renderPhotoCard(item, config) {
    const formattedPrice = formatPrice(item.price, config.currency, config.currency_position);
    const descriptionHtml = item.description
        ? `<p class="menu-card__description">${escapeHtml(item.description)}</p>`
        : '';

    const imageHtml = item.image
        ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="menu-card__image" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="menu-card__image menu-card__image--placeholder" style="display:none;">
               <svg class="img-placeholder-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
           </div>`
        : `<div class="menu-card__image menu-card__image--placeholder">
            <svg class="img-placeholder-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
           </div>`;

    return `
        <article class="menu-card fade-slide-up burmese-text" data-item-id="${escapeHtml(item.id)}">
            <div class="menu-card__inner">
                ${imageHtml}
                <div class="menu-card__content">
                    <div class="menu-card__header">
                        <h3 class="menu-card__name">${escapeHtml(item.name)}</h3>
                        <span class="menu-card__price">${formattedPrice}</span>
                    </div>
                    ${descriptionHtml}
                </div>
            </div>
        </article>
    `;
}

/**
 * Render a list item (WITHOUT IMAGES template).
 * @param {Object} item
 * @param {Object} config
 * @returns {string}
 */
export function renderListItem(item, config) {
    const formattedPrice = formatPrice(item.price, config.currency, config.currency_position);
    const descriptionHtml = item.description
        ? `<p class="menu-item__description">${escapeHtml(item.description)}</p>`
        : '';

    return `
        <article class="menu-item fade-slide-up burmese-text" data-item-id="${escapeHtml(item.id)}">
            <div class="menu-item__row">
                <h3 class="menu-item__name">${escapeHtml(item.name)}</h3>
                <span class="menu-item__price">${formattedPrice}</span>
            </div>
            ${descriptionHtml}
        </article>
    `;
}

/**
 * Render a category section.
 * @param {string} category
 * @param {Array} items
 * @param {Object} config
 * @param {string} template
 * @returns {string}
 */
export function renderCategorySection(category, items, config, template) {
    const categoryIcon = getCategoryIcon(category);
    const headerHtml = `
        <div class="category-header">
            <span class="category-header__icon">${categoryIcon}</span>
            <h2 class="category-header__title burmese-text">${escapeHtml(category)}</h2>
            <span class="category-header__line"></span>
        </div>
    `;

    const itemsHtml = items.map(item =>
        template === 'without-images'
            ? renderListItem(item, config)
            : renderPhotoCard(item, config)
    ).join('');

    return headerHtml + itemsHtml;
}

/**
 * Render the full menu.
 * @param {Array} items
 * @param {Object} config
 * @param {string} template
 * @param {string} activeCategory
 * @returns {string}
 */
export function renderMenu(items, config, template, activeCategory = '') {
    const categories = getCategories(items);

    let html = '';

    if (categories.length > 0) {
        html += renderCategoryNav(categories, activeCategory);
    }

    html += '<div class="menu-content">';

    if (items.length === 0) {
        html += renderEmpty();
    } else {
        if (activeCategory) {
            const filtered = filterByCategory(items, activeCategory);
            html += renderCategorySection(activeCategory, filtered, config, template);
        } else {
            for (const cat of categories) {
                const catItems = filterByCategory(items, cat);
                if (catItems.length > 0) {
                    html += renderCategorySection(cat, catItems, config, template);
                }
            }
        }
    }

    html += '</div>';
    return html;
}

/**
 * Render empty state.
 * @returns {string}
 */
export function renderEmpty() {
    return `
        <div class="empty-screen">
            <div class="empty-screen__icon">🍽️</div>
            <h3 class="empty-screen__title">Menu Coming Soon</h3>
            <p class="empty-screen__message">We're preparing something special for you. Check back soon!</p>
        </div>
    `;
}

/**
 * Render error screen.
 * @param {string} title
 * @param {string} message
 * @returns {string}
 */
export function renderError(title, message) {
    return `
        <div class="error-screen">
            <div class="error-screen__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
            </div>
            <h2 class="error-screen__title">${escapeHtml(title)}</h2>
            <p class="error-screen__message">${escapeHtml(message)}</p>
        </div>
    `;
}

/**
 * Render shop not found error.
 * @param {string} shopId
 * @returns {string}
 */
export function renderShopNotFound(shopId) {
    return renderError(
        'Shop Not Found',
        `We couldn't find a shop with ID "${escapeHtml(shopId)}". Please check the QR code.`
    );
}

/**
 * Mount HTML to app container.
 * @param {string} html
 */
export function mount(html) {
    if (appMount) {
        appMount.innerHTML = html;
    }
}
