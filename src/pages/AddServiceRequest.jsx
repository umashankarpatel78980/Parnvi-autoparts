import { useState } from "react";
import './Forms.css';
import { useNavigate } from 'react-router-dom';

const AddServiceRequest = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer: "",
    tractor: "",
    type: "Shop Service",
    location: "",
    status: "Pending",
    priority: "Normal",
    mechanic: "",
    dateISO: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newService = {
      id: `SR-${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      mechanic: formData.status === "In Progress" || formData.status === "Completed" ? formData.mechanic : null,
    };

    // TODO: replace with API call
    console.log("New Service Request:", newService);

    // reset
    setFormData({ customer: "", tractor: "", type: "Shop Service", location: "", status: "Pending", priority: "Normal", mechanic: "", dateISO: "" });

    if (props?.onClose) return props.onClose();
    navigate(-1);
  };

  return (
    <div className="form-card">
      <div className="card">
        <div className="card-header">
          <h3>Add Service Request</h3>
        </div>
        <div className="form-body">
          <form onSubmit={handleSubmit} className="form-body">
            <div className="form-row">
              <label>Customer Name</label>
              <input type="text" name="customer" value={formData.customer} onChange={handleChange} placeholder="Customer Name" required />
            </div>

            <div className="form-row">
              <label>Tractor Model</label>
              <input type="text" name="tractor" value={formData.tractor} onChange={handleChange} placeholder="Tractor Model" required />
            </div>

            <div className="form-row">
              <label>Service Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option>Shop Service</option>
                <option>Home Service</option>
              </select>
            </div>

            <div className="form-row">
              <label>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
            </div>

            <div className="form-row">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="form-row">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option>Normal</option>
                <option>Emergency</option>
              </select>
            </div>

            {(formData.status === "In Progress" || formData.status === "Completed") && (
              <div className="form-row">
                <label>Assigned Mechanic</label>
                <input type="text" name="mechanic" value={formData.mechanic} onChange={handleChange} placeholder="Assigned Mechanic" />
              </div>
            )}

            <div className="form-row">
              <label>Service Date & Time</label>
              <input type="datetime-local" name="dateISO" value={formData.dateISO} onChange={handleChange} required />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => props?.onClose ? props.onClose() : navigate(-1)}>Cancel</button>
              <button type="submit" className="btn-primary">Add Service Request</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddServiceRequest;
