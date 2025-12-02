import { useState, useEffect } from "react";
import { getWishlist, removeFromWishlist } from "../../utils/wishlist";
import { addToCart } from "../../utils/cart";
import { TbTrash, TbShoppingCart } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal";
import { playWishlistRemoveAnimation, playCartJourneyAnimation } from "../../utils/cardAnimations";

export default function WishlistPage() {
	const [wishlist, setWishlist] = useState([]);
	const [clearModalOpen, setClearModalOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setWishlist(getWishlist());
	}, []);

	const handleRemove = (productId, element) => {
		if (element) {
			playWishlistRemoveAnimation(element, () => {
				const result = removeFromWishlist(productId);
				if (result.success) {
					setWishlist(getWishlist());
					toast.success("Removed from wishlist");
					window.dispatchEvent(new Event('wishlist:updated'));
				} else {
					toast.error(result.message);
				}
			});
		}
	};

	const handleAddToCart = (item, element) => {
		const productData = {
			productId: item.productId,
			name: item.name,
			price: item.price,
			images: [item.image],
		};
		addToCart(productData, 1);
		
		if (element) {
			playCartJourneyAnimation(element, productData).then(() => {
				toast.success("Added to cart");
			});
		} else {
			toast.success("Added to cart");
		}
	};

	return (
		<div className="w-full min-h-screen bg-white flex flex-col px-6 py-12">
			<div className="w-full max-w-6xl mx-auto">
				<h1 className="text-4xl font-bold text-black mb-8">My Wishlist</h1>

				{wishlist.length === 0 ? (
					<div className="text-center py-20">
						<div className="text-6xl mb-4">♡</div>
						<h2 className="text-2xl font-semibold text-gray-700 mb-2">
							Your wishlist is empty
						</h2>
						<p className="text-gray-500 mb-6">
							Save your favorite items here for later
						</p>
						<button
							onClick={() => navigate("/products")}
							className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition shadow-md"
						>
							Continue Shopping
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{wishlist.map((item) => (
							<div
								key={item.productId}
								id={`wishlist-item-${item.productId}`}
								className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group"
							>
								<div className="relative">
									<img
										src={item.image}
										alt={item.name}
										className="w-full h-64 object-cover cursor-pointer"
										onClick={() => navigate(`/overview/${item.productId}`)}
									/>
									<button
										onClick={(e) => handleRemove(item.productId, document.getElementById(`wishlist-item-${item.productId}`))}
										className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition"
									>
										<TbTrash className="text-xl text-red-600" />
									</button>
								</div>
								<div className="p-4">
									<div className="mb-2">
										<span className="text-xs uppercase text-gray-500 tracking-wide">
											{item.category || "All"}
										</span>
									</div>
									<h3
										className="text-lg font-semibold text-black mb-2 cursor-pointer hover:text-red-600 transition"
										onClick={() => navigate(`/overview/${item.productId}`)}
									>
										{item.name}
									</h3>
									<div className="flex items-center justify-between">
										<span className="text-xl font-bold text-black">
											රු {item.price.toFixed(2)}
										</span>
									<button
										onClick={() => handleAddToCart(item, document.getElementById(`wishlist-item-${item.productId}`))}
										className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition flex items-center gap-2 shadow-md"
									>
										<TbShoppingCart className="text-lg" />
										Add to Cart
									</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{wishlist.length > 0 && (
					<div className="mt-8 flex justify-between items-center">
						<button
							onClick={() => setClearModalOpen(true)}
							className="px-6 py-2 text-red-600 border-2 border-red-600 font-semibold rounded-lg hover:bg-red-50 transition"
						>
						Clear Wishlist
					</button>
					<button
						onClick={() => navigate("/products")}
						className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition shadow-md"
					>
						Continue Shopping
					</button>
				</div>
			)}
			
			{/* Clear Wishlist Confirmation Modal */}
			<ConfirmModal
				isOpen={clearModalOpen}
				onClose={() => setClearModalOpen(false)}
				onConfirm={() => {
					wishlist.forEach((item) => removeFromWishlist(item.productId));
					setWishlist([]);
					toast.success("Wishlist cleared");
					window.dispatchEvent(new Event('wishlist:updated'));
				}}
				title="Clear Wishlist"
				message="Are you sure you want to remove all items from your wishlist?"
			/>
		</div>
	</div>
);
}