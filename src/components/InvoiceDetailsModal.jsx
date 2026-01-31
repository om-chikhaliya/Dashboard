import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import { ClipLoader } from "react-spinners";
import api from "./helper/api";

const InvoiceDetailsModal = ({ isOpen, onClose, invoice }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (isOpen && invoice) {
            fetchInvoiceDetails();
        }
    }, [isOpen, invoice]);

    const fetchInvoiceDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/payment/invoice/${invoice.id}/details`);
            setOrders(response.data.orders);
        } catch (error) {
            console.error("Failed to fetch invoice details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !invoice) return null;

    const filteredOrders = orders.filter(order => 
        order.brickosys_order_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalOrderAmount = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
    const totalCommission = orders.reduce((sum, order) => sum + parseFloat(order.commission_amount || 0), 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Invoice Details</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Billing Month: <span className="font-medium text-gray-900">{invoice.billing_month}</span>
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 p-6 bg-white border-b border-gray-100">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Total Amount Due</p>
                        <p className="text-2xl font-bold text-blue-900 mt-1">${parseFloat(invoice.amount).toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Order Value</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">${totalOrderAmount.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Commission</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">${totalCommission.toFixed(2)}</p>
                    </div>
                </div>

                {/* Search & Table Header */}
                <div className="px-6 py-4 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Order Breakdown</h3>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search Order ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                        />
                    </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-auto bg-gray-50 px-6 pb-6">
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        {loading ? (
                            <div className="p-12 flex justify-center">
                                <ClipLoader size={30} color={'#DFF51D'} />
                            </div>
                        ) : filteredOrders.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Order Date</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Total</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Comm. ({((totalCommission/totalOrderAmount)*100).toFixed(0)}%)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.brickosys_order_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-3 text-sm font-medium text-gray-900">{order.brickosys_order_id}</td>
                                            <td className="px-6 py-3 text-sm text-gray-500">{new Date(order.order_on).toLocaleDateString()}</td>
                                            <td className="px-6 py-3 text-sm text-gray-900 text-right">${parseFloat(order.total_price).toFixed(2)}</td>
                                            <td className="px-6 py-3 text-sm text-gray-900 text-right font-medium">${parseFloat(order.commission_amount).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No orders found for this invoice.
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 text-right">
                    <p className="text-xs text-gray-500">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailsModal;
