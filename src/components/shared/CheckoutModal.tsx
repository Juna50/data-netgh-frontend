import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, CreditCard, CheckCircle2, AlertCircle, Loader2, Clock } from 'lucide-react';
import type { Product, CheckoutResponse } from '../../types';
import { formatCurrency, isValidGhanaPhone, detectNetwork, networkDisplayName } from '../../lib/utils';
import api from '../../lib/api';

interface CheckoutModalProps {
  product: Product | null;
  onClose: () => void;
}

type Step = 'form' | 'paying' | 'success' | 'error';

const CheckoutModal = ({ product, onClose }: CheckoutModalProps) => {
  const [step, setStep] = useState<Step>('form');
  const [recipientNumber, setRecipientNumber] = useState('');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [paymentNetwork, setPaymentNetwork] = useState('MTN');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderResult, setOrderResult] = useState<CheckoutResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-detect payment network from phone number
  useEffect(() => {
    if (paymentNumber.length === 10) {
      const detected = detectNetwork(paymentNumber);
      if (detected) {
        const map: Record<string, string> = { mtn: 'MTN', airteltigo: 'AIRTELTIGO', telecel: 'TELECEL' };
        setPaymentNetwork(map[detected]);
      }
    }
  }, [paymentNumber]);

  // For data bundles, auto-fill recipient from payment number
  const isResultChecker = product?.product_type === 'result_checker';

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!isResultChecker && !isValidGhanaPhone(recipientNumber)) {
      errs.recipient = 'Enter a valid 10-digit Ghana number (e.g. 0551234567)';
    }
    if (!isValidGhanaPhone(paymentNumber)) {
      errs.payment = 'Enter a valid 10-digit Ghana number for payment';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !product) return;
    setStep('paying');

    try {
      const finalRecipient = isResultChecker ? paymentNumber : recipientNumber;
      const response = await api.post('/orders', {
        product_id: product.id,
        recipient_number: finalRecipient,
        payment_number: paymentNumber,
        payment_network: paymentNetwork,
        customer_email: email || undefined,
      });

      setOrderResult(response.data.data);
      setStep('success');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Payment failed. Please try again.');
      setStep('error');
    }
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={step === 'form' || step === 'error' ? onClose : undefined}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-gray-900">
                {step === 'success' ? 'Order Confirmed!' : step === 'paying' ? 'Processing...' : step === 'error' ? 'Payment Failed' : 'Checkout'}
              </h2>
              {step === 'form' && (
                <p className="text-sm text-gray-500">{product.name} · {formatCurrency(product.price)}</p>
              )}
            </div>
            {(step === 'form' || step === 'success' || step === 'error') && (
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Form step */}
          {step === 'form' && (
            <div className="p-5 space-y-4">
              {/* Product summary */}
              <div className="bg-sky-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">{product.size} {product.product_type === 'data_bundle' ? 'Data Bundle' : 'Result Checker'}</p>
                    <p className="text-sm text-gray-500">{networkDisplayName[product.network] || product.network}</p>
                  </div>
                  <span className="text-xl font-bold text-sky-600">{formatCurrency(product.price)}</span>
                </div>
              </div>

              {/* Recipient number (data bundles only) */}
              {!isResultChecker && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Recipient Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={recipientNumber}
                      onChange={(e) => setRecipientNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="0551234567"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                        errors.recipient ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-sky-400'
                      }`}
                    />
                  </div>
                  {errors.recipient && <p className="text-xs text-red-500 mt-1">{errors.recipient}</p>}
                  <p className="text-xs text-gray-400 mt-1">The number that will receive the data bundle</p>
                </div>
              )}

              {/* Payment MoMo number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  MoMo Payment Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={paymentNumber}
                    onChange={(e) => setPaymentNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="0551234567"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                      errors.payment ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-sky-400'
                    }`}
                  />
                </div>
                {errors.payment && <p className="text-xs text-red-500 mt-1">{errors.payment}</p>}
                {paymentNumber.length === 10 && (
                  <p className="text-xs text-sky-600 mt-1">
                    Detected network: {paymentNetwork}
                  </p>
                )}
              </div>

              {/* Payment network selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Network</label>
                <div className="grid grid-cols-3 gap-2">
                  {['MTN', 'AIRTELTIGO', 'TELECEL'].map((n) => (
                    <button
                      key={n}
                      onClick={() => setPaymentNetwork(n)}
                      className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                        paymentNetwork === n
                          ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:border-sky-300 hover:bg-sky-50'
                      }`}
                    >
                      {n === 'AIRTELTIGO' ? 'AirtelTigo' : n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-gray-400 text-xs">(optional, for receipt)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                Pay {formatCurrency(product.price)}
              </button>
              <p className="text-xs text-center text-gray-400">
                🔒 Secure checkout via Mobile Money. You'll receive a prompt on your phone.
              </p>
            </div>
          )}

          {/* Paying step */}
          {step === 'paying' && (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-sky-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">📱 Check Your Phone!</h3>
                <p className="text-sm text-gray-500 mt-2">
                  A payment prompt has been sent to <strong>{paymentNumber}</strong>. Please approve it now.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-700 font-medium">⚠️ Do not close this page. Processing may take up to 60 seconds.</p>
              </div>
            </div>
          )}

          {/* Success step */}
          {step === 'success' && orderResult && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Payment Successful!</h3>
                <p className="text-sm text-gray-500 mt-1">{orderResult.message}</p>
              </div>
              <div className="bg-sky-50 rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order Number</span>
                  <span className="font-bold text-gray-900">{orderResult.order_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-semibold text-sky-600">{formatCurrency(orderResult.amount)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
                <Clock className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-700">Your data will be delivered within minutes. Save your order number.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => window.location.href = `/track-order?id=${orderResult.order_number}`}
                  className="py-2.5 border border-sky-200 text-sky-700 text-sm font-medium rounded-xl hover:bg-sky-50 transition-colors"
                >
                  Track Order
                </button>
                <button
                  onClick={onClose}
                  className="py-2.5 bg-sky-600 text-white text-sm font-medium rounded-xl hover:bg-sky-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Error step */}
          {step === 'error' && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-9 h-9 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Payment Failed</h3>
                <p className="text-sm text-gray-500 mt-1">{errorMsg}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onClose}
                  className="py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setStep('form'); setErrors({}); }}
                  className="py-2.5 bg-sky-600 text-white text-sm font-medium rounded-xl hover:bg-sky-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
