import React, { useState, useMemo } from 'react';
import { Package, Plus } from 'lucide-react';
import DealersView from '../components/dealer/DealersView';
// PurchasesView is now handled inside DealersView -> DealerDetails
import AddDealerModal from '../components/dealer/AddDealerModal';
import AddPurchaseModal from '../components/dealer/AddPurchaseModal';
import '../components/dealer/dealer.css'; // Import custom styles

// Dummy Data
const initialDealers = [
    {
        id: 1,
        name: "Mahindra Auto Supplies",
        contact: "+91 98765 43210",
        email: "mahindra@autosupply.com",
        address: "Plot 45, Industrial Area Phase-2, Raipur",
        gstNumber: "22AAAAA0000A1Z5",
        status: "Active",
        totalOrders: 45,
        totalBilled: 1250000,
        totalPaid: 980000,
        pendingBalance: 270000
    },
    {
        id: 2,
        name: "John Deere Parts Co.",
        contact: "+91 98765 43211",
        email: "jdparts@example.com",
        address: "Sector 8, Bhilai Road, Chhattisgarh",
        gstNumber: "22BBBBB1111B2Z6",
        status: "Active",
        totalOrders: 32,
        totalBilled: 890000,
        totalPaid: 890000,
        pendingBalance: 0
    },
    {
        id: 3,
        name: "Swaraj Tractor Parts",
        contact: "+91 98765 43212",
        email: "swaraj@parts.com",
        address: "NH-6, Durg District, Chhattisgarh",
        gstNumber: "22CCCCC2222C3Z7",
        status: "Active",
        totalOrders: 28,
        totalBilled: 675000,
        totalPaid: 450000,
        pendingBalance: 225000
    },
    {
        id: 4,
        name: "Premium Oil Distributors",
        contact: "+91 98765 43213",
        email: "premiumoil@dist.com",
        address: "Ring Road No. 1, Raipur",
        gstNumber: "22DDDDD3333D4Z8",
        status: "Active",
        totalOrders: 56,
        totalBilled: 1450000,
        totalPaid: 1200000,
        pendingBalance: 250000
    },
    {
        id: 5,
        name: "Hardware Junction",
        contact: "+91 98765 43214",
        email: "hardware@junction.com",
        address: "Market Yard, Bhilai",
        gstNumber: "22EEEEE4444E5Z9",
        status: "Inactive",
        totalOrders: 15,
        totalBilled: 180000,
        totalPaid: 180000,
        pendingBalance: 0
    }
];

