function CustomerDashboard({ service, cart, onClose, onSaveCart }) {
    return (
        <div className="customer-dashboard">
            <h2>Customer Dashboard</h2>
            <div className="dashboard-content">
                <div className="card service-details">
                    <div className="card-header">   
                        <h3>Service Details</h3>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                    <div className="card-body">
                        <p><strong>Service ID:</strong> {service.id}</p>
                        <p><strong>Customer:</strong> {service.customer}</p>
                        <p><strong>Tractor:</strong> {service.tractor}</p>
                        <p><strong>Type:</strong> {service.type}</p>
                        <p><strong>Status:</strong> {service.status}</p>
                    </div>
                </div>

                <div className="card parts-cart">
                    <div className="card-header">
                        <h3>Parts Cart</h3>
                        <button className="save-btn" onClick={() => onSaveCart(cart)}>Save Cart</button>
                    </div>
                    <div className="card-body">
                        {cart.items.length === 0 ? (
                            <p>Your cart is empty.</p>
                        ) : (
                            <ul>
                                {cart.items.map((item) => ( 
                                    <li key={item.partId}>
                                        {item.partName} - Quantity: {item.quantity}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}