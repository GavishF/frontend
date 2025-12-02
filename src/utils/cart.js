// Simple cart utils: increment cart count in localStorage and dispatch event
import client from '../services/client';
import { getItem, setItem } from './safeStorage.js';

export function getCartCount(){
    try{ return Number(getItem('cartCount') || 0); }catch(e){ return 0; }
}

export function setCartCount(n){
    try{ setItem('cartCount', String(n)); }catch(e){}
    // dispatch event for UI updates
    if(typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart:updated', { detail: { count: n } }));
}

export function addCountToCart(quantity = 1, price = 0){
    const cur = getCartCount();
    const next = cur + (quantity||1);
    try{
        const curTotal = Number(getItem('cartTotal') || 0);
        setItem('cartTotal', String(curTotal + (price||0) * (quantity||1)));
    }catch(e){}
    setCartCount(next);
    return next;
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
    let cartInString = getItem("cart");
    
    if(cartInString == null){
        cartInString = "[]"
        setItem("cart", cartInString);
    }

    const cart = JSON.parse(cartInString);
    return cart;
}

export async function addToCart(product , qty){
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
    try{ setItem('cart', JSON.stringify(cart)); }catch(e){}

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
    }catch(e){ }
}

export function getTotal(){
    const cart = getCart();
    let total = 0;
    cart.forEach((item)=>{
        total += item.quantity * item.price;
    })
    return total;
}

export function syncCartCount(){
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setCartCount(totalItems);
}