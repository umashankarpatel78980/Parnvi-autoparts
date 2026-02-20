import React, { useState, useMemo, useEffect } from "react";
import {
    ArrowLeft,
    Package,
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    Info,
    CheckCircle,
    AlertCircle,
    Wrench,
    User,
    Calendar,
    MapPin,
    Save,
    X,
    Filter,
    Search,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { BRANDS, MODELS, ALL_PARTS, CATEGORIES  } from "./PartsData.jsx";
import "./CustomerServiceDashboard.css";

const CustomerServiceDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const serviceData = location.state?.service || null;

    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [stockTracker, setStockTracker] = useState({});

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Auto-detect brand and model from service data
    useEffect(() => {
        if (serviceData?.tractor) {
            const tractorStr = serviceData.tractor.toLowerCase();
            
            // Try to find brand
            const foundBrand = BRANDS.find(b => 
                tractorStr.includes(b.name.toLowerCase())
            );
            
            if (foundBrand) {
                setSelectedBrand(foundBrand);
                
                // Try to find model
                const foundModel = MODELS.find(m => 
                    m.brandId === foundBrand.id && 
                    tractorStr.includes(m.name.toLowerCase())
                );
                
                if (foundModel) {
                    setSelectedModel(foundModel);
                }
            }
        }
    }, [serviceData]);

    // Get models for selected brand
    const availableModels = useMemo(() => {
        if (!selectedBrand) return [];
        return MODELS.filter(m => m.brandId === selectedBrand.id);
    }, [selectedBrand]);

    // Get categories for selected model
    const availableCategories = useMemo(() => {
        if (!selectedModel) return [];
        const categoryIds = [...new Set(
            allParts
                .filter(p => p.modelId === selectedModel.id)
                .map(p => p.categoryId)
        )];
        return CATEGORIES .filter(c => categoryIds.includes(c.id));
    }, [selectedModel]);

    // Get filtered parts
    const filteredParts = useMemo(() => {
        if (!selectedModel) return [];

        return allParts.filter(p => {
            const matchesModel = p.modelId === selectedModel.id;
            const matchesCategory = !selectedCategory || p.categoryId === selectedCategory.id;
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesModel && matchesCategory && matchesSearch;
        }).map(p => ({
            ...p,
            availableStock: (p.stock || 0) - (stockTracker[p.id] || 0)
        }));
    }, [selectedModel, selectedCategory, searchTerm, stockTracker]);

    // Calculate totals
    const totals = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.18;
        return { 
            subtotal: subtotal.toFixed(2), 
            tax: tax.toFixed(2), 
            total: (subtotal + tax).toFixed(2) 
        };
    }, [cart]);

    // Cart operations with stock management
    const addToCart = (part) => {
        // Check if stock available
        const currentUsed = stockTracker[part.id] || 0;
        if (currentUsed >= part.stock) {
            alert(`❌ Stock Not Available! Already used: ${currentUsed}/${part.stock}`);
            return;
        }

        const existing = cart.find(item => item.id === part.id);
        if (existing) {
            setCart(cart.map(item => 
                item.id === part.id 
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
            // Update stock tracker
            setStockTracker(prev => ({
                ...prev,
                [part.id]: (prev[part.id] || 0) + 1
            }));
        } else {
            setCart([...cart, { ...part, quantity: 1 }]);
            // Update stock tracker
            setStockTracker(prev => ({
                ...prev,
                [part.id]: 1
            }));
        }
    };

    const updateQuantity = (id, delta) => {
        const item = cart.find(i => i.id === id);
        const part = allParts.find(p => p.id === id);
        if (!item || !part) return;

        const newQuantity = Math.max(1, item.quantity + delta);
        const maxAvailable = part.stock;

        // Check if new quantity exceeds stock
        if (newQuantity > maxAvailable) {
            alert(`❌ Only ${maxAvailable} units available!`);
            return;
        }

        setCart(cart.map(cartItem =>
            cartItem.id === id
                ? { ...cartItem, quantity: newQuantity }
                : cartItem
        ));

        // Update stock tracker
        setStockTracker(prev => ({
            ...prev,
            [id]: newQuantity
        }));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
        // Free up stock when removing
        setStockTracker(prev => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
        });
    };

    const handleSaveService = () => {
        const serviceDetails = {
            serviceId: serviceData.id,
            customer: serviceData.customer,
            tractor: serviceData.tractor,
            brand: selectedBrand?.name,
            model: selectedModel?.name,
            parts: cart,
            totals,
            savedAt: new Date().toISOString(),
        };
        
        console.log("Service saved:", serviceDetails);
        alert("Service saved successfully! Total: ₹" + totals.total);
        
        // You can add navigation or API call here
        // navigate('/service-management');
    };

    if (!serviceData) {
        return (
            <div className="errorContainer">
                <AlertCircle size={48} className="erroricon" />
                <h2>No Service Data Available</h2>
                <button onClick={() => navigate("/service-management")} className="btn primary">
                    Go Back to Services
                </button>
            </div>
        );
    }

    return (
        <div className="customerServiceDashboard">
            {/* HEADER */}
            <div className="dashboardHeader">
                <button onClick={() => navigate(-1)} className="backBtn">
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>

                <div className="headercontent">
                    <div className="headertop">
                        <h1>Service Dashboard</h1>
                        <span className={`statusbadge ${serviceData.status.toLowerCase().replace(' ', '-')}`}>
                            {serviceData.status}
                        </span>
                    </div>

                    <div className="serviceinfogrid">
                        <div className="infocard">
                            <User className="infoicon" />
                            <div>
                                <p className="infolabel">Customer</p>
                                <p className="infovalue">{serviceData.customer}</p>
                            </div>
                        </div>
                        <div className="infocard">
                            <Wrench className="infoicon" />
                            <div>
                                <p className="infolabel">Tractor</p>
                                <p className="infovalue">{serviceData.tractor}</p>
                            </div>
                        </div>
                        <div className="infocard">
                            <MapPin className="infoicon" />
                            <div>
                                <p className="infolabel">Location</p>
                                <p className="infovalue">{serviceData.location}</p>
                            </div>
                        </div>
                        <div className="infocard">
                            <Calendar className="infoicon" />
                            <div>
                                <p className="infolabel">Date</p>
                                <p className="infovalue">
                                    {new Date(serviceData.dateISO).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SELECTION SECTION */}
            <div className="selectionsection">
                <div className="selectioncard">
                    <h3 className="selectiontitle">
                        <Info size={18} />
                        Tractor Selection
                    </h3>

                    <div className="selectiongrid">
                        {/* Brand Selection */}
                        <div className="selectiongroup">
                            <label>Brand</label>
                            <select 
                                value={selectedBrand?.id || ""} 
                                onChange={(e) => {
                                    const brand = brands.find(b => b.id === e.target.value);
                                    setSelectedBrand(brand);
                                    setSelectedModel(null);
                                    setSelectedCategory(null);
                                }}
                                className="selectinput"
                            >
                                <option value="">Select Brand</option>
                                {brands.map(brand => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Model Selection */}
                        <div className="selectiongroup">
                            <label>Model</label>
                            <select 
                                value={selectedModel?.id || ""} 
                                onChange={(e) => {
                                    const model = models.find(m => m.id === e.target.value);
                                    setSelectedModel(model);
                                    setSelectedCategory(null);
                                }}
                                disabled={!selectedBrand}
                                className="selectinput"
                            >
                                <option value="">Select Model</option>
                                {availableModels.map(model => (
                                    <option key={model.id} value={model.id}>
                                        {model.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="selectiongroup">
                            <label>Category (Optional)</label>
                            <select 
                                value={selectedCategory?.id || ""} 
                                onChange={(e) => {
                                    const category = categories.find(c => c.id === e.target.value);
                                    setSelectedCategory(category || null);
                                }}
                                disabled={!selectedModel}
                                className="selectinput"
                            >
                                <option value="">All Categories</option>
                                {availableCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedBrand && selectedModel && (
                        <div className="detectionbadge">
                            <CheckCircle size={18} />
                            <span>
                                <strong>{selectedBrand.name}</strong> / {selectedModel.name}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="maincontent">
                {/* PARTS SECTION */}
                <div className="partssection">
                    <div className="partsheader">
                        <h2>
                            <Package size={20} />
                            Available Parts
                        </h2>
                        <div className="searchbox">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search parts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {!selectedModel ? (
                        <div className="emptystate">
                            <Package size={48} />
                            <p>Please select a brand and model to view parts</p>
                        </div>
                    ) : filteredParts.length === 0 ? (
                        <div className="emptystate">
                            <AlertCircle size={48} />
                            <p>No parts found for the selected filters</p>
                        </div>
                    ) : (
                        <div className="partsgrid">
                            {filteredParts.map(part => (
                                <div key={part.id} className="partcard">
                                    <div className="partinfo">
                                        <h4>{part.name}</h4>
                                        <p className="partcategory">
                                            {categories.find(c => c.id === part.categoryId)?.name}
                                        </p>
                                        <div className="partdetails">
                                            <span className="partprice">₹{part.price}</span>
                                            <span className={`partstock ${part.availableStock === 0 ? 'outofstock' : ''}`}>
                                                Available: {part.availableStock}/{part.stock}
                                            </span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => addToCart(part)}
                                        className="btn addbtn"
                                        disabled={part.availableStock === 0}
                                        title={part.availableStock === 0 ? 'Out of stock' : 'Add to cart'}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CART SECTION */}
                <div className="cartsection">
                    <div className="cartheader">
                        <h2>
                            <ShoppingCart size={20} />
                            Cart ({cart.length})
                        </h2>
                    </div>

                    {cart.length === 0 ? (
                        <div className="emptycart">
                            <ShoppingCart size={48} />
                            <p>Cart is empty</p>
                            <span>Add parts to get started</span>
                        </div>
                    ) : (
                        <>
                            <div className="cartitems">
                                {cart.map(item => (
                                    <div key={item.id} className="cartitem">
                                        <div className="cartiteminfo">
                                            <h4>{item.name}</h4>
                                            <p className="cartitemprice">
                                                ₹{item.price} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="cartitemactions">
                                            <button 
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="qtybtn"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="qtydisplay">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="qtybtn"
                                            >
                                                <Plus size={14} />
                                            </button>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="removebtn"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cartsummary">
                                <div className="summaryrow">
                                    <span>Subtotal:</span>
                                    <span>₹{totals.subtotal}</span>
                                </div>
                                <div className="summaryrow">
                                    <span>GST (18%):</span>
                                    <span>₹{totals.tax}</span>
                                </div>
                                <div className="summaryrow total">
                                    <span>Total:</span>
                                    <span>₹{totals.total}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleSaveService}
                                className="btn primary savebtn"
                            >
                                <Save size={18} />
                                Save Service
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerServiceDashboard;