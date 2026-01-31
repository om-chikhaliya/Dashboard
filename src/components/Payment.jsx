import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import api from "./helper/api";
import { ClipLoader } from "react-spinners";
import PaymentModal from "./PaymentModal";
import InvoiceDetailsModal from "./InvoiceDetailsModal";
import { CreditCard, Check, AlertCircle, Download, ExternalLink, Eye } from "lucide-react";

function Payment() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [billingInfo, setBillingInfo] = useState(null);
  const [billingLoading, setBillingLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  // Fetch billing info and invoices
  const fetchBillingInfo = async () => {
    setBillingLoading(true);
    try {
      const response = await api.get('/payment/billing-info');
      setBillingInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch billing info:', error);
    } finally {
      setBillingLoading(false);
    }
  };

  const fetchInvoices = async () => {
    setInvoicesLoading(true);
    try {
        const response = await api.get('/payment/invoices');
        setInvoices(response.data.invoices);
    } catch (error) {
        console.error('Failed to fetch invoices:', error);
    } finally {
        setInvoicesLoading(false);
    }
  };

  const refreshBillingData = () => {
    fetchBillingInfo();
    fetchInvoices();
  };

  useEffect(() => {
    fetchBillingInfo();
    fetchInvoices();
  }, []);

  return (
    <div className="">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={isSidebarOpen ? "main-content sidebar-open" : " px-4 py-4"}>
        <ToastContainer position="top-right" autoClose={3000} />
        <Header />

        <div className="p-6 pt-2">
          <h2 className="text-2xl font-semibold mb-4">Billing & Payments</h2>

            <div className="mt-4 space-y-4">
              {/* Billing Overview Card */}
              <div className="p-6 border border-gray-300 rounded-xl bg-white shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    Billing Overview
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-6 text-sm">
                  Manage your payment methods and billing preferences. We charge 1% of your total monthly order revenue as a service fee.
                </p>

                {billingLoading ? (
                  <div className="flex justify-center py-4">
                    <ClipLoader size={30} color={'#DFF51D'} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Payment Method Status */}
                    <div className={`p-4 rounded-lg border ${
                      billingInfo?.hasPaymentMethod 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-orange-50 border-orange-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        {billingInfo?.hasPaymentMethod ? (
                          <>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Check className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-green-800">Payment Method Active</p>
                              <p className="text-sm text-green-700">
                                {billingInfo.paymentMethod ? (
                                  <>Card ending in •••• {billingInfo.paymentMethod.last4} ({billingInfo.paymentMethod.brand})</>
                                ) : (
                                  'Card saved on file'
                                )}
                              </p>
                              {billingInfo.autoPayEnabled && (
                                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                  Auto-pay enabled
                                </p>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <AlertCircle className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium text-orange-800">No Payment Method</p>
                              <p className="text-sm text-orange-700">
                                Add a payment method to enable automatic billing
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg font-medium hover:from-slate-700 hover:to-slate-800 transition-all flex items-center gap-2 shadow-md"
                      >
                        <CreditCard className="w-4 h-4" />
                        {billingInfo?.hasPaymentMethod ? 'Manage Payment' : 'Add Payment Method'}
                      </button>
                    </div>

                    {/* Pricing Info */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-2">How Billing Works</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-[#DFF51D] mt-1">•</span>
                          <span>We charge <strong>1%</strong> of your total monthly order revenue</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#DFF51D] mt-1">•</span>
                          <span>Billing is calculated from orders synced from BrickLink and BrickOwl</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#DFF51D] mt-1">•</span>
                          <span>With auto-pay enabled, we'll charge your card at the beginning of each month</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#DFF51D] mt-1">•</span>
                          <span>You can also make manual one-time payments anytime</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Invoices History Table */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Invoice History</h3>
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        {invoicesLoading ? (
                            <div className="p-8 flex justify-center">
                                <ClipLoader size={30} color={'#DFF51D'} />
                            </div>
                        ) : invoices.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Billing Period</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {invoices.map((invoice) => (
                                            <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                        ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                                          invoice.status === 'open' ? 'bg-blue-100 text-blue-800' :
                                                          invoice.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                                          'bg-red-100 text-red-800'}`}>
                                                        {invoice.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.billing_month}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">${parseFloat(invoice.amount).toFixed(2)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                       <button
                                                            onClick={() => setSelectedInvoice(invoice)}
                                                            className="text-gray-500 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded-md transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        {invoice.invoice_pdf && (
                                                            <a 
                                                                href={invoice.invoice_pdf}
                                                                target="_blank" 
                                                                rel="noreferrer"
                                                                className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                                                                title="Download PDF"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                        
                                                        {invoice.invoice_url && (
                                                            <a 
                                                                href={invoice.invoice_url} 
                                                                target="_blank" 
                                                                rel="noreferrer"
                                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                                                                    ${invoice.status === 'paid' 
                                                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                                                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'}`}
                                                            >
                                                                {invoice.status === 'paid' ? (
                                                                    <>
                                                                        <ExternalLink className="w-3 h-3" />
                                                                        Receipt
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        Pay Now
                                                                    </>
                                                                )}
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No invoices found.
                            </div>
                        )}
                    </div>
                </div>

              </div>
            </div>

        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        refreshData={refreshBillingData}
      />

       {/* Invoice Details Modal */}
       <InvoiceDetailsModal 
        isOpen={!!selectedInvoice} 
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice} 
      />
    </div>
  );
}

export default Payment;
