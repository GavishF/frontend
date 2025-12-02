import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { parseProductsXLS, downloadProductTemplate } from "../../utils/xls";
import { BiEdit, BiPlus, BiTrash } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { getItem } from "../../utils/safeStorage.js";

export default function ProductsAdminPage() {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [importing, setImporting] = useState(false);

	// const [a,setA] = useState(0);
	useEffect(() => {
		if (isLoading) {
			axios
				.get(import.meta.env.VITE_BACKEND_URL + "/api/products")
				.then((res) => {
					setProducts(res.data);
					setIsLoading(false);
				})
				.catch((err) => {
					toast.error('Failed to load products');
					setIsLoading(false);
				});
		}
	}, [isLoading]);

	const navigate = useNavigate();

	async function handleImportXls(event){
		const file = event.target.files?.[0];
		if(!file) return;
		setImporting(true);
		try{
			const rows = await parseProductsXLS(file);
			const token = getItem('token');
			if(!token){ toast.error('Login required'); setImporting(false); return; }
			
			let successCount = 0;
			let failCount = 0;
			
			for(const row of rows){
				try{
					// Validate required fields before sending
					if(!row.name || !row.description || !row.category){
						failCount++;
						continue;
					}
					await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/products', row, { headers: { Authorization: 'Bearer ' + token } });
					successCount++;
				}catch(e){ 
					failCount++;
				}
			}
			
			if(successCount > 0){
				toast.success(`Imported ${successCount} product(s)${failCount > 0 ? `, ${failCount} failed` : ''}`);
				const r = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/products');
				setProducts(r.data);
			} else {
				toast.error(`Failed to import all products`);
			}
		}catch(err){ 
			toast.error('Failed to import XLS: ' + (err.message || 'Unknown error')); 
		}
		finally{ setImporting(false); event.target.value=''; }
	}

	return (
		<div className="w-full h-full bg-white">
			<div className="flex justify-between items-center p-4 border-b border-gray-200">
				<h2 className="text-2xl font-bold text-black">Products</h2>
				<div className="flex gap-2 items-center">
					<button onClick={()=> downloadProductTemplate()} className="px-3 py-2 rounded text-white hover:opacity-90" style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)', color: '#ffffff' }}>Download XLS Template</button>
					<label className="px-3 py-2 rounded bg-white border border-gray-300 text-black cursor-pointer" style={{ borderColor: '#d1d5db' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8C0009'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}>
						{importing ? 'Importing...' : 'Import XLS'}
						<input type="file" accept=".xls,.xlsx" onChange={handleImportXls} className="hidden" />
					</label>
				</div>
			</div>
			{isLoading ? (
				<div className="w-full h-full flex items-center justify-center">
					<div className="text-gray-600">Loading products...</div>
				</div>
			) : (
				<table className="w-full">
					<thead className="bg-gray-100">
						<tr>
							<th className="p-[10px] text-black text-left">Image</th>
							<th className="p-[10px] text-black text-left">Product ID</th>
							<th className="p-[10px] text-black text-left">Name</th>
							<th className="p-[10px] text-black text-left">Price</th>
							<th className="p-[10px] text-black text-left">Labelled Price</th>
							<th className="p-[10px] text-black text-left">Category</th>
							<th className="p-[10px] text-black text-left">Stock</th>
							<th className="p-[10px] text-black text-left">Actions</th>
						</tr>
					</thead>

					<tbody>
						{products.map((product, index) => {
							return (
								<tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
									<td>
										<img
											src={product.images[0]}
											alt={product.name}
											className="w-[50px] h-[50px]"
										/>
									</td>
									<td className="p-[10px] text-black">{product.productId}</td>
									<td className="p-[10px] text-black">{product.name}</td>
									<td className="p-[10px] text-black">{product.price}</td>
									<td className="p-[10px] text-black">{product.labelledPrice}</td>
									<td className="p-[10px] text-black">{product.category}</td>
									<td className="p-[10px] text-black">{product.stock}</td>
									<td className="p-[10px] flex flex-row justify-center items-center">
									<BiTrash
										className="p-[7px] text-3xl rounded-full shadow-2xl shadow-black cursor-pointer"
										style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)', color: '#ffffff' }}
										onClick={() => {
											const token = getItem("token");
											if (token == null) {
												navigate("/login");
												return;
											}
												axios
													.delete(
														import.meta.env.VITE_BACKEND_URL + "/api/products/" + product.productId,
														{
															headers: {
																Authorization: `Bearer ${token}`,
															},
														}
													)
													.then((res) => {
														toast.success("Product deleted successfully");
														setIsLoading(!isLoading);
													})
													.catch((error) => {
														toast.error("Failed to delete product");
													});
											}}
										/>
									<BiEdit
										onClick={() => {
											navigate("/admin/updateProduct", {
												state: product,
											});
										}}
										className="p-[7px] text-3xl rounded-full shadow-2xl shadow-black cursor-pointer ml-[10px] hover:opacity-90"
										style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)', color: '#ffffff' }}
									/>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
			<Link
				to="/admin/newProduct"
				className="fixed right-[60px] bottom-[60px] p-[20px] rounded-full shadow-2xl hover:opacity-90"
				style={{ background: 'linear-gradient(135deg, #8C0009 0%, #BE0108 100%)', color: '#ffffff' }}
			>
					<BiPlus className="text-3xl" style={{ color: '#ffffff' }} />
			</Link>
		</div>
	);
}
