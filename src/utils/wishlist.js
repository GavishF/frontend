// Wishlist utility functions using localStorage
import { getItem, setItem, removeItem } from './safeStorage.js';

export function getWishlist() {
	try {
		const wishlist = getItem('wishlist');
		return wishlist ? JSON.parse(wishlist) : [];
	} catch (e) {
		return [];
	}
}

export function addToWishlist(product) {
	try {
		const wishlist = getWishlist();
		const exists = wishlist.find(item => item.productId === product.productId);
		
		if (exists) {
			return { success: false, message: 'Already in wishlist' };
		}
		
		wishlist.push({
			productId: product.productId,
			name: product.name,
			price: product.price,
			image: product.images?.[0] || '/default-product.jpg',
			category: product.category,
		});
		
		setItem('wishlist', JSON.stringify(wishlist));
		return { success: true, message: 'Added to wishlist' };
	} catch (e) {
		return { success: false, message: 'Failed to add to wishlist' };
	}
}

export function removeFromWishlist(productId) {
	try {
		const wishlist = getWishlist();
		const filtered = wishlist.filter(item => item.productId !== productId);
		setItem('wishlist', JSON.stringify(filtered));
		return { success: true, message: 'Removed from wishlist' };
	} catch (e) {
		return { success: false, message: 'Failed to remove from wishlist' };
	}
}

export function isInWishlist(productId) {
	try {
		const wishlist = getWishlist();
		return wishlist.some(item => item.productId === productId);
	} catch (e) {
		return false;
	}
}

export function clearWishlist() {
	try {
		removeItem('wishlist');
		return { success: true, message: 'Wishlist cleared' };
	} catch (e) {
		return { success: false, message: 'Failed to clear wishlist' };
	}
}
