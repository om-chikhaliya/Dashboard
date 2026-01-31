import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { X, CreditCard, Zap, Calendar, DollarSign, Check, AlertCircle, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from './helper/api';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key');

// Card element styling
const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            },
            padding: '12px'
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    }
};

// Saved Payment Methods List Component
const SavedPaymentMethodsList = ({ paymentMethods, autoPayEnabled, onSetDefault, onRemove, onToggleAutoPay }) => {
    const getCardBrandIcon = (brand) => {
        const brandLower = brand?.toLowerCase() || '';
        if (brandLower.includes('visa')) return '💳';
        if (brandLower.includes('mastercard')) return '💳';
        if (brandLower.includes('amex')) return '💳';
        return '💳';
    };

    if (!paymentMethods || paymentMethods.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No payment methods saved yet</p>
                <p className="text-sm mt-1">Add a card below to get started</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Auto-Pay Toggle */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-blue-800">Auto-Pay</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Automatically charge 1% of monthly revenue to your default card
                            </p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={autoPayEnabled}
                            onChange={(e) => onToggleAutoPay(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            {/* Payment Methods List */}
            <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Your Payment Methods</h3>
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        className={`border rounded-lg p-4 transition-all ${
                            method.isDefault
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{getCardBrandIcon(method.brand)}</span>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium capitalize">{method.brand}</span>
                                        <span className="text-gray-600">•••• {method.last4}</span>
                                        {method.isDefault && (
                                            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Expires {String(method.expMonth).padStart(2, '0')}/{method.expYear}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {!method.isDefault && (
                                    <button
                                        onClick={() => onSetDefault(method.id)}
                                        className="px-3 py-1.5 text-sm border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        Set as Default
                                    </button>
                                )}
                                <button
                                    onClick={() => onRemove(method.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove card"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Add New Card Form Component
const AddNewCardForm = ({ onSuccess, onClose, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const createSetupIntent = async () => {
            try {
                const response = await api.post('/payment/setup-intent');
                setClientSecret(response.data.clientSecret);
            } catch (err) {
                setError('Failed to initialize payment setup');
                console.error(err);
            }
        };
        createSetupIntent();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            });

            if (stripeError) {
                setError(stripeError.message);
                setLoading(false);
                return;
            }

            if (setupIntent.status === 'succeeded') {
                await api.post('/payment/save-payment-method', {
                    paymentMethodId: setupIntent.payment_method
                });
                
                toast.success('Card added successfully!');
                onSuccess && onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save card. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Details
                </label>
                <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || loading || !clientSecret}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4" />
                            Add Card
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

// Main Payment Modal Component
const PaymentModal = ({ isOpen, onClose, refreshData }) => {
    const [billingInfo, setBillingInfo] = useState(null);
    const [showAddCard, setShowAddCard] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchBillingInfo();
        }
    }, [isOpen]);

    const fetchBillingInfo = async () => {
        try {
            setLoading(true);
            const response = await api.get('/payment/billing-info');
            setBillingInfo(response.data);
            
            // Show add card form if no payment methods exist
            if (!response.data.paymentMethods || response.data.paymentMethods.length === 0) {
                setShowAddCard(true);
            }
        } catch (error) {
            console.error('Failed to fetch billing info:', error);
            toast.error('Failed to load payment information');
        } finally {
            setLoading(false);
        }
    };

    const handleCardAdded = () => {
        setShowAddCard(false);
        fetchBillingInfo();
        refreshData && refreshData();
    };

    const handleSetDefault = async (paymentMethodId) => {
        try {
            await api.post('/payment/methods/set-default', { paymentMethodId });
            toast.success('Default payment method updated');
            fetchBillingInfo();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to set default payment method');
        }
    };

    const handleRemoveCard = async (paymentMethodId) => {
        if (!confirm('Are you sure you want to remove this payment method?')) {
            return;
        }

        try {
            await api.delete(`/payment/methods/${paymentMethodId}`, {
                data: { paymentMethodId }
            });
            toast.success('Payment method removed');
            fetchBillingInfo();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to remove payment method');
        }
    };

    const handleToggleAutoPay = async (enabled) => {
        try {
            await api.post('/payment/toggle-autopay', { enabled });
            toast.success(`Auto-pay ${enabled ? 'enabled' : 'disabled'}`);
            fetchBillingInfo();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to toggle auto-pay');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Payment Settings</h2>
                                <p className="text-slate-400 text-sm">Manage your billing & payments</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Saved Payment Methods */}
                            {!showAddCard && (
                                <>
                                    <SavedPaymentMethodsList
                                        paymentMethods={billingInfo?.paymentMethods || []}
                                        autoPayEnabled={billingInfo?.autoPayEnabled || false}
                                        onSetDefault={handleSetDefault}
                                        onRemove={handleRemoveCard}
                                        onToggleAutoPay={handleToggleAutoPay}
                                    />
                                    
                                    <button
                                        onClick={() => setShowAddCard(true)}
                                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add New Payment Method
                                    </button>
                                </>
                            )}

                            {/* Add New Card Form */}
                            {showAddCard && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4">Add New Payment Method</h3>
                                    <Elements stripe={stripePromise}>
                                        <AddNewCardForm 
                                            onSuccess={handleCardAdded} 
                                            onClose={onClose}
                                            onCancel={() => setShowAddCard(false)}
                                        />
                                    </Elements>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Payments are securely processed by Stripe. We never store your card details.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