const initialPurchases = [
    {
        id: 1,
        dealerId: 1,
        invoiceNumber: "INV-2024-001",
        invoiceDate: "2024-01-15",
        productType: "Auto Parts",
        products: [
            { brand: "Mahindra", model: "Arjun 605", category: "Engine Parts", partName: "Piston Ring Set", partNumber: "MPR-605-001", quantity: 10, pricePerUnit: 1200 },
            { brand: "Mahindra", model: "Arjun 605", category: "Electrical", partName: "Alternator", partNumber: "MAL-605-012", quantity: 5, pricePerUnit: 3500 }
        ],
        totalAmount: 29500,
        paidAmount: 29500,
        pendingAmount: 0,
        paymentMode: "Bank Transfer",
        billUrl: "/bills/inv-2024-001.pdf"
    },
    {
        id: 2,
        dealerId: 1,
        invoiceNumber: "INV-2024-045",
        invoiceDate: "2024-12-20",
        productType: "Auto Parts",
        products: [
            { brand: "Mahindra", model: "Yuvo 275", category: "Body Parts", partName: "Front Bumper", partNumber: "MBP-275-034", quantity: 3, pricePerUnit: 4500 },
            { brand: "Mahindra", model: "Yuvo 275", category: "Engine Parts", partName: "Oil Filter", partNumber: "MOF-275-008", quantity: 20, pricePerUnit: 450 }
        ],
        totalAmount: 22500,
        paidAmount: 0,
        pendingAmount: 22500,
        paymentMode: "Credit",
        billUrl: "/bills/inv-2024-045.pdf"
    },
    {
        id: 3,
        dealerId: 2,
        invoiceNumber: "INV-JD-2024-018",
        invoiceDate: "2024-11-10",
        productType: "Auto Parts",
        products: [
            { brand: "John Deere", model: "5310", category: "Electrical", partName: "Starter Motor", partNumber: "JDS-5310-023", quantity: 4, pricePerUnit: 8500 },
            { brand: "John Deere", model: "5310", category: "Engine Parts", partName: "Fuel Pump", partNumber: "JDF-5310-067", quantity: 6, pricePerUnit: 5600 }
        ],
        totalAmount: 67600,
        paidAmount: 67600,
        pendingAmount: 0,
        paymentMode: "UPI",
        billUrl: "/bills/inv-jd-2024-018.pdf"
    },
    {
        id: 4,
        dealerId: 4,
        invoiceNumber: "INV-OIL-2024-089",
        invoiceDate: "2024-12-05",
        productType: "Oil Products",
        products: [
            { company: "Castrol", oilType: "Engine Oil 15W-40", packaging: "20L", quantity: 50, price: 2800 },
            { company: "Shell", oilType: "Hydraulic Oil AW-68", packaging: "10L", quantity: 30, price: 1650 }
        ],
        totalAmount: 189500,
        paidAmount: 100000,
        pendingAmount: 89500,
        paymentMode: "Partial - Bank",
        billUrl: "/bills/inv-oil-2024-089.pdf"
    },
    {
        id: 5,
        dealerId: 3,
        invoiceNumber: "INV-SW-2024-034",
        invoiceDate: "2024-10-22",
        productType: "Auto Parts",
        products: [
            { brand: "Swaraj", model: "855", category: "Engine Parts", partName: "Cylinder Head", partNumber: "SCH-855-045", quantity: 2, pricePerUnit: 15000 },
            { brand: "Swaraj", model: "855", category: "Electrical", partName: "Ignition Coil", partNumber: "SIC-855-089", quantity: 8, pricePerUnit: 1200 }
        ],
        totalAmount: 39600,
        paidAmount: 20000,
        pendingAmount: 19600,
        paymentMode: "Partial - Cash",
        billUrl: "/bills/inv-sw-2024-034.pdf"
    },
    {
        id: 6,
        dealerId: 5,
        invoiceNumber: "INV-HW-2024-012",
        invoiceDate: "2024-09-18",
        productType: "Hardware Items",
        products: [
            { category: "Nuts & Bolts", itemName: "Hex Bolt M12x50", unit: "pcs", quantity: 500, price: 8 },
            { category: "Bearings", itemName: "Deep Groove Ball Bearing 6205", unit: "pcs", quantity: 50, price: 180 },
            { category: "Tools", itemName: "Torque Wrench Set", unit: "box", quantity: 5, price: 3500 }
        ],
        totalAmount: 30500,
        paidAmount: 30500,
        pendingAmount: 0,
        paymentMode: "Cash",
        billUrl: "/bills/inv-hw-2024-012.pdf"
    },
    {
        id: 7,
        dealerId: 4,
        invoiceNumber: "INV-OIL-2024-112",
        invoiceDate: "2024-12-28",
        productType: "Oil Products",
        products: [
            { company: "Mobil", oilType: "Transmission Oil 80W-90", packaging: "5L", quantity: 80, price: 850 },
            { company: "Castrol", oilType: "Grease Multi-Purpose", packaging: "1L", quantity: 100, price: 320 }
        ],
        totalAmount: 100000,
        paidAmount: 50000,
        pendingAmount: 50000,
        paymentMode: "Partial - UPI",
        billUrl: "/bills/inv-oil-2024-112.pdf"
    }
];

