import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaMoneyBillWave, FaUsers, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import { FaBoxArchive, FaArrowTrendUp } from 'react-icons/fa6';
import { FiShoppingBag } from 'react-icons/fi';
import { MdPendingActions, MdCheckCircle, MdCancel } from 'react-icons/md';
import { HiOutlineArchiveBox } from "react-icons/hi2";
import safeStorage from '../../utils/safeStorage.js';
import { 
    playCardPackAnimation, 
    playWishlistRemoveAnimation, 
    playCartJourneyAnimation, 
    playPaymentCelebration, 
    playStarSmash, 
    playStarRain 
} from '../../utils/cardAnimations.js';

function ProductDropAnimation({ imageUrl, onComplete }) {
    const boxRef = useRef(null);
    const productRef = useRef(null);
    const containerRef = useRef(null);
    const lidRef = useRef(null);
    const [particles, setParticles] = useState([]);
    
    useEffect(() => {
        // Generate sparkle particles
        const particleArray = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            delay: Math.random() * 0.5,
            duration: 1 + Math.random() * 0.5,
            size: 4 + Math.random() * 8
        }));
        setParticles(particleArray);

        // Box slides in from right with 3D rotation
        if (containerRef.current) {
            containerRef.current.style.transform = 'translateX(100vw) perspective(1000px) rotateY(-45deg)';
            setTimeout(() => {
                if (containerRef.current) {
                    containerRef.current.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
                    containerRef.current.style.transform = 'translateX(0) perspective(1000px) rotateY(0deg)';
                }
            }, 100);
        }
        
        // Box lid opens
        setTimeout(() => {
            if (lidRef.current) {
                lidRef.current.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                lidRef.current.style.transform = 'rotateX(-120deg)';
            }
        }, 900);
        
        // Product drops with enhanced physics and bounce
        setTimeout(() => {
            if (productRef.current) {
                productRef.current.style.transition = 'transform 1.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s';
                productRef.current.style.transform = 'translateY(0) translateZ(20px) rotateX(720deg) rotateY(360deg) scale(1.1)';
                productRef.current.style.opacity = '1';
            }
        }, 1200);
        
        // Settle bounce
        setTimeout(() => {
            if (productRef.current) {
                productRef.current.style.transition = 'transform 0.3s ease-out';
                productRef.current.style.transform = 'translateY(0) translateZ(0) rotateX(720deg) rotateY(360deg) scale(1)';
            }
        }, 2300);
        
        // Everything glides left with 3D rotation and fades
        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.style.transition = 'transform 1s ease-in, opacity 1s';
                containerRef.current.style.transform = 'translateX(-100vw) perspective(1000px) rotateY(45deg)';
                containerRef.current.style.opacity = '0';
            }
        }, 3200);
        
        // Cleanup
        setTimeout(() => {
            onComplete();
        }, 4200);
        
    }, [onComplete]);
    
    return (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 999999, perspective: '1500px' }}>
            {/* Particle effects */}
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute top-1/2 left-1/2"
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: 'radial-gradient(circle, #BE0108, #8C0009)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: `sparkle ${p.duration}s ease-out ${p.delay}s forwards`,
                        opacity: 0,
                        boxShadow: '0 0 10px rgba(190, 1, 8, 0.8)'
                    }}
                />
            ))}
            <style>{`
                @keyframes sparkle {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    50% { opacity: 1; }
                    100% { 
                        transform: translate(
                            calc(-50% + ${Math.random() * 200 - 100}px), 
                            calc(-50% + ${Math.random() * 200 - 100}px)
                        ) scale(0);
                        opacity: 0;
                    }
                }
            `}</style>
            <div 
                ref={containerRef} 
                className="absolute top-1/2 left-1/2 -translate-y-1/2"
                style={{ 
                    transformStyle: 'preserve-3d',
                    transform: 'translateX(100vw) perspective(1000px) rotateY(-45deg)'
                }}
            >
                <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Red Archive Box Icon */}
                    <div 
                        ref={boxRef}
                        className="w-80 h-80 flex items-center justify-center relative"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <HiOutlineArchiveBox 
                            className="text-red-600 drop-shadow-2xl" 
                            style={{ 
                                width: '320px', 
                                height: '320px',
                                filter: 'drop-shadow(0 25px 50px rgba(220, 38, 38, 0.5))'
                            }} 
                        />
                        {/* Box lid overlay */}
                        <div
                            ref={lidRef}
                            className="absolute top-0"
                            style={{
                                width: '320px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #BE0108 0%, #8C0009 100%)',
                                transformOrigin: 'bottom',
                                transform: 'rotateX(0deg)',
                                transformStyle: 'preserve-3d',
                                borderRadius: '8px 8px 0 0',
                                boxShadow: '0 10px 30px rgba(140, 0, 9, 0.4)'
                            }}
                        />
                        
                        {/* Product image drops in with 3D effect */}
                        <img 
                            ref={productRef}
                            src={imageUrl} 
                            alt="Product" 
                            className="absolute w-40 h-40 object-cover rounded-lg shadow-2xl"
                            style={{ 
                                transform: 'translateY(-400px) translateZ(-200px) rotateX(0deg) rotateY(0deg) scale(0.5)',
                                opacity: '0',
                                transformStyle: 'preserve-3d',
                                border: '4px solid white'
                            }}
                        />
                    </div>
                    
                    {/* Success label */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-white px-8 py-3 rounded-full font-bold shadow-2xl text-lg whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)' }}>
                        ✨ Product Added! ✨
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardAdmin() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        canceledOrders: 0,
        recentOrders: [],
        products: 0,
        customers: 0,
    });

    useEffect(() => {
        let mounted = true;
        async function fetchStats() {
            try {
                const token = safeStorage.getItem('token');
                const base = import.meta.env.VITE_BACKEND_URL;

                const [ordersRes, productsRes, usersRes] = await Promise.all([
                    axios.get(`${base}/api/admin/orders`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${base}/api/products`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${base}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                const orders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data?.orders || []);
                const products = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.products || []);
                const users = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.users || []);

                if (!Array.isArray(orders) || !Array.isArray(products) || !Array.isArray(users)) {
                    console.error('Invalid API response format:', { orders, products, users });
                    return;
                }

                const pending = orders.filter(o => (o.status || '').toLowerCase() === 'pending').length;
                const completed = orders.filter(o => (o.status || '').toLowerCase() === 'completed').length;
                const canceled = orders.filter(o => (o.status || '').toLowerCase() === 'canceled').length;
                const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

                const nextStats = {
                    totalRevenue,
                    totalOrders: orders.length,
                    pendingOrders: pending,
                    completedOrders: completed,
                    canceledOrders: canceled,
                    products: products.length,
                    customers: users.length,
                    recentOrders: orders.slice(0, 5),
                    totalProducts: products.length,
                    totalUsers: users.length,
                };
                if (mounted) setStats(nextStats);
            } catch (e) {
                console.error('Error fetching dashboard stats:', e);
                if (mounted) setStats({
                    totalRevenue: 0,
                    totalOrders: 0,
                    pendingOrders: 0,
                    completedOrders: 0,
                    canceledOrders: 0,
                    products: 0,
                    customers: 0,
                    recentOrders: [],
                    totalProducts: 0,
                    totalUsers: 0,
                });
            }
        }
        fetchStats();
        const id = setInterval(fetchStats, 15000);
        return () => { mounted = false; clearInterval(id); };
    }, []);
    
    const [loading, setLoading] = useState(true);
    const [showAnimation, setShowAnimation] = useState(false);
    const [animationImage, setAnimationImage] = useState(null);

    useEffect(() => {
        // Use safeStorage to avoid restricted context errors
        let token = null;
        try {
            token = safeStorage.getItem('token');
        } catch {
            token = null;
        }
        if (!token) {
            setLoading(false);
            return;
        }
        
        // Fetch all data in parallel
        Promise.all([
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products"),
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/admin/orders", {
                headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            })
        ]).then(([productsRes, ordersRes, usersRes]) => {
            const products = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.products || []);
            const orders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data?.orders || []);
            const users = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.users || []);

            const totalRevenue = orders
                .filter(o => o.status !== 'canceled')
                .reduce((sum, o) => sum + (o.total || 0), 0);

            const pendingOrders = orders.filter(o => o.status === 'pending').length;
            const completedOrders = orders.filter(o => o.status === 'completed').length;
            const canceledOrders = orders.filter(o => o.status === 'canceled').length;

            const recentOrders = orders
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            setStats({
                totalProducts: products.length,
                totalOrders: orders.length,
                totalUsers: users.length,
                totalRevenue,
                pendingOrders,
                completedOrders,
                canceledOrders,
                recentOrders
            });
            setLoading(false);
        }).catch(err => {
            setLoading(false);
        });
    }, []);

    const StatCard = ({ icon: Icon, title, value, subtitle, trend }) => (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium mb-1" style={{ color: '#6b7280' }}>{title}</p>
                    <h3 className="text-3xl font-bold mb-1" style={{ color: '#000000' }}>{value}</h3>
                    {subtitle && <p className="text-xs" style={{ color: '#9ca3af' }}>{subtitle}</p>}
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <FaArrowTrendUp className={trend < 0 ? 'rotate-180' : ''} />
                            <span>{Math.abs(trend)}% from last month</span>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-red-50 rounded-full">
                    <Icon className="text-4xl text-red-600" />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-800 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    const testAnimation = () => {
        // Use a sample product image for testing
        const sampleImage = 'https://via.placeholder.com/400';
        setAnimationImage(sampleImage);
        setShowAnimation(true);
    };
    
    const testCardPack = (e) => {
        playCardPackAnimation(e.target.closest('button'));
    };
    
    const testWishlistRemove = (e) => {
        playWishlistRemoveAnimation(e.target.closest('button'));
    };
    
    const testCartJourney = () => {
        const productData = {
            images: ['https://via.placeholder.com/400']
        };
        playCartJourneyAnimation(document.querySelector('.test-cart-btn'), productData);
    };
    
    const testPaymentCelebration = () => {
        playPaymentCelebration();
    };
    
    const testStarSmash = () => {
        const container = document.createElement('div');
        container.innerHTML = Array(5).fill(0).map(() => '<button><span>⭐</span></button>').join('');
        container.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;gap:10px;z-index:10000;';
        document.body.appendChild(container);
        playStarSmash(container, 5).then(() => {
            setTimeout(() => container.remove(), 500);
        });
    };
    
    const testStarRain = () => {
        playStarRain(3000);
    };

    return (
        <div className="p-8 space-y-8">
            {showAnimation && animationImage && (
                <ProductDropAnimation 
                    imageUrl={animationImage} 
                    onComplete={() => {
                        setShowAnimation(false);
                        setAnimationImage(null);
                    }} 
                />
            )}
            
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <FaChartLine className="text-white" style={{ color: '#ffffff' }} />
                        Dashboard
                    </h1>
                    <p className="text-white/80">Welcome back! Here's what's happening with your store today.</p>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="text-right">
                        <p className="text-white/70 text-sm">Last updated</p>
                        <p className="text-white font-medium">{new Date().toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={FaMoneyBillWave}
                    title="Total Revenue"
                    value={`රු ${stats.totalRevenue.toLocaleString()}`}
                    subtitle="All time earnings"
                    trend={12.5}
                />
                <StatCard
                    icon={FiShoppingBag}
                    title="Total Orders"
                    value={stats.totalOrders}
                    subtitle={`${stats.pendingOrders} pending`}
                    trend={8.2}
                />
                <StatCard
                    icon={FaBoxArchive}
                    title="Products"
                    value={stats.totalProducts}
                    subtitle="In inventory"
                    trend={3.1}
                />
                <StatCard
                    icon={FaUsers}
                    title="Customers"
                    value={stats.totalUsers}
                    subtitle="Registered users"
                    trend={15.7}
                />
            </div>

            {/* Order Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                        <MdPendingActions className="text-5xl text-red-600" />
                        <div>
                            <p className="text-sm" style={{ color: '#6b7280' }}>Pending Orders</p>
                            <h3 className="text-4xl font-bold" style={{ color: '#000000' }}>{stats.pendingOrders}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                        <MdCheckCircle className="text-5xl text-red-600" />
                        <div>
                            <p className="text-sm" style={{ color: '#6b7280' }}>Completed</p>
                            <h3 className="text-4xl font-bold" style={{ color: '#000000' }}>{stats.completedOrders}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                        <MdCancel className="text-5xl text-red-600" />
                        <div>
                            <p className="text-sm" style={{ color: '#6b7280' }}>Canceled</p>
                            <h3 className="text-4xl font-bold" style={{ color: '#000000' }}>{stats.canceledOrders}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#000000' }}>
                    <FaShoppingCart className="text-red-600" />
                    Recent Orders
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium" style={{ color: '#6b7280' }}>Order ID</th>
                                <th className="text-left py-3 px-4 font-medium" style={{ color: '#6b7280' }}>Customer</th>
                                <th className="text-left py-3 px-4 font-medium" style={{ color: '#6b7280' }}>Total</th>
                                <th className="text-left py-3 px-4 font-medium" style={{ color: '#6b7280' }}>Status</th>
                                <th className="text-left py-3 px-4 font-medium" style={{ color: '#6b7280' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8" style={{ color: '#9ca3af' }}>No orders yet</td>
                                </tr>
                            ) : (
                                stats.recentOrders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 font-mono text-sm" style={{ color: '#000000' }}>#{order._id.slice(-6)}</td>
                                        <td className="py-4 px-4" style={{ color: '#000000' }}>{order.name}</td>
                                        <td className="py-4 px-4 font-semibold" style={{ color: '#000000' }}>රු {order.total?.toLocaleString()}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm" style={{ color: '#6b7280' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <a href="/admin/newProduct" className="rounded-xl p-6 text-center transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1 text-white" style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)' }}>
                    <FaBoxArchive className="text-4xl text-white mx-auto mb-3" style={{ color: '#ffffff' }} />
                    <h3 className="text-white font-bold text-lg">Add Product</h3>
                    <p className="text-white/80 text-sm mt-1">Create new listing</p>
                </a>
                <a href="/admin/orders" className="rounded-xl p-6 text-center transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1 text-white" style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)' }}>
                    <FiShoppingBag className="text-4xl text-white mx-auto mb-3" style={{ color: '#ffffff' }} />
                    <h3 className="text-white font-bold text-lg">Manage Orders</h3>
                    <p className="text-white/80 text-sm mt-1">Process & ship</p>
                </a>
                <a href="/admin/users" className="rounded-xl p-6 text-center transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1 text-white" style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)' }}>
                    <FaUsers className="text-4xl text-white mx-auto mb-3" style={{ color: '#ffffff' }} />
                    <h3 className="text-white font-bold text-lg">View Users</h3>
                    <p className="text-white/80 text-sm mt-1">Customer management</p>
                </a>
                <a href="/admin/settings" className="rounded-xl p-6 text-center transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1 text-white" style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)' }}>
                    <FaChartLine className="text-4xl text-white mx-auto mb-3" style={{ color: '#ffffff' }} />
                    <h3 className="text-white font-bold text-lg">Settings</h3>
                    <p className="text-white/80 text-sm mt-1">Configure store</p>
                </a>
            </div>
        </div>
    );
}
