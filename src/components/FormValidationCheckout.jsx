/**
 * ENHANCED FORM VALIDATION COMPONENT
 * ==================================
 * Professional, real-time form validation with visual feedback.
 * 
 * Features:
 * - Real-time validation with immediate feedback
 * - Visual indicators (green/red borders)
 * - Error messages as user types
 * - Email format validation
 * - Card number validation (16 digits)
 * - Expiry date validation (future date required)
 * - Success modal on valid submission
 * - Keyboard navigation support
 * - Accessibility features (ARIA labels)
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function FormValidationCheckout() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Validation rules
    const validationRules = {
        fullName: (value) => {
            if (!value?.trim()) return 'Full name is required';
            if (value.trim().length < 3) return 'Name must be at least 3 characters';
            return '';
        },
        email: (value) => {
            if (!value?.trim()) return 'Email is required';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Invalid email format';
            return '';
        },
        cardNumber: (value) => {
            if (!value?.trim()) return 'Card number is required';
            const cleaned = value.replace(/\s/g, '');
            if (!/^\d+$/.test(cleaned)) return 'Card number must contain only digits';
            if (cleaned.length !== 16) return `Card number must be 16 digits (currently ${cleaned.length})`;
            return '';
        },
        expiry: (value) => {
            if (!value?.trim()) return 'Expiry date is required';
            const [month, year] = value.split('/').map(v => v.trim());
            
            if (!month || !year) return 'Format should be MM/YY';
            if (!/^\d{2}$/.test(month)) return 'Month must be 2 digits';
            if (!/^\d{2}$/.test(year)) return 'Year must be 2 digits';
            
            const monthNum = parseInt(month);
            if (monthNum < 1 || monthNum > 12) return 'Month must be 01-12';
            
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;
            
            const expireYear = parseInt(year);
            const expireMonth = parseInt(month);
            
            if (expireYear < currentYear || (expireYear === currentYear && expireMonth < currentMonth)) {
                return 'Card has expired or expiry date is in the past';
            }
            
            return '';
        },
        cvv: (value) => {
            if (!value?.trim()) return 'CVV is required';
            if (!/^\d{3,4}$/.test(value.trim())) return 'CVV must be 3 or 4 digits';
            return '';
        },
    };

    // Validate field on change
    const validateField = (fieldName, value) => {
        const validator = validationRules[fieldName];
        return validator ? validator(value) : '';
    };

    // Handle input change with real-time validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Special formatting for card number and expiry
        let formattedValue = value;
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\D/g, '').slice(0, 16);
        } else if (name === 'expiry') {
            const cleaned = value.replace(/\D/g, '').slice(0, 4);
            if (cleaned.length >= 2) {
                formattedValue = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
            } else {
                formattedValue = cleaned;
            }
        } else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue,
        }));

        // Validate on change if field has been touched
        if (touched[name]) {
            const error = validateField(name, formattedValue);
            setErrors(prev => ({
                ...prev,
                [name]: error,
            }));
        }
    };

    // Handle field blur - mark as touched and validate
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true,
        }));

        const error = validateField(name, formData[name]);
        setErrors(prev => ({
            ...prev,
            [name]: error,
        }));
    };

    // Check if form is valid
    const isFormValid = () => {
        const newErrors = {};
        Object.keys(validationRules).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = {};
        Object.keys(validationRules).forEach(field => {
            allTouched[field] = true;
        });
        setTouched(allTouched);

        // Validate all fields
        const newErrors = {};
        Object.keys(validationRules).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);

        // If invalid, show error
        if (Object.keys(newErrors).length > 0) {
            toast.error('Please fix the errors in the form');
            return;
        }

        // Simulate submission
        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success modal
            setShowSuccessModal(true);
            
            // Reset form after delay
            setTimeout(() => {
                setFormData({
                    fullName: '',
                    email: '',
                    cardNumber: '',
                    expiry: '',
                    cvv: '',
                });
                setTouched({});
                setErrors({});
                setShowSuccessModal(false);
            }, 3000);
        } catch (error) {
            toast.error('Failed to process order');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get input border color based on validation state
    const getInputBorderClass = (fieldName) => {
        if (!touched[fieldName]) return 'border-gray-300';
        if (errors[fieldName]) return 'border-red-500 focus:border-red-500';
        return 'border-green-500 focus:border-green-500';
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-black mb-2">Secure Checkout</h1>
                    <p className="text-gray-600">Your payment information is encrypted and secure</p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-lg p-8 space-y-6"
                    noValidate
                >
                    {/* Full Name */}
                    <div>
                        <label
                            htmlFor="fullName"
                            className="block text-sm font-semibold text-black mb-2"
                        >
                            Full Name <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${getInputBorderClass(
                                    'fullName'
                                )}`}
                                placeholder="John Doe"
                                aria-invalid={!!errors.fullName}
                                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                            />
                            {touched.fullName && !errors.fullName && (
                                <span className="absolute right-3 top-3 text-green-500 text-xl">✓</span>
                            )}
                        </div>
                        {errors.fullName && touched.fullName && (
                            <p id="fullName-error" className="text-red-600 text-sm mt-1">
                                {errors.fullName}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-black mb-2"
                        >
                            Email <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${getInputBorderClass(
                                    'email'
                                )}`}
                                placeholder="you@example.com"
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                            />
                            {touched.email && !errors.email && (
                                <span className="absolute right-3 top-3 text-green-500 text-xl">✓</span>
                            )}
                        </div>
                        {errors.email && touched.email && (
                            <p id="email-error" className="text-red-600 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Card Number */}
                    <div>
                        <label
                            htmlFor="cardNumber"
                            className="block text-sm font-semibold text-black mb-2"
                        >
                            Card Number <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="cardNumber"
                                name="cardNumber"
                                type="text"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition font-mono tracking-wider ${getInputBorderClass(
                                    'cardNumber'
                                )}`}
                                placeholder="1234 5678 9012 3456"
                                inputMode="numeric"
                                maxLength="16"
                                aria-invalid={!!errors.cardNumber}
                                aria-describedby={errors.cardNumber ? 'cardNumber-error' : undefined}
                            />
                            {touched.cardNumber && !errors.cardNumber && (
                                <span className="absolute right-3 top-3 text-green-500 text-xl">✓</span>
                            )}
                        </div>
                        {errors.cardNumber && touched.cardNumber && (
                            <p id="cardNumber-error" className="text-red-600 text-sm mt-1">
                                {errors.cardNumber}
                            </p>
                        )}
                        {touched.cardNumber && !errors.cardNumber && (
                            <p className="text-green-600 text-sm mt-1">Card number is valid</p>
                        )}
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Expiry */}
                        <div>
                            <label
                                htmlFor="expiry"
                                className="block text-sm font-semibold text-black mb-2"
                            >
                                Expiry <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="expiry"
                                    name="expiry"
                                    type="text"
                                    value={formData.expiry}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition font-mono ${getInputBorderClass(
                                        'expiry'
                                    )}`}
                                    placeholder="MM/YY"
                                    inputMode="numeric"
                                    maxLength="5"
                                    aria-invalid={!!errors.expiry}
                                    aria-describedby={errors.expiry ? 'expiry-error' : undefined}
                                />
                                {touched.expiry && !errors.expiry && (
                                    <span className="absolute right-3 top-3 text-green-500 text-xl">✓</span>
                                )}
                            </div>
                            {errors.expiry && touched.expiry && (
                                <p id="expiry-error" className="text-red-600 text-sm mt-1">
                                    {errors.expiry}
                                </p>
                            )}
                        </div>

                        {/* CVV */}
                        <div>
                            <label
                                htmlFor="cvv"
                                className="block text-sm font-semibold text-black mb-2"
                            >
                                CVV <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="cvv"
                                    name="cvv"
                                    type="text"
                                    value={formData.cvv}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition font-mono ${getInputBorderClass(
                                        'cvv'
                                    )}`}
                                    placeholder="123"
                                    inputMode="numeric"
                                    maxLength="4"
                                    aria-invalid={!!errors.cvv}
                                    aria-describedby={errors.cvv ? 'cvv-error' : undefined}
                                />
                                {touched.cvv && !errors.cvv && (
                                    <span className="absolute right-3 top-3 text-green-500 text-xl">✓</span>
                                )}
                            </div>
                            {errors.cvv && touched.cvv && (
                                <p id="cvv-error" className="text-red-600 text-sm mt-1">
                                    {errors.cvv}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 font-bold text-white rounded-lg transition text-lg ${
                            isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 active:scale-95'
                        }`}
                    >
                        {isSubmitting ? 'Processing...' : 'Complete Payment'}
                    </button>

                    {/* Security Note */}
                    <div className="pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
                        🔒 Your payment is secure and encrypted with SSL technology
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-sm animate-scale-in">
                        <div className="text-6xl mb-4">✓</div>
                        <h2 className="text-2xl font-bold text-black mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-6">
                            Your order has been placed. We'll send a confirmation email shortly.
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
                            <p className="font-semibold">Order Summary</p>
                            <p>Email: {formData.email}</p>
                            <p>Confirmation will be sent to your email</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
