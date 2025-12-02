import { useEffect } from 'react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	useEffect(() => {
		function handleEscape(e) {
			if (e.key === 'Escape') onClose();
		}
		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			return () => document.removeEventListener('keydown', handleEscape);
		}
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center">
			{/* Backdrop */}
			<div 
				className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
				onClick={onClose}
			/>
			
			{/* Modal */}
			<div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 animate-scaleIn">
				<div className="p-6">
					<h3 className="text-xl font-bold text-black mb-2">
						{title || 'Confirm Action'}
					</h3>
					<p className="text-gray-600 mb-6">
						{message || 'Are you sure you want to proceed?'}
					</p>
					
					<div className="flex gap-3 justify-end">
						<button
							onClick={onClose}
							className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
						>
							Cancel
						</button>
						<button
							onClick={() => {
								onConfirm();
								onClose();
							}}
							className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition shadow-md"
						>
							OK
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
