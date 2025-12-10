import { useState, useEffect } from "react";
import { FiShoppingBag, FiSearch, FiMenu, FiX } from "react-icons/fi";
import { FaRegHeart, FaGift } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdAdminPanelSettings } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { syncCartCount } from "../utils/cart";
import { isAdminToken } from "../utils/auth";
import { getItem, removeItem } from "../utils/safeStorage.js";
import { useChristmas } from "../context/ChristmasContext";
import "./header.css";

export default function Header() {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const [token, setToken] = useState(null);
	const [cartCount, setCartCount] = useState(0);
	const [wishlistCount, setWishlistCount] = useState(0);
	const [isAdmin, setIsAdmin] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// Initialize state from storage
	useEffect(() => {
		setToken(getItem('token'));
		setCartCount(Number(getItem('cartCount') || 0));
		syncCartCount();
		setIsAdmin(isAdminToken());
	}, []);

	useEffect(()=>{
		function updateWishlistCount(){
			try{
				const wishlist = JSON.parse(getItem('wishlist') || '[]');
				setWishlistCount(wishlist.length);
			}catch(e){
				setWishlistCount(0);
			}
		}
		updateWishlistCount();
		function onUpdate(){ updateWishlistCount(); }
		if(typeof window !== 'undefined'){
			window.addEventListener('wishlist:updated', onUpdate);
			window.addEventListener('storage', onUpdate);
			return ()=> {
				window.removeEventListener('wishlist:updated', onUpdate);
				window.removeEventListener('storage', onUpdate);
			};
		}
	},[]);

	useEffect(()=>{
		function onUpdate(e){ setCartCount( Number(getItem('cartCount') || 0) ); }
		if(typeof window !== 'undefined'){
			window.addEventListener('cart:updated', onUpdate);
			return ()=> window.removeEventListener('cart:updated', onUpdate);
		}
	},[]);

	useEffect(()=>{
		if(isOpen) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = '';
		return ()=> { document.body.style.overflow = ''; };
	}, [isOpen]);

	useEffect(()=>{
		function onKey(e){ if(e.key === 'Escape') setIsOpen(false) }
		document.addEventListener('keydown', onKey)
		return ()=> document.removeEventListener('keydown', onKey)
	},[])

	const { christmasMode, discount: christmasDiscount } = useChristmas();

	const handleSearch = (e) => {
		e.preventDefault();
		if(searchQuery.trim()) {
			navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
		}
	};

	const categories = [
		{ name: "NEW ARRIVALS", path: "/products?category=new" },
		{ name: "BEST SELLERS", path: "/products?category=bestsellers" },
		{ name: "WOMEN", path: "/products?category=women" },
		{ name: "MEN", path: "/products?category=men" },
		{ name: "KIDS", path: "/products?category=kids" },
		{ name: "HOME & DECOR", path: "/products?category=home" },
		{ name: "PERSONAL CARE", path: "/products?category=personal" },
		{ name: "TRAVEL GEAR", path: "/products?category=travel" },
		{ name: "MOTHER & BABYCARE", path: "/products?category=baby" },
		{ name: "GIFT CARDS", path: "/products?category=giftcards" },
	];

	return (
		<>
			{christmasMode && (
				<div className="header-promo">
					🎄 CHRISTMAS SALE - {christmasDiscount}% OFF ON ALL ITEMS! 🎅
				</div>
			)}
			
			<header className="header-main">
				{/* Top section - Logo, Search, Icons */}
				<div className="header-top">
					<div className="header-left">
						<button 
							className="menu-toggle md:hidden"
							onClick={() => setIsOpen(!isOpen)}
						>
							{isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
						</button>
						<Link to="/" className="logo">
							<img src="/logo.png" alt="Nikola" />
						</Link>
					</div>

					<form onSubmit={handleSearch} className="search-container">
						<input 
							type="text"
							placeholder="Type and hit enter to search..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="search-input"
						/>
						<button type="submit" className="search-btn">
							<FiSearch size={20} />
						</button>
					</form>

					<div className="header-right">
						<div className="currency-badge">LKR</div>
						
						<button className="icon-btn" title="Settings">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<circle cx="12" cy="12" r="3"></circle>
								<path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6m-13.78 7.78l4.24-4.24m3.08-3.08l4.24-4.24"></path>
							</svg>
						</button>

						<Link to="/wishlist" className="icon-btn wishlist-icon">
							<FaRegHeart size={20} />
							{wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
						</Link>

						<Link to="/cart" className="icon-btn cart-icon">
							<FiShoppingBag size={20} />
							{cartCount > 0 && <span className="badge">{cartCount}</span>}
						</Link>

						{!token ? (
							<button 
								onClick={() => navigate('/login')}
								className="auth-btn"
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
									<circle cx="12" cy="7" r="4"></circle>
								</svg>
							</button>
						) : (
							<button 
								onClick={() => {
									removeItem('token');
									removeItem('role');
									setToken(null);
									navigate('/login');
								}}
								className="auth-btn"
								title="Logout"
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
									<polyline points="16 17 21 12 16 7"></polyline>
									<line x1="21" y1="12" x2="9" y2="12"></line>
								</svg>
							</button>
						)}
					</div>
				</div>

				{/* Categories Navigation */}
				<nav className="header-nav">
					{categories.map((cat, idx) => (
						<Link 
							key={idx}
							to={cat.path}
							className="nav-link"
						>
							{cat.name}
						</Link>
					))}
					{christmasMode && (
						<Link 
							to="/christmas-offers"
							className="nav-link offers-link"
						>
							<FaGift size={16} /> OFFERS
						</Link>
					)}
					{christmasMode && (
						<Link 
							to="/christmas-offers"
							className="nav-link promo-link"
						>
							🔥 BELOW 2000
						</Link>
					)}
				</nav>

				{/* Mobile Menu */}
				{isOpen && (
					<div className="mobile-menu">
						<div className="mobile-categories">
							{categories.map((cat, idx) => (
								<Link 
									key={idx}
									to={cat.path}
									className="mobile-cat-link"
									onClick={() => setIsOpen(false)}
								>
									{cat.name}
								</Link>
							))}
							{christmasMode && (
								<Link 
									to="/christmas-offers"
									className="mobile-cat-link offers"
									onClick={() => setIsOpen(false)}
								>
									🎁 CHRISTMAS OFFERS
								</Link>
							)}
						</div>
					</div>
				)}
			</header>
		</>
	);
}
