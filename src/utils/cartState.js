/**
 * CART STATE MANAGEMENT MODULE
 * =================================
 * Single source of truth for cart data.
 * 
 * This module demonstrates clean architecture principles:
 * - Pure functions with clear inputs/outputs
 * - Separation of concerns (state logic vs UI)
 * - Immutable state updates
 * - LocalStorage persistence with error handling
 * - Event-driven UI updates
 * 
 * Usage:
 *   const cart = cartState.getCart();
 *   cartState.addItem(product, quantity);
 *   cartState.subscribe((cart) => console.log('Cart updated:', cart));
 */

import { getItem, setItem } from './safeStorage.js';

// Private state - single source of truth
let cartData = [];
let subscribers = [];

/**
 * Load cart from localStorage on module initialization
 * Gracefully handles corrupted data by returning empty array
 */
function initializeCart() {
    try {
        const stored = getItem('cart');
        if (stored) {
            cartData = JSON.parse(stored);
            if (!Array.isArray(cartData)) {
                cartData = [];
            }
        } else {
            cartData = [];
        }
    } catch (e) {
        console.error('Failed to load cart from storage:', e);
        cartData = [];
    }
}

/**
 * Persist cart to localStorage
 * Wraps storage errors to prevent crashes
 */
function persistCart() {
    try {
        setItem('cart', JSON.stringify(cartData));
    } catch (e) {
        console.error('Failed to save cart to storage:', e);
    }
}

/**
 * Notify all subscribers of cart changes
 * This allows UI components to react to cart updates
 */
function notifySubscribers() {
    subscribers.forEach(callback => {
        try {
            callback([...cartData]); // Pass immutable copy
        } catch (e) {
            console.error('Subscriber notification failed:', e);
        }
    });
}

/**
 * GET CART
 * Returns a copy of the current cart array
 * @returns {Array<Object>} Cart items array
 */
export function getCart() {
    return [...cartData];
}

/**
 * ADD ITEM TO CART
 * - If product exists, increment quantity
 * - If new, append to cart
 * - Validates product structure
 * @param {Object} product - Product object with productId, name, price, etc.
 * @param {number} quantity - Quantity to add (default: 1)
 * @returns {Object} Updated cart item
 */
export function addItem(product, quantity = 1) {
    if (!product || !product.productId) {
        throw new Error('Invalid product: must have productId');
    }

    const qty = Math.max(1, Math.floor(quantity));
    const existingIndex = cartData.findIndex(item => item.productId === product.productId);

    if (existingIndex >= 0) {
        // Product exists - increment quantity
        cartData[existingIndex].quantity = (cartData[existingIndex].quantity || 0) + qty;
    } else {
        // New product - add to cart
        const cartItem = {
            productId: product.productId || product._id,
            name: product.name || 'Unnamed Product',
            price: product.price || 0,
            quantity: qty,
            image: product.images?.[0] || product.image || '',
            altNames: product.altNames || [],
            size: product.selectedSize || '',
            color: product.selectedColor || '',
        };
        cartData.push(cartItem);
    }

    persistCart();
    notifySubscribers();
    return getItem(product.productId);
}

/**
 * REMOVE ITEM FROM CART
 * - Removes product by ID
 * - Throws error if product not found (for debugging)
 * @param {string} productId - Product ID to remove
 * @returns {boolean} True if removed successfully
 */
export function removeItem(productId) {
    const index = cartData.findIndex(item => item.productId === productId);
    if (index === -1) {
        throw new Error(`Product ${productId} not found in cart`);
    }

    cartData.splice(index, 1);
    persistCart();
    notifySubscribers();
    return true;
}

/**
 * UPDATE QUANTITY
 * - Changes quantity for a product
 * - Qty must be >= 1, otherwise removes item
 * - Validates new quantity value
 * @param {string} productId - Product ID to update
 * @param {number} newQuantity - New quantity (must be > 0)
 * @returns {Object} Updated cart item
 */
export function updateQuantity(productId, newQuantity) {
    const index = cartData.findIndex(item => item.productId === productId);
    if (index === -1) {
        throw new Error(`Product ${productId} not found in cart`);
    }

    const qty = Math.floor(newQuantity);
    if (qty < 1) {
        removeItem(productId);
        return null;
    }

    cartData[index].quantity = qty;
    persistCart();
    notifySubscribers();
    return cartData[index];
}

