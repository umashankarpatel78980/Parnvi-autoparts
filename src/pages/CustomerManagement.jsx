
import React, { useState } from 'react';
import { Search, Plus, X, ArrowLeft, Upload, Save, RotateCcw } from 'lucide-react';
import StyledButton from '../components/StyledButton';
import './CustomerManagement.css';

// Sample customer data
const initialCustomers = [
  {
    id: 'CUS-001',
    name: 'Ramesh Kumar',
    phone: '9876543210',
    email: 'ramesh.kumar@email.com',
    address: 'Sector 21, Raipur, Chhattisgarh',
    city: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '492001',
    vehicle: 'Maruti Swift',
    vehicleNumber: 'CG 04 AB 1234',
    vehicleModel: 'Maruti Swift VXI',
    vehicleYear: '2020',
    vehicleType: 'car',
    vehicleBrand: 'maruti',
    fuelType: 'petrol',
    mileage: '45000',
    lastService: '15 Jan 2026',
    totalOrders: 12,
    totalSpent: '₹24,500',
    pending: '₹0',
    loyaltyPoints: 850,
    status: 'active'
  },
  {
    id: 'CUS-002',
    name: 'Priya Sharma',
    phone: '9123456789',
    email: 'priya.sharma@email.com',
    address: 'Civil Lines, Raipur, Chhattisgarh',
    city: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '492001',
    vehicle: 'Honda City',
    vehicleNumber: 'CG 07 XY 5678',
    vehicleModel: 'Honda City ZX CVT',
    vehicleYear: '2021',
    vehicleType: 'car',
    vehicleBrand: 'honda',
    fuelType: 'petrol',
    mileage: '32000',
    lastService: '10 Jan 2026',
    totalOrders: 8,
    totalSpent: '₹18,200',
    pending: '₹0',
    loyaltyPoints: 620,
    status: 'active'
  },
  {
    id: 'CUS-003',
    name: 'Suresh Patel',
    phone: '9988776655',
    email: 'suresh.patel@email.com',
    address: 'Telibandha, Raipur, Chhattisgarh',
    city: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '492001',
    vehicle: 'Hyundai Creta',
    vehicleNumber: 'CG 04 MN 9012',
    vehicleModel: 'Hyundai Creta SX',
    vehicleYear: '2022',
    vehicleType: 'suv',
    vehicleBrand: 'hyundai',
    fuelType: 'diesel',
    mileage: '28000',
    lastService: '20 Jan 2026',
    totalOrders: 15,
    totalSpent: '₹32,800',
    pending: '₹1,500',
    loyaltyPoints: 1150,
    status: 'active'
  }
];

