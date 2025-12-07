import { useState, useEffect } from "react";
import { addToCart, getCart, getTotal, syncCartCount } from "../../utils/cart";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

export default function CartPage() {
	const [cart, setCart] = useState(getCart());
	const navigate = useNavigate();
	
	// Sync cart count on mount
	useEffect(() => {
		syncCartCount();
	}, []);
	
	return (
		<div className="w-full min-h-screen bg-gray-50 flex flex-col px-4 md:px-6 py-6 md:py-10">
			<div className="max-w-5xl mx-auto w-full">
				<h1 className="text-2xl md:text-3xl font-bold text-black mb-6">Shopping Cart</h1>
				
				{cart.length === 0 ? (
					<div className="bg-white rounded-lg p-12 md:p-16 text-center shadow-sm">
						<div className="text-6xl md:text-7xl mb-4">🛒</div>
						<h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
						<p className="text-gray-500 mb-6">Start adding some amazing products to your cart!</p>
						<button 
							onClick={() => navigate('/products')}
							className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-md"
						>
							Continue Shopping
						</button>
					</div>
				) : (
					<>
						<div className="space-y-4 mb-6">
							{cart.map((item) => (
								<div
									key={item.productId}
									className="bg-white rounded-lg p-4 shadow-sm flex gap-4 relative"
								>
									{/* Product Image */}
									<img
										src={item.image}
										alt={item.name}
										className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md flex-shrink-0"
									/>
									
									{/* Product Details */}
									<div className="flex-1 min-w-0">
										<h3 className="font-semibold text-black text-sm md:text-base truncate pr-8">{item.name}</h3>
										<p className="text-gray-600 text-sm mt-1">
											${item.price.toFixed(2)}
										</p>
										
										{/* Quantity Controls */}
										<div className="flex items-center gap-3 mt-3">
											<div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
												<button
													className="w-8 h-8 flex items-center justify-center bg-white rounded text-gray-700 hover:bg-red-600 hover:text-white transition"
													onClick={() => {
														addToCart(item, -1);
														setCart(getCart());
													}}
												>
													-
												</button>
												<span className="w-8 text-center font-medium text-black">{item.quantity}</span>
												<button
													className="w-8 h-8 flex items-center justify-center bg-white rounded text-gray-700 hover:bg-red-600 hover:text-white transition"
													onClick={() => {
														addToCart(item, 1);
														setCart(getCart());
													}}
												>
													+
												</button>
											</div>
											<span className="font-semibold text-black text-sm md:text-base">
												${(item.quantity * item.price).toFixed(2)}
											</span>
										</div>
									</div>
									
									{/* Delete Button */}
									<button
										className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
										onClick={() => {
											addToCart(item, -item.quantity);
											setCart(getCart());
										}}
									>
										<MdDelete className="text-lg" />
									</button>
								</div>
							))}
						</div>
						
						{/* Cart Summary */}
						<div className="bg-white rounded-lg p-6 shadow-sm">
							<div className="flex items-center justify-between mb-4">
								<span className="text-lg font-semibold text-black">Total:</span>
								<span className="text-2xl font-bold text-black">${getTotal().toFixed(2)}</span>
							</div>
							<button
								className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
								onClick={() => navigate("/checkout", { state: { items: cart } })}
							>
								Proceed to Checkout
							</button>
							<button
								className="w-full mt-3 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
								onClick={() => navigate('/products')}
							>
								Continue Shopping
							</button>
						</div>
					</>
				)}
			</div>
			<Footer />
		</div>
	);
}