// Main App Component
export default function DealerManagementSystem() {
    const [dealers, setDealers] = useState(initialDealers);
    const [purchases, setPurchases] = useState(initialPurchases);
    const [selectedDealer, setSelectedDealer] = useState(null);
    const [showAddDealerModal, setShowAddDealerModal] = useState(false);
    const [showAddPurchaseModal, setShowAddPurchaseModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    // filterPaymentStatus, filterProductType, and dateRange removed as they were only for global purchases view

    // Calculate summary statistics
    const summaryStats = useMemo(() => {
        const totalBilled = dealers.reduce((sum, d) => sum + d.totalBilled, 0);
        const totalPaid = dealers.reduce((sum, d) => sum + d.totalPaid, 0);
        const totalPending = dealers.reduce((sum, d) => sum + d.pendingBalance, 0);
        const activeCount = dealers.filter(d => d.status === 'Active').length;

        return { totalBilled, totalPaid, totalPending, activeCount };
    }, [dealers]);

    // Filter dealers
    const filteredDealers = useMemo(() => {
        return dealers.filter(dealer => {
            const matchesSearch = dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dealer.contact.includes(searchTerm);
            const matchesStatus = filterStatus === 'All' || dealer.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [dealers, searchTerm, filterStatus]);

    // Filtered purchases logic removed as it's now handled contextually within DealerDetails

    // Robust recalculation utility to ensure financial accuracy
    const recalculateAllDealers = (updatedPurchases, currentDealers) => {
        return currentDealers.map(dealer => {
            const dealerPurchases = updatedPurchases.filter(p => p.dealerId === dealer.id);
            const totalBilled = dealerPurchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
            const totalPaid = dealerPurchases.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
            const pendingBalance = Math.max(0, totalBilled - totalPaid);

            return {
                ...dealer,
                totalOrders: dealerPurchases.length,
                totalBilled,
                totalPaid,
                pendingBalance
            };
        });
    };

    const handleSavePurchase = (purchase) => {
        let updatedPurchases;
        if (purchase.id) {
            // Edit existing purchase
            updatedPurchases = purchases.map(p => p.id === purchase.id ? purchase : p);
        } else {
            // Add new purchase
            updatedPurchases = [...purchases, { ...purchase, id: Date.now() }];
        }

        setPurchases(updatedPurchases);
        setDealers(recalculateAllDealers(updatedPurchases, dealers));
        setShowAddPurchaseModal(false);
        setSelectedPurchase(null);
    };

    const handleDeleteDealer = (id) => {
        if (confirm('Are you sure you want to delete this dealer?')) {
            setDealers(dealers.filter(d => d.id !== id));
        }
    };

    const handleDeletePurchase = (id) => {
        if (confirm('Are you sure you want to delete this purchase? This will update the dealer\'s balance automatically.')) {
            const updatedPurchases = purchases.filter(p => p.id !== id);
            setPurchases(updatedPurchases);
            setDealers(recalculateAllDealers(updatedPurchases, dealers));
        }
    };

    const [selectedPurchase, setSelectedPurchase] = useState(null);

    const handleEditPurchase = (purchase) => {
        setSelectedPurchase(purchase);
        setShowAddPurchaseModal(true);
    };

    return (
        <div className="dealer-container">

            {/* Main Content Areas Consolidated into DealersView */}
            <main className="dealer-main">
                <DealersView
                    dealers={filteredDealers}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    onEdit={(dealer) => {
                        setSelectedDealer(dealer);
                        setShowAddDealerModal(true);
                    }}
                    onDelete={handleDeleteDealer}
                    onViewDetails={(dealer) => setSelectedDealer(dealer)}
                    onAdd={() => setShowAddDealerModal(true)}
                    selectedDealer={selectedDealer}
                    setSelectedDealer={setSelectedDealer}
                    purchases={purchases.filter(p => selectedDealer && p.dealerId === selectedDealer.id)}
                    onEditPurchase={handleEditPurchase}
                    onDeletePurchase={handleDeletePurchase}
                    onAddPurchase={() => {
                        setSelectedPurchase(null);
                        setShowAddPurchaseModal(true);
                    }}
                />
            </main>

            {/* Modals */}
            {showAddDealerModal && (
                <AddDealerModal
                    dealer={selectedDealer}
                    onClose={() => {
                        setShowAddDealerModal(false);
                        setSelectedDealer(null);
                    }}
                    onSave={(dealer) => {
                        if (dealer.id) {
                            setDealers(dealers.map(d => d.id === dealer.id ? dealer : d));
                        } else {
                            setDealers([...dealers, { ...dealer, id: Date.now(), totalOrders: 0, totalBilled: 0, totalPaid: 0, pendingBalance: 0 }]);
                        }
                        setShowAddDealerModal(false);
                        setSelectedDealer(null);
                    }}
                />
            )}

            {showAddPurchaseModal && (
                <AddPurchaseModal
                    dealers={dealers}
                    purchase={selectedPurchase}
                    onClose={() => {
                        setShowAddPurchaseModal(false);
                        setSelectedPurchase(null);
                    }}
                    onSave={handleSavePurchase}
                />
            )}
        </div>
    );
}