const CustomerManagementApp = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('shop');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    dob: '',
    address: '',
    city: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '',
    vehicleNumber: '',
    vehicleType: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    fuelType: '',
    mileage: '',
    engineNumber: '',
    chassisNumber: '',
    insuranceExpiry: '',
    pucExpiry: '',
    preferredOil: '',
    preferredParts: '',
    preferredMechanic: '',
    serviceReminder: '',
    customerType: 'individual',
    gstNumber: '',
    referralSource: '',
    referralCode: '',
    notes: '',
    initialPoints: '0'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
    setActiveTab('shop');
  };

  const handleEditCustomer = (customer) => {
    setFormData({
      fullName: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || '',
      city: customer.city || 'Raipur',
      state: customer.state || 'Chhattisgarh',
      pincode: customer.pincode || '',
      vehicleNumber: customer.vehicleNumber || '',
      vehicleType: customer.vehicleType || '',
      vehicleBrand: customer.vehicleBrand || '',
      vehicleModel: customer.vehicleModel || '',
      vehicleYear: customer.vehicleYear || '',
      fuelType: customer.fuelType || '',
      mileage: customer.mileage || '',
      engineNumber: customer.engineNumber || '',
      chassisNumber: customer.chassisNumber || '',
      insuranceExpiry: customer.insuranceExpiry || '',
      pucExpiry: customer.pucExpiry || '',
      preferredOil: customer.preferredOil || '',
      preferredParts: customer.preferredParts || '',
      preferredMechanic: customer.preferredMechanic || '',
      serviceReminder: customer.serviceReminder || '',
      customerType: customer.customerType || 'individual',
      gstNumber: customer.gstNumber || '',
      referralSource: customer.referralSource || '',
      referralCode: customer.referralCode || '',
      notes: customer.notes || '',
      initialPoints: customer.loyaltyPoints?.toString() || '0'
    });
    setSelectedCustomer(customer);
    setShowAddCustomer(true);
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      setCustomers(customers.filter(c => c.id !== id));
      alert('Customer deleted successfully');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedCustomer && showAddCustomer) {
      // Edit existing customer
      const updatedCustomers = customers.map(c => {
        if (c.id === selectedCustomer.id) {
          return {
            ...c,
            name: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            vehicle: `${formData.vehicleBrand} ${formData.vehicleModel}`,
            vehicleNumber: formData.vehicleNumber,
            vehicleModel: formData.vehicleModel,
            vehicleYear: formData.vehicleYear,
            vehicleType: formData.vehicleType,
            vehicleBrand: formData.vehicleBrand,
            fuelType: formData.fuelType,
            mileage: formData.mileage,
            loyaltyPoints: parseInt(formData.initialPoints) || 0
          };
        }
        return c;
      });
      setCustomers(updatedCustomers);
      alert('Customer updated successfully');
    } else {
      // Add new customer
      const newCustomer = {
        id: `CUS-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        vehicle: `${formData.vehicleBrand} ${formData.vehicleModel}`,
        vehicleNumber: formData.vehicleNumber,
        vehicleModel: formData.vehicleModel,
        vehicleYear: formData.vehicleYear,
        vehicleType: formData.vehicleType,
        vehicleBrand: formData.vehicleBrand,
        fuelType: formData.fuelType,
        mileage: formData.mileage,
        lastService: new Date().toLocaleDateString('en-GB'),
        totalOrders: 0,
        totalSpent: '₹0',
        pending: '₹0',
        loyaltyPoints: parseInt(formData.initialPoints) || 0,
        status: 'active'
      };
      setCustomers([...customers, newCustomer]);
      alert(`Customer added successfully with ID: ${newCustomer.id}`);
    }

    setShowAddCustomer(false);
    setSelectedCustomer(null);
    setFormData({
      fullName: '', phone: '', email: '', dob: '', address: '',
      city: 'Raipur', state: 'Chhattisgarh', pincode: '',
      vehicleNumber: '', vehicleType: '', vehicleBrand: '', vehicleModel: '',
      vehicleYear: '', fuelType: '', mileage: '', engineNumber: '',
      chassisNumber: '', insuranceExpiry: '', pucExpiry: '',
      preferredOil: '', preferredParts: '', preferredMechanic: '',
      serviceReminder: '', customerType: 'individual', gstNumber: '',
      referralSource: '', referralCode: '', notes: '', initialPoints: '0'
    });
  };

  if (showAddCustomer) {
    return <AddCustomerForm
      formData={formData}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      onBack={() => {
        setShowAddCustomer(false);
        setSelectedCustomer(null);
      }}
      isEdit={!!selectedCustomer}
    />;
  }

  return (
    <div className="customer-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-title">
          <h1>🔧 Customer Management</h1>
          <p className="header-subtitle">Auto Parts & Services Admin Panel</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-label">Total Customers</h3>
          <div className="stat-value">{customers.length}</div>
        </div>
        <div className="stat-card">
          <h3 className="stat-label">Active Orders</h3>
          <div className="stat-value">89</div>
        </div>
        <div className="stat-card">
          <h3 className="stat-label">Monthly Revenue</h3>
          <div className="stat-value">₹3.2L</div>
        </div>
        <div className="stat-card">
          <h3 className="stat-label">Services Today</h3>
          <div className="stat-value">24</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h2 className="content-title">📋 Customer List</h2>
          <div className="filters-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <Search className="search-icon" size={20} />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <StyledButton variant="primary" icon={Plus} onClick={() => setShowAddCustomer(true)}>
              Add Customer
            </StyledButton>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Vehicle</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((customer) => (
                <tr key={customer.id}>
                  <td className="customer-id">{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.vehicle}</td>
                  <td>{customer.totalOrders}</td>
                  <td>{customer.totalSpent}</td>
                  <td>
                    <span className={`status-badge ${customer.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                      {customer.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <StyledButton
                        variant="outline"
                        className="sm"
                        onClick={() => handleViewDetails(customer)}
                        title="View Details"
                      >
                        View
                      </StyledButton>
                      <StyledButton
                        variant="outline"
                        className="sm"
                        onClick={() => handleEditCustomer(customer)}
                        style={{ color: 'var(--primary)' }}
                        title="Edit Customer"
                      >
                        Edit
                      </StyledButton>
                      <StyledButton
                        variant="outline"
                        className="sm"
                        onClick={() => handleDeleteCustomer(customer.id)}
                        style={{ color: 'var(--danger)' }}
                        title="Delete Customer"
                      >
                        Delete
                      </StyledButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} customers
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  className={`pagination-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {showModal && selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

const CustomerDetailModal = ({ customer, activeTab, setActiveTab, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{customer.name}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Customer Basic Info */}
          <div className="detail-grid">
            <div className="detail-card">
              <h3 className="detail-card-title">👤 Personal Information</h3>
              <DetailItem label="Customer ID" value={customer.id} />
              <DetailItem label="Name" value={customer.name} />
              <DetailItem label="Phone" value={customer.phone} />
              <DetailItem label="Email" value={customer.email} />
              <DetailItem label="Address" value={customer.address} />
            </div>

            <div className="detail-card">
              <h3 className="detail-card-title">🚗 Vehicle Information</h3>
              <DetailItem label="Vehicle Number" value={customer.vehicleNumber} />
              <DetailItem label="Make & Model" value={customer.vehicleModel} />
              <DetailItem label="Year" value={customer.vehicleYear} />
              <DetailItem label="Last Service" value={customer.lastService} />
            </div>

            <div className="detail-card">
              <h3 className="detail-card-title">💰 Purchase Summary</h3>
              <DetailItem label="Total Orders" value={customer.totalOrders} />
              <DetailItem label="Total Spent" value={customer.totalSpent} />
              <DetailItem label="Pending Amount" value={customer.pending} />
              <DetailItem label="Loyalty Points" value={customer.loyaltyPoints} />
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-nav">
            <TabButton label="🔧 Shop Services" active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} />
            <TabButton label="🏠 Home Services" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <TabButton label="⚙️ Parts Orders" active={activeTab === 'parts'} onClick={() => setActiveTab('parts')} />
            <TabButton label="🛢️ Oil Changes" active={activeTab === 'oil'} onClick={() => setActiveTab('oil')} />
            <TabButton label="💳 Billing History" active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
            <TabButton label="🎁 Offers & Discounts" active={activeTab === 'offers'} onClick={() => setActiveTab('offers')} />
          </div>

          {/* Tab Contents */}
          <div className="tab-content">
            {activeTab === 'shop' && <ShopServicesTab />}
            {activeTab === 'home' && <HomeServicesTab />}
            {activeTab === 'parts' && <PartsOrdersTab />}
            {activeTab === 'oil' && <OilChangesTab />}
            {activeTab === 'billing' && <BillingHistoryTab />}
            {activeTab === 'offers' && <OffersTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="detail-row">
    <span className="detail-label">{label}:</span>
    <span className="detail-val">{value}</span>
  </div>
);

const TabButton = ({ label, active, onClick }) => (
  <button
    className={`tab-btn ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    {label}
  </button>
);

const ShopServicesTab = () => (
  <div>
    <ServiceItem
      title="🔧 Engine Oil Change + Filter"
      date="15 Jan 2026"
      details={[
        { label: 'Mechanic', value: 'Rajesh Kumar' },
        { label: 'Service Type', value: 'Regular Maintenance' },
        { label: 'Duration', value: '45 mins' },
        { label: 'Amount', value: '₹2,500', isPrice: true }
      ]}
    />
    <ServiceItem
      title="🔩 Brake Pad Replacement"
      date="08 Jan 2026"
      details={[
        { label: 'Mechanic', value: 'Suresh Sharma' },
        { label: 'Parts Used', value: 'Bosch Brake Pads (Front)' },
        { label: 'Warranty', value: '6 months' },
        { label: 'Amount', value: '₹4,200', isPrice: true }
      ]}
    />
  </div>
);

const HomeServicesTab = () => (
  <div>
    <ServiceItem
      title="🏠 Battery Replacement at Home"
      date="20 Jan 2026"
      details={[
        { label: 'Service Location', value: 'Sector 21, Raipur' },
        { label: 'Technician', value: 'Amit Verma' },
        { label: 'Battery Brand', value: 'Exide 55Ah' },
        { label: 'Amount', value: '₹6,800', isPrice: true }
      ]}
    />
    <ServiceItem
      title="🔧 AC Gas Refill at Home"
      date="05 Jan 2026"
      details={[
        { label: 'Service Type', value: 'AC Maintenance' },
        { label: 'Gas Type', value: 'R134a' },
        { label: 'Service Charge', value: '₹500 (Visit)' },
        { label: 'Total Amount', value: '₹3,200', isPrice: true }
      ]}
    />
  </div>
);

const PartsOrdersTab = () => (
  <div>
    <ServiceItem
      title="📦 Online Order #ORD-2456"
      date="18 Jan 2026"
      details={[
        { label: 'Part', value: 'Air Filter - Maruti Swift' },
        { label: 'Brand', value: 'Mann Filter' },
        { label: 'Quantity', value: '2' },
        { label: 'Status', value: 'Delivered' },
        { label: 'Amount', value: '₹1,200', isPrice: true }
      ]}
    />
  </div>
);

const OilChangesTab = () => (
  <div>
    <ServiceItem
      title="🛢️ Synthetic Engine Oil Change"
      date="15 Jan 2026"
      details={[
        { label: 'Oil Brand', value: 'Castrol Magnatec 5W-40' },
        { label: 'Quantity', value: '4 Liters' },
        { label: 'Filter', value: 'Mann Oil Filter' },
        { label: 'Next Change', value: '15 Apr 2026' },
        { label: 'Amount', value: '₹2,800', isPrice: true }
      ]}
    />
  </div>
);

const BillingHistoryTab = () => (
  <div>
    <ServiceItem
      title="💳 Invoice #INV-8945"
      date="20 Jan 2026"
      details={[
        { label: 'Service', value: 'Home Battery Replacement' },
        { label: 'Subtotal', value: '₹6,300' },
        { label: 'GST (18%)', value: '₹1,134' },
        { label: 'Payment Method', value: 'UPI' },
        { label: 'Status', value: 'Paid' },
        { label: 'Total', value: '₹7,434', isPrice: true }
      ]}
    />
  </div>
);

const OffersTab = () => (
  <div>
    <ServiceItem
      title="🎁 Winter Service Package (Used)"
      date="15 Jan 2026"
      details={[
        { label: 'Offer Code', value: 'WINTER2026' },
        { label: 'Discount', value: '10% Off' },
        { label: 'Saved Amount', value: '₹250', isPrice: true },
        { label: 'Applied On', value: 'Oil Change Service' }
      ]}
    />
    <ServiceItem
      title="🎁 Loyalty Reward Points"
      date="Current Balance"
      details={[
        { label: 'Points Earned', value: '850 Points' },
        { label: 'Points Value', value: '₹850', isPrice: true },
        { label: 'Points Used', value: '200 Points' },
        { label: 'Available', value: '650 Points', isPrice: true }
      ]}
    />
  </div>
);

const ServiceItem = ({ title, date, details }) => (
  <div className="service-item">
    <div className="service-header">
      <span className="service-title">{title}</span>
      <span className="service-date">{date}</span>
    </div>
    <div className="service-details">
      {details.map((detail, idx) => (
        <div key={idx} className="detail-row">
          <span className="detail-label">{detail.label}:</span>
          <span className={`detail-val ${detail.isPrice ? 'price-tag' : ''}`}>
            {detail.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const AddCustomerForm = ({ formData, handleInputChange, handleSubmit, onBack, isEdit }) => {
  return (
    <div className="customer-container">
      <div className="page-header">
        <div className="header-title">
          <h1>{isEdit ? '📝 Edit Customer' : '➕ Add New Customer'}</h1>
          <p className="header-subtitle">Auto Parts & Services - {isEdit ? 'Update Registration' : 'Customer Registration'}</p>
        </div>
        <StyledButton variant="secondary" icon={ArrowLeft} onClick={onBack}>
          Back to Customer List
        </StyledButton>
      </div>

      <div className="main-content">
        <form onSubmit={handleSubmit}>

          {/* Personal Information */}
          <FormSection title="👤 Personal Information">
            <div className="detail-grid">
              <FormGroup label="Full Name" required>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter customer full name"
                  className="search-input"
                  required
                />
              </FormGroup>
              <FormGroup label="Phone Number" required>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                    handleInputChange({ target: { name: 'phone', value } });
                  }}
                  placeholder="10-digit mobile number"
                  className="search-input"
                  required
                />
              </FormGroup>
              <FormGroup label="Email Address">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="customer@email.com"
                  className="search-input"
                />
              </FormGroup>
              <FormGroup label="Date of Birth">
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="search-input"
                />
              </FormGroup>
              <FormGroup label="Address" required fullWidth>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter complete address with landmark"
                  className="search-input"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  required
                />
              </FormGroup>
              <FormGroup label="City">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="search-input"
                />
              </FormGroup>

              <FormGroup label="PIN Code">
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                    handleInputChange({ target: { name: 'pincode', value } });
                  }}
                  placeholder="492001"
                  className="search-input"
                />
              </FormGroup>
            </div>
          </FormSection>

          {/* Vehicle Information */}
          <FormSection title="🚗 Vehicle Information">
            <div className="detail-grid">
              <FormGroup label="Vehicle Registration Number" required>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    handleInputChange({ target: { name: 'vehicleNumber', value } });
                  }}
                  placeholder="CG 04 AB 1234"
                  className="search-input"
                  required
                />
              </FormGroup>
              <FormGroup label="Vehicle Type" required>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="filter-select"
                  style={{ width: '100%' }}
                  required
                >
                  <option value="">Select</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                </select>
              </FormGroup>
              <FormGroup label="Vehicle Brand" required>
                <select
                  name="vehicleBrand"
                  value={formData.vehicleBrand}
                  onChange={handleInputChange}
                  className="filter-select"
                  style={{ width: '100%' }}
                  required
                >
                  <option value="">Select Brand</option>
                  <option value="maruti">Maruti Suzuki</option>
                  <option value="hyundai">Hyundai</option>
                  <option value="tata">Tata</option>
                  <option value="mahindra">Mahindra</option>
                  <option value="honda">Honda</option>
                  <option value="toyota">Toyota</option>
                </select>
              </FormGroup>
              <FormGroup label="Vehicle Model" required>
                <input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleInputChange}
                  placeholder="Swift VXI, etc."
                  className="search-input"
                  required
                />
              </FormGroup>
              <FormGroup label="Manufacturing Year">
                <input
                  type="number"
                  name="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={handleInputChange}
                  placeholder="2023"
                  min="1990"
                  max="2026"
                  className="search-input"
                />
              </FormGroup>
              <FormGroup label="Fuel Type">
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="filter-select"
                  style={{ width: '100%' }}
                >
                  <option value="">Select Fuel</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="cng">CNG</option>
                </select>
              </FormGroup>
            </div>
          </FormSection>

          {/* Service Preferences */}
          <FormSection title="⚙️ Service Preferences">
            <div className="detail-grid">
              <FormGroup label="Preferred Oil Brand">
                <select
                  name="preferredOil"
                  value={formData.preferredOil}
                  onChange={handleInputChange}
                  className="filter-select"
                  style={{ width: '100%' }}
                >
                  <option value="">Select Oil Brand</option>
                  <option value="castrol">Castrol</option>
                  <option value="shell">Shell</option>
                  <option value="mobil">Mobil 1</option>
                  <option value="valvoline">Valvoline</option>
                </select>
              </FormGroup>
              <FormGroup label="Service Reminder">
                <select
                  name="serviceReminder"
                  value={formData.serviceReminder}
                  onChange={handleInputChange}
                  className="filter-select"
                  style={{ width: '100%' }}
                >
                  <option value="">Frequency</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="halfyearly">Half-Yearly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </FormGroup>
            </div>
          </FormSection>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            {!isEdit && (
              <StyledButton type="reset" variant="danger" icon={RotateCcw}>
                Reset Form
              </StyledButton>
            )}
            <StyledButton type="submit" variant="primary" icon={Save}>
              {isEdit ? 'Update Customer' : 'Add Customer'}
            </StyledButton>
          </div>

        </form>
      </div>
    </div>
  );
};

const FormSection = ({ title, children }) => (
  <div style={{ marginBottom: '2rem' }}>
    <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
      <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 600 }}>{title}</h2>
    </div>
    {children}
  </div>
);

const FormGroup = ({ label, required, children, fullWidth }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', ...(fullWidth ? { gridColumn: '1 / -1' } : {}) }}>
    <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>
      {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
    </label>
    {children}
  </div>
);

export default CustomerManagementApp;