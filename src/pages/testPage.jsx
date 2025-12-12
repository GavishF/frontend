/**
 * FEATURE SHOWCASE PAGE
 * =====================
 * A page that demonstrates all the high-impact features in action.
 * 
 * This page lets you:
 * 1. Test the cart state management system
 * 2. Open the product detail modal
 * 3. Try the advanced filtering and sorting
 * 4. Test the form validation
 * 5. See everything working together
 */

import { useState, useEffect } from 'react';
import * as cartState from '../utils/cartState';
import ProductDetailModal from '../components/ProductDetailModal';
import AdvancedProductGrid from '../components/AdvancedProductGrid';
import FormValidationCheckout from '../components/FormValidationCheckout';
import toast from 'react-hot-toast';

export default function TestPage() {
    const [activeTab, setActiveTab] = useState('cart');
    const [cart, setCart] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Sample product for modal demo
    const demoProduct = {
        _id: 'demo-1',
        productId: 'demo-1',
        name: 'Premium T-Shirt',
        description: 'A high-quality, comfortable t-shirt made from 100% cotton. Perfect for everyday wear.',
        price: 29.99,
        labelledPrice: 49.99,
        category: 'T-Shirts',
        images: [
            'https://via.placeholder.com/500x500?text=Premium+T-Shirt',
            'https://via.placeholder.com/500x500?text=Back+View',
        ],
        ratingAvg: 4.5,
        ratingCount: 128,
    };

    // Subscribe to cart changes
    useEffect(() => {
        const unsubscribe = cartState.subscribe((updatedCart) => {
            setCart(updatedCart);
        });
        return unsubscribe;
    }, []);

    // Initialize cart on mount
    useEffect(() => {
        setCart(cartState.getCart());
    }, []);

    const handleAddDemoProduct = () => {
        cartState.addItem(demoProduct, 1);
        toast.success('Added to cart!');
    };

    const handleRemoveFromCart = (productId) => {
        try {
            cartState.removeItem(productId);
            toast.success('Removed from cart');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleUpdateQuantity = (productId, newQty) => {
        try {
            cartState.updateQuantity(productId, newQty);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleClearCart = () => {
        cartState.clearCart();
        toast.success('Cart cleared');
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            {/* Header */}
            <div className="bg-black border-b-2 border-red-600 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-2">🚀 Feature Showcase</h1>
                    <p className="text-gray-400 text-lg">
                        Explore all the high-impact features built into this platform
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-wrap gap-3 mb-8">
                    {[
                        { id: 'cart', label: '🛒 Cart State Management', icon: '1' },
                        { id: 'modal', label: '📱 Product Detail Modal', icon: '2' },
                        { id: 'grid', label: '🔍 Filter & Sort Grid', icon: '3' },
                        { id: 'form', label: '✅ Form Validation', icon: '4' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-lg font-bold transition transform hover:scale-105 ${
                                activeTab === tab.id
                                    ? 'bg-red-600 text-white shadow-lg'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-4 pb-12">
                {/* 1. Cart State Management */}
                {activeTab === 'cart' && (
                    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-red-500 mb-2">
                                🛒 Cart State Management
                            </h2>
                            <p className="text-gray-400">
                                A bulletproof cart system showing clean JavaScript architecture with pure
                                functions, single source of truth, and event-driven updates.
                            </p>
                        </div>

                        {/* Cart Demo */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left: Add Product Demo */}
                            <div>
                                <h3 className="text-xl font-bold mb-4">Add Products</h3>
                                <div className="bg-gray-700 p-6 rounded-lg mb-4">
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-400 mb-2">Sample Product:</p>
                                        <p className="font-bold">{demoProduct.name}</p>
                                        <p className="text-red-400 font-bold text-lg">
                                            ${demoProduct.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleAddDemoProduct}
                                        className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold transition"
                                    >
                                        Add to Cart
                                    </button>
                                </div>

                                {/* Code Example */}
                                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-sm font-mono">
                                    <p className="text-gray-400 mb-2">// Pure function example:</p>
                                    <p className="text-green-400">cartState.addItem(product, qty)</p>
                                    <p className="text-green-400">cartState.calculateTotal()</p>
                                    <p className="text-green-400">cartState.subscribe(callback)</p>
                                </div>
                            </div>

                            {/* Right: Cart Display */}
                            <div>
                                <h3 className="text-xl font-bold mb-4">Current Cart</h3>
                                <div className="bg-gray-700 p-6 rounded-lg">
                                    {cart.length === 0 ? (
                                        <p className="text-gray-400 text-center py-8">Cart is empty</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart.map(item => (
                                                <div
                                                    key={item.productId}
                                                    className="bg-gray-600 p-4 rounded-lg"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="font-bold">{item.name}</p>
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveFromCart(item.productId)
                                                            }
                                                            className="text-red-500 hover:text-red-400 text-sm"
                                                        >
                                                            ✕ Remove
                                                        </button>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-300">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleUpdateQuantity(
                                                                        item.productId,
                                                                        item.quantity - 1
                                                                    )
                                                                }
                                                                className="w-6 h-6 bg-gray-500 rounded hover:bg-gray-400"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="w-8 text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    handleUpdateQuantity(
                                                                        item.productId,
                                                                        item.quantity + 1
                                                                    )
                                                                }
                                                                className="w-6 h-6 bg-gray-500 rounded hover:bg-gray-400"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Totals */}
                                            <div className="border-t border-gray-600 pt-4 mt-4">
                                                <div className="flex justify-between mb-2">
                                                    <span>Subtotal:</span>
                                                    <span>
                                                        ${cartState.calculateSubtotal().toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span>Tax (10%):</span>
                                                    <span>${cartState.calculateTax().toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between mb-4 text-sm">
                                                    <span>Shipping:</span>
                                                    <span>
                                                        ${cartState.calculateShipping().toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xl font-bold border-t border-gray-600 pt-4">
                                                    <span>Total:</span>
                                                    <span className="text-red-400">
                                                        ${cartState.calculateTotal().toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleClearCart}
                                                className="w-full mt-4 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-bold transition"
                                            >
                                                Clear Cart
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="mt-8 bg-gray-700 p-6 rounded-lg">
                            <h4 className="font-bold mb-3">✨ Why This Code Wins:</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>✓ Pure functions with clear inputs/outputs</li>
                                <li>✓ Single source of truth for cart data</li>
                                <li>✓ LocalStorage persistence (cart survives page reload)</li>
                                <li>✓ Event-driven updates (subscribe pattern)</li>
                                <li>✓ Immutable state updates</li>
                                <li>✓ Comprehensive error handling</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* 2. Product Modal */}
                {activeTab === 'modal' && (
                    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-red-500 mb-2">
                                📱 Product Detail Modal
                            </h2>
                            <p className="text-gray-400">
                                Modern, non-navigational product viewing. Click the button below to see the
                                modal in action.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedProduct(demoProduct);
                                setModalOpen(true);
                            }}
                            className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-lg transition transform hover:scale-105"
                        >
                            🔍 Open Product Modal
                        </button>

                        {/* Features List */}
                        <div className="mt-8 grid md:grid-cols-2 gap-6">
                            <div className="bg-gray-700 p-6 rounded-lg">
                                <h4 className="font-bold mb-3">✨ Features:</h4>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li>✓ Smooth open/close animations</li>
                                    <li>✓ Image zoom on hover</li>
                                    <li>✓ Size selector (UK 6-16)</li>
                                    <li>✓ Color picker with preview</li>
                                    <li>✓ Quantity controls</li>
                                    <li>✓ Add to cart from modal</li>
                                </ul>
                            </div>
                            <div className="bg-gray-700 p-6 rounded-lg">
                                <h4 className="font-bold mb-3">♿ Accessibility:</h4>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li>✓ Keyboard navigation (Escape to close)</li>
                                    <li>✓ ARIA labels for screen readers</li>
                                    <li>✓ Tab through options</li>
                                    <li>✓ Focus management</li>
                                    <li>✓ Proper semantic HTML</li>
                                    <li>✓ Mobile responsive</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Advanced Grid */}
                {activeTab === 'grid' && (
                    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-red-500 mb-2">
                                🔍 Advanced Filtering & Sorting
                            </h2>
                            <p className="text-gray-400 mb-4">
                                Professional filter system with instant DOM updates. No page reload needed.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-700 p-6 rounded-lg">
                                <h4 className="font-bold mb-3">Filter Features:</h4>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li>✓ Category filter buttons</li>
                                    <li>✓ Dynamic category loading from DB</li>
                                    <li>✓ Uses Array.prototype.filter()</li>
                                    <li>✓ Instant updates (no page reload)</li>
                                    <li>✓ Filter persistence in URL</li>
                                </ul>
                            </div>
                            <div className="bg-gray-700 p-6 rounded-lg">
                                <h4 className="font-bold mb-3">Sort Features:</h4>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li>✓ Newest (default)</li>
                                    <li>✓ Price: Low to High</li>
                                    <li>✓ Price: High to Low</li>
                                    <li>✓ Name: A to Z</li>
                                    <li>✓ Top Rated</li>
                                </ul>
                            </div>
                        </div>

                        {/* UX Polish */}
                        <div className="bg-gray-700 p-6 rounded-lg mb-8">
                            <h4 className="font-bold mb-3">UX Polish (Hover Effects):</h4>
                            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
                                <div>
                                    <p className="font-semibold mb-1">🎨 Image Darkening</p>
                                    <p>Product darkens 30% on hover</p>
                                </div>
                                <div>
                                    <p className="font-semibold mb-1">🖱️ Quick Look Button</p>
                                    <p>CTA slides in smoothly</p>
                                </div>
                                <div>
                                    <p className="font-semibold mb-1">📱 Modal Integration</p>
                                    <p>Opens product without navigation</p>
                                </div>
                            </div>
                        </div>

                        {/* Code Example */}
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 font-mono text-sm">
                            <p className="text-green-400 mb-2">// Filter using Array methods:</p>
                            <p className="text-gray-400 mb-4">
                                products.filter(p =&gt; p.category.includes(selected))
                            </p>
                            <p className="text-green-400 mb-2">// Sort with custom logic:</p>
                            <p className="text-gray-400">
                                sorted.sort((a, b) =&gt; a.price - b.price)
                            </p>
                        </div>
                    </div>
                )}

                {/* 4. Form Validation */}
                {activeTab === 'form' && (
                    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-red-500 mb-2">
                                ✅ Form Validation Masterclass
                            </h2>
                            <p className="text-gray-400">
                                Real-time form validation showing professional-grade error handling and UX.
                            </p>
                        </div>

                        {/* Validation Rules */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-700 p-6 rounded-lg">
                                <h4 className="font-bold mb-4">Validation Rules:</h4>
                                <div className="space-y-3 text-sm text-gray-300">
                                    <div>
                                        <p className="font-semibold text-white">Full Name</p>
                                        <p>Required, min 3 characters</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Email</p>
                                        <p>Must contain @ and domain</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Card Number</p>
                                        <p>Exactly 16 digits</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Expiry</p>
                                        <p>MM/YY format, future date only</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">CVV</p>
                                        <p>3-4 digits only</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-700 p-6 rounded-lg">
                                <h4 className="font-bold mb-4">Real-Time Feedback:</h4>
                                <div className="space-y-2 text-sm text-gray-300">
                                    <p className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded border-2 border-red-500"></span>
                                        Red border = Invalid
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded border-2 border-green-500"></span>
                                        Green border = Valid
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded border-2 border-gray-500"></span>
                                        Gray border = Not touched
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span>
                                        Shows checkmark when valid
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-red-400">✕</span>
                                        Shows error message below
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Smart Features */}
                        <div className="bg-gray-700 p-6 rounded-lg mb-8">
                            <h4 className="font-bold mb-4">✨ Smart Features:</h4>
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                                <div>
                                    <p className="font-semibold text-white mb-1">Auto-Formatting</p>
                                    <p>Card number auto-strips non-digits</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white mb-1">Auto-Formatting</p>
                                    <p>Expiry auto-formats to MM/YY</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white mb-1">Live Validation</p>
                                    <p>Validates as user types</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white mb-1">Helpful Errors</p>
                                    <p>Specific messages for each error</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white mb-1">Success Modal</p>
                                    <p>Beautiful confirmation on valid submit</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-white mb-1">Accessibility</p>
                                    <p>ARIA labels & keyboard support</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Component */}
                        <div className="mt-8">
                            <FormValidationCheckout />
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <ProductDetailModal
                product={selectedProduct}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
}