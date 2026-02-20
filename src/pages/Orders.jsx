import React, { useState, useMemo } from 'react';
import {
    Search,
    FileText,
    Download,
    Printer,
    X,
    CheckCircle2,
    Clock,
    Share2,
    Eye,
    IndianRupee,
    Calendar,
    User,
    Wrench,
    Package,
    MapPin,
} from 'lucide-react';
import './Orders.css';

const Orders = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    // Completed services with parts data and payment tracking
    const [completedOrders, setCompletedOrders] = useState([
        {
            id: 'SR-1022',
            orderId: 'ORD-5501',
            customer: 'Amit Patel',
            tractor: 'John Deere 5310',
            type: 'Shop Service',
            location: 'Shop',
            status: 'Completed',
            priority: 'Normal',
            mechanic: 'Rahul Verma',
            dateISO: '2026-01-08T16:45:00',
            completedDate: '2026-01-10T18:30:00',
            paymentStatus: 'Paid', // Paid, Unpaid, Partial
            paidAmount: 9549.00,
            paymentMethod: 'UPI',
            paymentHistory: [
                { date: '2026-01-10T18:30:00', amount: 9549.00, method: 'UPI' }
            ],
            parts: [
                { id: 1, name: 'Heavy Duty Clutch Plate', category: 'Transmission', price: 4500, quantity: 1 },
                { id: 2, name: 'Oil Filter XL', category: 'Engine', price: 850, quantity: 2 },
                { id: 3, name: 'Air Filter', category: 'Engine', price: 650, quantity: 1 },
            ],
            serviceCharges: 1200,
            customerAddress: 'Village Rampur, Sector 4, Bhopal',
            customerPhone: '+91 98765 43210',
        },
        {
            id: 'SR-1019',
            orderId: 'ORD-5502',
            customer: 'Ramesh Das',
            tractor: 'Sonalika 50',
            type: 'Home Service',
            location: 'Village A',
            status: 'Completed',
            priority: 'Normal',
            mechanic: 'Sameer Khan',
            dateISO: '2026-01-02T10:00:00',
            completedDate: '2026-01-03T15:00:00',
            paymentStatus: 'Unpaid',
            paidAmount: 0,
            paymentMethod: null,
            paymentHistory: [],
            parts: [
                { id: 4, name: 'Hydraulic Pump', category: 'Hydraulics', price: 12500, quantity: 1 },
                { id: 5, name: 'Hydraulic Oil (5L)', category: 'Fluids', price: 850, quantity: 2 },
            ],
            serviceCharges: 1500,
            customerAddress: 'Village A, District Center',
            customerPhone: '+91 98765 43211',
        },
        {
            id: 'SR-0999',
            orderId: 'ORD-5503',
            customer: 'Old Customer',
            tractor: 'John Deere 3020',
            type: 'Shop Service',
            location: 'Shop',
            status: 'Completed',
            priority: 'Normal',
            mechanic: 'Rahul Verma',
            dateISO: '2025-12-28T13:30:00',
            completedDate: '2025-12-29T17:00:00',
            paymentStatus: 'Partial',
            paidAmount: 2000,
            paymentMethod: 'Cash',
            paymentHistory: [
                { date: '2025-12-29T17:00:00', amount: 2000, method: 'Cash' }
            ],
            parts: [
                { id: 6, name: 'Brake Liner Kit', category: 'Brakes', price: 2200, quantity: 1 },
                { id: 7, name: 'Brake Fluid (1L)', category: 'Fluids', price: 350, quantity: 1 },
            ],
            serviceCharges: 800,
            customerAddress: 'Main Road, City Center',
            customerPhone: '+91 98765 43212',
        },
    ]);

    // Calculate totals for an order
    const calculateOrderTotals = (order) => {
        const partsSubtotal = order.parts.reduce((sum, part) => sum + (part.price * part.quantity), 0);
        const subtotal = partsSubtotal + order.serviceCharges;
        const gst = subtotal * 0.18;
        const total = subtotal + gst;
        const remaining = total - order.paidAmount;

        return {
            partsSubtotal: partsSubtotal.toFixed(2),
            serviceCharges: order.serviceCharges.toFixed(2),
            subtotal: subtotal.toFixed(2),
            gst: gst.toFixed(2),
            total: total.toFixed(2),
            paid: order.paidAmount.toFixed(2),
            remaining: remaining.toFixed(2),
        };
    };

    // Get payment status badge details
    const getPaymentBadge = (order) => {
        const totals = calculateOrderTotals(order);
        const total = parseFloat(totals.total);
        const paid = order.paidAmount;

        if (paid >= total) {
            return { status: 'Paid', class: 'paid', icon: CheckCircle2 };
        } else if (paid === 0) {
            return { status: 'Unpaid', class: 'unpaid', icon: Clock };
        } else {
            return { status: `Remaining: ₹${totals.remaining}`, class: 'partial', icon: Clock };
        }
    };

    // Open payment modal
    const openPaymentModal = (order) => {
        setEditingOrder(order);
        // Set default to current paid amount so user can edit it
        setPaymentAmount(order.paidAmount.toString());
        setPaymentMethod('Cash');
        setShowPaymentModal(true);
    };

    // Handle payment submission
    const handlePaymentSubmit = () => {
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount < 0) {
            alert('Please enter a valid amount');
            return;
        }

        const totals = calculateOrderTotals(editingOrder);
        const totalBill = parseFloat(totals.total);

        if (amount > totalBill) {
            alert(`Payment amount cannot exceed total bill of ₹${totalBill}`);
            return;
        }

        // Update order with new payment (replace entire paid amount, not add to it)
        setCompletedOrders(orders =>
            orders.map(order => {
                if (order.id === editingOrder.id) {
                    const newPaidAmount = amount;
                    const remaining = totalBill - newPaidAmount;

                    // Determine status based on amounts
                    let newStatus = 'Unpaid';
                    if (newPaidAmount >= totalBill) {
                        newStatus = 'Paid';
                    } else if (newPaidAmount > 0 && newPaidAmount < totalBill) {
                        newStatus = 'Partial';
                    }

                    // Create payment history entry
                    const newPaymentHistory = [];
                    if (newPaidAmount > 0) {
                        newPaymentHistory.push({
                            date: new Date().toISOString(),
                            amount: newPaidAmount,
                            method: paymentMethod
                        });
                    }

                    return {
                        ...order,
                        paidAmount: newPaidAmount,
                        paymentStatus: newStatus,
                        paymentMethod: newPaidAmount > 0 ? paymentMethod : null,
                        paymentHistory: newPaidAmount > 0 ? newPaymentHistory : []
                    };
                }
                return order;
            })
        );

        setShowPaymentModal(false);
        setEditingOrder(null);
        setPaymentAmount('');
        alert('Payment updated successfully!');
    };

    // Filter orders based on search
    const filteredOrders = useMemo(() => {
        return completedOrders.filter(order =>
            order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.tractor.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // Handle view invoice
    const handleViewInvoice = (order) => {
        setSelectedOrder(order);
        setShowInvoiceModal(true);
    };

    // Handle download PDF
    const handleDownloadPDF = (order) => {
        alert(`Downloading invoice for ${order.orderId}`);
        // Implement PDF generation logic here
    };

    // Handle share on WhatsApp
    const handleShareWhatsApp = (order) => {
        const totals = calculateOrderTotals(order);
        const message = `*Invoice ${order.orderId}*\n\n` +
            `Customer: ${order.customer}\n` +
            `Tractor: ${order.tractor}\n` +
            `Service: ${order.type}\n` +
            `Mechanic: ${order.mechanic}\n\n` +
            `*Parts:*\n` +
            order.parts.map(p => `${p.name} x${p.quantity} - ₹${(p.price * p.quantity).toFixed(2)}`).join('\n') +
            `\n\n*Service Charges:* ₹${totals.serviceCharges}\n` +
            `*GST (18%):* ₹${totals.gst}\n` +
            `*Total Amount:* ₹${totals.total}\n\n` +
            `Thank you for choosing Pranavi Enterprises!`;

        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = order.customerPhone.replace(/[^0-9]/g, '');
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappURL, '_blank');
    };

    // Handle print invoice
    const handlePrintInvoice = (order) => {
        const printWindow = window.open('', '_blank');
        const totals = calculateOrderTotals(order);

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice ${order.orderId}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .company-name { font-size: 24px; font-weight: bold; color: #fcb53b; }
                    .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
                    .customer-info, .invoice-info { width: 45%; }
                    .section-title { font-weight: bold; margin-bottom: 10px; color: #333; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background-color: #f8f9fa; font-weight: bold; }
                    .totals { margin-top: 20px; text-align: right; }
                    .total-row { display: flex; justify-content: flex-end; margin: 5px 0; }
                    .total-label { width: 150px; font-weight: bold; }
                    .total-value { width: 150px; text-align: right; }
                    .grand-total { font-size: 18px; font-weight: bold; color: #fcb53b; margin-top: 10px; padding-top: 10px; border-top: 2px solid #333; }
                    .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company-name">PRANAVI ENTERPRISES</div>
                    <div>Main Road, Agri Zone, Bhopal, Madhya Pradesh</div>
                    <div>Phone: +91 12345 67890 | Email: info@pranavi.com</div>
                </div>
                
                <div class="invoice-details">
                    <div class="customer-info">
                        <div class="section-title">Bill To:</div>
                        <div><strong>${order.customer}</strong></div>
                        <div>${order.customerAddress}</div>
                        <div>${order.customerPhone}</div>
                    </div>
                    <div class="invoice-info">
                        <div class="section-title">Invoice Details:</div>
                        <div><strong>Invoice #:</strong> ${order.orderId}</div>
                        <div><strong>Service ID:</strong> ${order.id}</div>
                        <div><strong>Date:</strong> ${new Date(order.completedDate).toLocaleDateString()}</div>
                        <div><strong>Payment:</strong> ${order.paymentMethod}</div>
                    </div>
                </div>
                
                <div class="section-title">Service Information:</div>
                <div><strong>Tractor:</strong> ${order.tractor}</div>
                <div><strong>Service Type:</strong> ${order.type}</div>
                <div><strong>Mechanic:</strong> ${order.mechanic}</div>
                <div><strong>Location:</strong> ${order.location}</div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.parts.map(part => `
                            <tr>
                                <td>${part.name}</td>
                                <td>${part.category}</td>
                                <td>${part.quantity}</td>
                                <td>₹${part.price.toFixed(2)}</td>
                                <td>₹${(part.price * part.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                        <tr>
                            <td colspan="4" style="text-align: right;"><strong>Service Charges</strong></td>
                            <td><strong>₹${totals.serviceCharges}</strong></td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="totals">
                    <div class="total-row">
                        <div class="total-label">Subtotal:</div>
                        <div class="total-value">₹${totals.subtotal}</div>
                    </div>
                    <div class="total-row">
                        <div class="total-label">GST (18%):</div>
                        <div class="total-value">₹${totals.gst}</div>
                    </div>
                    <div class="total-row grand-total">
                        <div class="total-label">Total Payable:</div>
                        <div class="total-value">₹${totals.total}</div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Thank you for your business!</p>
                    <p>This is a computer-generated invoice and does not require a signature.</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="orders-page">
            <div className="page-header">
                <h2 className="page-title"> Billing</h2>
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Customer, or Tractor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="orders-container">
                {filteredOrders.length === 0 ? (
                    <div className="empty-state">
                        <FileText size={48} />
                        <p>No completed Billing found</p>
                    </div>
                ) : (
                    <div className="orders-grid">
                        {filteredOrders.map((order) => {
                            const totals = calculateOrderTotals(order);
                            const paymentBadge = getPaymentBadge(order);
                            return (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <div className="order-header-left">
                                            <h3 className="order-id">{order.orderId}</h3>
                                            <span className="service-id">{order.id}</span>
                                        </div>
                                        <span className={`status-badge ${paymentBadge.class}`}>
                                            <paymentBadge.icon size={14} />
                                            {paymentBadge.status}
                                        </span>
                                    </div>

                                    <div className="order-info-grid">
                                        <div className="info-item">
                                            <User size={16} className="info-icon" />
                                            <div>
                                                <span className="info-label">Customer</span>
                                                <span className="info-value">{order.customer}</span>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <Wrench size={16} className="info-icon" />
                                            <div>
                                                <span className="info-label">Tractor</span>
                                                <span className="info-value">{order.tractor}</span>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <MapPin size={16} className="info-icon" />
                                            <div>
                                                <span className="info-label">Service Type</span>
                                                <span className="info-value">{order.type}</span>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <Calendar size={16} className="info-icon" />
                                            <div>
                                                <span className="info-label">Completed</span>
                                                <span className="info-value">
                                                    {new Date(order.completedDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="order-summary">
                                        <div className="summary-info">
                                            <div className="summary-item">
                                                <Package size={16} className="summary-icon" />
                                                <span>{order.parts.length} Parts Used</span>
                                            </div>
                                            <div className="summary-item">
                                                <User size={16} className="summary-icon" />
                                                <span>Mechanic: {order.mechanic}</span>
                                            </div>
                                        </div>

                                        {/* Payment Details */}
                                        <div className="payment-details">
                                            <div className="payment-row">
                                                <span className="payment-label">Total Bill:</span>
                                                <span className="payment-value">₹{totals.total}</span>
                                            </div>
                                            <div className="payment-row">
                                                <span className="payment-label">Paid:</span>
                                                <span className="payment-value paid-amount">₹{totals.paid}</span>
                                            </div>
                                            {parseFloat(totals.remaining) > 0 && (
                                                <div className="payment-row remaining">
                                                    <span className="payment-label">Remaining:</span>
                                                    <span className="payment-value remaining-amount">₹{totals.remaining}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="order-actions">
                                        <button
                                            className="action-btn view"
                                            onClick={() => handleViewInvoice(order)}
                                            title="View Full Invoice"
                                        >
                                            <Eye size={16} />
                                            <span>View Bill</span>
                                        </button>
                                        <button
                                            className="action-btn payment"
                                            onClick={() => openPaymentModal(order)}
                                            title="Add Payment"
                                            disabled={order.paymentStatus === 'Paid'}
                                        >
                                            <IndianRupee size={16} />
                                            <span>Payment</span>
                                        </button>
                                        <button
                                            className="action-btn print"
                                            onClick={() => handlePrintInvoice(order)}
                                            title="Print Invoice"
                                        >
                                            <Printer size={16} />
                                            <span>Print</span>
                                        </button>
                                        <button
                                            className="action-btn share"
                                            onClick={() => handleShareWhatsApp(order)}
                                            title="Share on WhatsApp"
                                        >
                                            <Share2 size={16} />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Invoice Modal */}
            {showInvoiceModal && selectedOrder && (
                <div className="invoice-modal-overlay" onClick={() => setShowInvoiceModal(false)}>
                    <div className="invoice-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Invoice Details</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowInvoiceModal(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="invoice-document">
                                {/* Company Header */}
                                <div className="company-header">
                                    <h1>PRANAVI ENTERPRISES</h1>
                                    <p>Main Road, Agri Zone, Bhopal, Madhya Pradesh</p>
                                    <p>Phone: +91 12345 67890 | Email: info@pranavi.com</p>
                                </div>

                                {/* Invoice Info */}
                                <div className="invoice-meta">
                                    <div className="invoice-meta-left">
                                        <h3>Bill To:</h3>
                                        <p className="customer-name">{selectedOrder.customer}</p>
                                        <p>{selectedOrder.customerAddress}</p>
                                        <p>{selectedOrder.customerPhone}</p>
                                    </div>
                                    <div className="invoice-meta-right">
                                        <h3>Invoice Details:</h3>
                                        <p><strong>Invoice #:</strong> {selectedOrder.orderId}</p>
                                        <p><strong>Service ID:</strong> {selectedOrder.id}</p>
                                        <p><strong>Date:</strong> {new Date(selectedOrder.completedDate).toLocaleDateString()}</p>
                                        <p><strong>Payment:</strong> {selectedOrder.paymentStatus}</p>
                                    </div>
                                </div>

                                {/* Service Info */}
                                <div className="service-info-section">
                                    <h3>Service Information</h3>
                                    <div className="service-details-grid">
                                        <div><strong>Tractor:</strong> {selectedOrder.tractor}</div>
                                        <div><strong>Service Type:</strong> {selectedOrder.type}</div>
                                        <div><strong>Mechanic:</strong> {selectedOrder.mechanic}</div>
                                        <div><strong>Location:</strong> {selectedOrder.location}</div>
                                    </div>
                                </div>

                                {/* Parts Table */}
                                <div className="invoice-table-section">
                                    <h3>Parts & Services</h3>
                                    <table className="invoice-table">
                                        <thead>
                                            <tr>
                                                <th>Description</th>
                                                <th>Category</th>
                                                <th>Qty</th>
                                                <th>Price</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.parts.map((part, idx) => (
                                                <tr key={idx}>
                                                    <td>{part.name}</td>
                                                    <td>{part.category}</td>
                                                    <td>{part.quantity}</td>
                                                    <td>₹{part.price.toFixed(2)}</td>
                                                    <td>₹{(part.price * part.quantity).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            <tr className="service-row">
                                                <td colSpan="4"><strong>Service Charges</strong></td>
                                                <td><strong>₹{selectedOrder.serviceCharges.toFixed(2)}</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Totals */}
                                <div className="invoice-totals-section">
                                    {(() => {
                                        const totals = calculateOrderTotals(selectedOrder);
                                        return (
                                            <>
                                                <div className="total-line">
                                                    <span>Subtotal:</span>
                                                    <span>₹{totals.subtotal}</span>
                                                </div>
                                                <div className="total-line">
                                                    <span>GST (18%):</span>
                                                    <span>₹{totals.gst}</span>
                                                </div>
                                                <div className="total-line grand">
                                                    <span>Total Payable:</span>
                                                    <span>₹{totals.total}</span>
                                                </div>
                                                <div className="total-line paid">
                                                    <span>Paid Amount:</span>
                                                    <span>₹{totals.paid}</span>
                                                </div>
                                                {parseFloat(totals.remaining) > 0 && (
                                                    <div className="total-line remaining">
                                                        <span>Remaining Amount:</span>
                                                        <span>₹{totals.remaining}</span>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>

                                {/* Payment History */}
                                {selectedOrder.paymentHistory && selectedOrder.paymentHistory.length > 0 && (
                                    <div className="payment-history-section">
                                        <h3>Payment History</h3>
                                        <div className="payment-history-list">
                                            {selectedOrder.paymentHistory.map((payment, idx) => (
                                                <div key={idx} className="payment-history-item">
                                                    <span className="payment-date">
                                                        {new Date(payment.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="payment-method">{payment.method}</span>
                                                    <span className="payment-amount">₹{payment.amount.toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="invoice-footer">
                                    <p>Thank you for your business!</p>
                                    <p className="note">This is a computer-generated invoice and does not require a signature.</p>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="modal-action-btn print"
                                onClick={() => handlePrintInvoice(selectedOrder)}
                            >
                                <Printer size={18} />
                                Print Invoice
                            </button>
                            <button
                                className="modal-action-btn download"
                                onClick={() => handleDownloadPDF(selectedOrder)}
                            >
                                <Download size={18} />
                                Download PDF
                            </button>
                            <button
                                className="modal-action-btn share"
                                onClick={() => handleShareWhatsApp(selectedOrder)}
                            >
                                <Share2 size={18} />
                                Share on WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && editingOrder && ((() => {
                const totals = calculateOrderTotals(editingOrder);
                const totalBill = parseFloat(totals.total);
                const currentAmount = parseFloat(paymentAmount) || 0;
                const remainingAfterPayment = totalBill - currentAmount;

                // Determine what status will be after this payment
                let predictedStatus = 'Unpaid';
                if (currentAmount >= totalBill) {
                    predictedStatus = 'Paid';
                } else if (currentAmount > 0) {
                    predictedStatus = 'Partial';
                }

                return (
                    <div className="payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
                        <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Edit Payment Amount</h2>
                                <button
                                    className="close-btn"
                                    onClick={() => setShowPaymentModal(false)}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="payment-form">
                                    <div className="form-group">
                                        <label>Order ID</label>
                                        <input
                                            type="text"
                                            value={editingOrder.orderId}
                                            disabled
                                            className="form-input disabled"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Customer</label>
                                        <input
                                            type="text"
                                            value={editingOrder.customer}
                                            disabled
                                            className="form-input disabled"
                                        />
                                    </div>

                                    <div className="payment-summary">
                                        <div className="summary-row">
                                            <span>Total Bill:</span>
                                            <span className="value">₹{totals.total}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Amount to Pay (Edit below):</span>
                                            <span className="value" style={{ color: '#f59e0b' }}>₹{currentAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="summary-row highlight">
                                            <span>Will Remain:</span>
                                            <span className="value">₹{remainingAfterPayment.toFixed(2)}</span>
                                        </div>
                                        <div className="summary-row" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--dash-border)' }}>
                                            <span style={{ fontSize: '0.9rem' }}>Status After Payment:</span>
                                            <span className="value" style={{
                                                color: predictedStatus === 'Paid' ? '#10b981' :
                                                    predictedStatus === 'Unpaid' ? '#ef4444' :
                                                        '#f59e0b',
                                                fontWeight: '700'
                                            }}>
                                                {predictedStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Enter Total Paid Amount *</label>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--dash-primary)', fontSize: '1.2rem', fontWeight: '700' }}>₹</span>
                                            <input
                                                type="number"
                                                value={paymentAmount}
                                                onChange={(e) => setPaymentAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="form-input"
                                                min="0"
                                                max={totals.total}
                                                step="0.01"
                                                style={{ flex: 1 }}
                                            />
                                        </div>
                                        <small style={{ color: 'var(--dash-text-muted)', marginTop: '0.25rem', display: 'block' }}>
                                            Total bill: ₹{totals.total} | You can enter amount from 0 to ₹{totals.total}
                                        </small>
                                    </div>

                                    <div className="form-group">
                                        <label>Payment Method *</label>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="form-input"
                                        >
                                            <option value="Cash">💰 Cash</option>
                                            <option value="UPI">📱 UPI</option>
                                            <option value="Card">💳 Card</option>
                                            <option value="Bank Transfer">🏦 Bank Transfer</option>
                                            <option value="Cheque">📋 Cheque</option>
                                        </select>
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            className="btn secondary"
                                            onClick={() => setShowPaymentModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn primary"
                                            onClick={handlePaymentSubmit}
                                        >
                                            <CheckCircle2 size={18} />
                                            Update Payment
                                        </button>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                );
            })())}
        </div>
    );
};

export default Orders;