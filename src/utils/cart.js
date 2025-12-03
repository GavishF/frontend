// Simple cart utils: increment cart count in localStorage and dispatch event
import client from '../services/client';
import { getItem, setItem } from './safeStorage.js';

export function getCartCount(){
    try{ 
        const count = getItem('cartCount') || 0;
        return Number(count);
    }catch(e){ 
        return 0;
    }
}

export function setCartCount(n){
    try{ 
        setItem('cartCount', String(n)); 
    }catch(e){
        // Silently fail - storage may not be available
    }
    
    // dispatch event for UI updates - wrap in try-catch too
    try {
        if(typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count: n } }));
        }
    } catch(e) {
        // Silently fail
    }
}

export function addCountToCart(quantity = 1, price = 0){
    try {
        const cur = getCartCount();
        const next = cur + (quantity||1);
        try{
            const curTotal = Number(getItem('cartTotal') || 0);
            setItem('cartTotal', String(curTotal + (price||0) * (quantity||1)));
        }catch(e){
            // Storage error - silently continue
        }
        setCartCount(next);
        return next;
    } catch(e) {
        // Silently fail
        return 0;
    }
}

export default { getCartCount, setCartCount, addCountToCart, addToCart };
// [
//     {
//         prodcutId: '12345',
//         quantity: 2,
//         price: 29.99,
//         name: 'Sample Product',
//         altNames: ['Sample Item', 'Example Product'],
//         image : 'https://example.com/sample-product.jpg',
//     },
//     {
//         productId: '67890',
//         quantity: 1,
//         price: 49.99,
//         name: 'Another Product',
//         altNames: ['Another Item', 'Different Product'],
//         image : 'https://example.com/another-product.jpg',
//     },
//     {
//         productId: '54321',
//         quantity: 3,
//         price: 19.99,
//         name: 'Third Product',
//         altNames: ['Third Item', 'Yet Another Product'],
//         image : 'https://example.com/third-product.jpg',
//     }
// ]

export function getCart(){
    try {
        let cartInString = getItem("cart");
        
        if(cartInString == null){
            cartInString = "[]"
            try {
                setItem("cart", cartInString);
            } catch(e) {
                // Storage error - continue with empty cart
            }
        }

        const cart = JSON.parse(cartInString);
        return cart;
    } catch(e) {
        return [];
    }
}

export async function addToCart(product , qty){
    try {
        // update localStorage replica
        const cart = getCart();
        const existingProductIndex = cart.findIndex((item)=> item.productId === product.productId );
        if(existingProductIndex === -1){
            cart.push({ productId: product.productId, quantity: qty, price: product.price, name: product.name, altNames: product.altNames, image: product.images?.[0] });
        }else{
            const newQty = (cart[existingProductIndex].quantity || 0) + qty;
            if(newQty <= 0) cart.splice(existingProductIndex, 1);
            else cart[existingProductIndex].quantity = newQty;
        }
        try{ 
            setItem('cart', JSON.stringify(cart)); 
        }catch(e){
            // Storage error - silently continue
        }

        // Update cart count based on total items
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(totalItems);

        // if logged in, persist to backend
        try{
            const token = getItem('token');
            if(token){
                // call backend add item
                await client.post('/api/cart/add', { productId: product.productId, qty });
            }
        }catch(e){ 
            // Backend error - silently continue
        }
    } catch(e) {
        // Top-level error handler
    }
}

export function getTotal(){
    try {
        const cart = getCart();
        let total = 0;
        cart.forEach((item)=>{
            total += item.quantity * item.price;
        })
        return total;
    } catch(e) {
        return 0;
    }
}

export function syncCartCount(){
    try {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(totalItems);
    } catch(e) {
        // Silently fail
    }
}