/**
 * CALCULATE SUBTOTAL
 * Sum of all (price * quantity) for cart items
 * Pure function - no side effects
 * @returns {number} Subtotal amount
 */
export function calculateSubtotal() {
    return cartData.reduce((sum, item) => {
        return sum + (item.price || 0) * (item.quantity || 0);
    }, 0);
}

/**
 * CALCULATE TAX
 * Fixed tax rate: 10% of subtotal
 * Pure function - no side effects
 * @returns {number} Tax amount
 */
export function calculateTax() {
    return calculateSubtotal() * 0.1;
}

/**
 * CALCULATE SHIPPING
 * Rules:
 * - Free if subtotal > 5000
 * - Otherwise 300 per default
 * Pure function - no side effects
 * @returns {number} Shipping cost
 */
export function calculateShipping() {
    const subtotal = calculateSubtotal();
    return subtotal > 5000 ? 0 : 300;
}

/**
 * CALCULATE TOTAL
 * Total = Subtotal + Tax + Shipping
 * Pure function - no side effects
 * @returns {number} Final total amount
 */
export function calculateTotal() {
    return calculateSubtotal() + calculateTax() + calculateShipping();
}

/**
 * GET ITEM COUNT
 * Total number of items in cart (sum of all quantities)
 * Pure function - no side effects
 * @returns {number} Total item count
 */
export function getItemCount() {
    return cartData.reduce((count, item) => count + (item.quantity || 0), 0);
}

/**
 * CLEAR CART
 * Removes all items from cart
 * Used for order completion
 * @returns {boolean} True if cleared
 */
export function clearCart() {
    cartData = [];
    persistCart();
    notifySubscribers();
    return true;
}

/**
 * FIND ITEM
 * Get cart item by product ID
 * Pure function - no side effects
 * @param {string} productId - Product ID to find
 * @returns {Object|null} Cart item or null if not found
 */
export function findItem(productId) {
    const item = cartData.find(item => item.productId === productId);
    return item ? { ...item } : null;
}

/**
 * SUBSCRIBE TO CHANGES
 * Register a callback to be notified when cart changes
 * Returns unsubscribe function
 * 
 * Usage:
 *   const unsubscribe = cartState.subscribe((cart) => {
 *       console.log('Cart updated:', cart);
 *   });
 *   unsubscribe(); // Stop listening
 * 
 * @param {Function} callback - Function to call with updated cart
 * @returns {Function} Unsubscribe function
 */
export function subscribe(callback) {
    if (typeof callback !== 'function') {
        throw new Error('Callback must be a function');
    }
    subscribers.push(callback);

    // Return unsubscribe function
    return () => {
        subscribers = subscribers.filter(cb => cb !== callback);
    };
}

/**
 * RENDER CART
 * Rebuilds cart UI from current cart state
 * Used for initial page load or refresh
 * @param {HTMLElement} container - DOM element to render into
 */
export function renderCart(container) {
    if (!container || !(container instanceof HTMLElement)) {
        throw new Error('Invalid container element');
    }

    const cart = getCart();
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const shipping = calculateShipping();
    const total = calculateTotal();

    const html = `
        <div class="cart-summary">
            <div class="cart-items">
                ${cart.length === 0 ? '<p>Cart is empty</p>' : cart.map(item => `
                    <div class="cart-item" data-product-id="${item.productId}">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="cart-totals">
                <div>Subtotal: $${subtotal.toFixed(2)}</div>
                <div>Tax: $${tax.toFixed(2)}</div>
                <div>Shipping: $${shipping.toFixed(2)}</div>
                <div class="total">Total: $${total.toFixed(2)}</div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Initialize cart on module load
initializeCart();

// Export all functions as default object for convenience
export default {
    getCart,
    addItem,
    removeItem,
    updateQuantity,
    calculateSubtotal,
    calculateTax,
    calculateShipping,
    calculateTotal,
    getItemCount,
    clearCart,
    findItem,
    subscribe,
    renderCart,
};
