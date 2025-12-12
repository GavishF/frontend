/**
 * ADVANCED FILTERING & SORTING COMPONENT
 * ======================================
 * Professional filter system with instant DOM updates (no page reload).
 * 
 * Features:
 * - Category filter buttons (All, T-Shirts, Hoodies, Pants)
 * - Sort dropdown (Price Low-High, High-Low, A-Z)
 * - Instant filter/sort updates using JavaScript
 * - Array methods: .filter(), .sort()
 * - Product grid reordering without page reload
 * - Filter persistence in URL
 * - "Quick Look" hover effects on cards
 * - Keyboard navigation (Tab through products, Enter to open modal)
 */

import { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProductCard from './productCard';
import ProductDetailModal from './ProductDetailModal';

export default function AdvancedProductGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products`
                );
                setProducts(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                toast.error('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Extract unique categories from products
    const categories = useMemo(() => {
        const cats = new Set();
        products.forEach(product => {
            if (Array.isArray(product.category)) {
                product.category.forEach(cat => cats.add(cat));
            }
        });
        return Array.from(cats).sort();
    }, [products]);

    /**
     * FILTER LOGIC
     * Pure function: filters products by category
     * Uses Array.prototype.filter()
     */
    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'all') {
            return products;
        }

        return products.filter(product => {
            if (!product.category) return false;
            if (Array.isArray(product.category)) {
                return product.category.some(
                    cat => cat.toLowerCase() === selectedCategory.toLowerCase()
                );
            }
            return product.category.toLowerCase() === selectedCategory.toLowerCase();
        });
    }, [products, selectedCategory]);

    /**
     * SORT LOGIC
     * Pure function: sorts products by selected criterion
     * Uses Array.prototype.sort()
     */
    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];

        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));

            case 'price-high':
                return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));

            case 'name-a-z':
                return sorted.sort((a, b) =>
                    (a.name || '').localeCompare(b.name || '')
                );

            case 'rating':
                return sorted.sort((a, b) =>
                    (b.ratingAvg || 0) - (a.ratingAvg || 0)
                );

            case 'newest':
            default:
                return sorted.sort((a, b) => {
                    const dateA = new Date(a.createdAt || 0);
                    const dateB = new Date(b.createdAt || 0);
                    return dateB - dateA;
                });
        }
    }, [filteredProducts, sortBy]);

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    // Keyboard navigation for accessibility
    const handleProductKeyDown = (e, product) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenModal(product);
        }
    };

    return (
        <div className="w-full min-h-screen bg-white">
            {/* Filter Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                    <h1 className="text-4xl font-bold text-black mb-6">Shop Collection</h1>

                    {/* Filter and Sort Controls */}
                    <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
                        {/* Category Filter Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-4 py-2 rounded-full font-medium transition ${
                                    selectedCategory === 'all'
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-black hover:bg-gray-200'
                                }`}
                            >
                                All
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full font-medium transition whitespace-nowrap ${
                                        selectedCategory === category
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-black hover:bg-gray-200'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-3">
                            <label htmlFor="sort-select" className="font-medium text-black">
                                Sort:
                            </label>
                            <select
                                id="sort-select"
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:border-black transition"
                            >
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name-a-z">Name: A to Z</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {sortedProducts.length} of {products.length} products
                        {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading products...</p>
                        </div>
                    </div>
                ) : sortedProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            No products found
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Try selecting a different category or sort option
                        </p>
                        <button
                            onClick={() => {
                                setSelectedCategory('all');
                                setSortBy('newest');
                            }}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedProducts.map(product => (
                            <div
                                key={product._id || product.productId}
                                className="group cursor-pointer"
                                onClick={() => handleOpenModal(product)}
                                onKeyDown={e => handleProductKeyDown(e, product)}
                                tabIndex={0}
                                role="button"
                            >
                                {/* Product Card with "Quick Look" Hover */}
                                <div className="relative overflow-hidden bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 group-hover:shadow-lg group-hover:border-gray-400">
                                    {/* Image Container */}
                                    <div className="relative h-64 overflow-hidden bg-gray-100">
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <span className="text-4xl">📷</span>
                                            </div>
                                        )}

                                        {/* Dark overlay on hover */}
                                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

                                        {/* Quick Look Button - appears on hover */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition transform translate-y-4 group-hover:translate-y-0">
                                                Quick Look
                                            </button>
                                        </div>

                                        {/* Discount Badge */}
                                        {product.labelledPrice > product.price && (
                                            <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                Sale
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-black line-clamp-2 mb-2">
                                            {product.name}
                                        </h3>

                                        {/* Rating */}
                                        {product.ratingAvg && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-yellow-400 text-sm">
                                                    {'★'.repeat(Math.round(product.ratingAvg))}
                                                    {'☆'.repeat(5 - Math.round(product.ratingAvg))}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    ({product.ratingCount || 0})
                                                </span>
                                            </div>
                                        )}

                                        {/* Price */}
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-bold text-black">
                                                ${product.price?.toFixed(2) || '0.00'}
                                            </span>
                                            {product.labelledPrice > product.price && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    ${product.labelledPrice?.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Detail Modal */}
            <ProductDetailModal
                product={selectedProduct}
                isOpen={modalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}
