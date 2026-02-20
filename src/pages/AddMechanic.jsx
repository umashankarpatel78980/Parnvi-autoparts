import { useState } from "react";
import './Forms.css';
import { useNavigate } from "react-router-dom";
import StyledButton from '../components/StyledButton';

const AddMechanic = (props) => {
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState("Active");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!skill.trim()) newErrors.skill = "Skill is required";
    if (!contact.trim()) newErrors.contact = "Contact is required";
    else if (!/^[0-9]{10}$/.test(contact)) newErrors.contact = "Enter valid 10 digit number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newMechanic = { name, skill, contact, status };
    console.log("Mechanic Added:", newMechanic);
    // 🔗 API call here
    if (props?.onAdd) props.onAdd(newMechanic);
    if (props?.onClose) props.onClose();

    setName("");
    setSkill("");
    setContact("");
    setStatus("Active");
  };

  return (
    <div className="form-card">
      <div className="card">
        <div className="card-header">
          <h3>Add New Mechanic</h3>
        </div>
        <div className="form-body">
          <form onSubmit={handleSubmit} className="form-body">

            <div className="form-row">
              <label>Mechanic Name</label>
              <input type="text" placeholder="Enter mechanic name" value={name} onChange={(e) => setName(e.target.value)} required />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="form-row">
              <label>Skill</label>
              <input type="text" placeholder="Engine, Electrical, Hydraulics" value={skill} onChange={(e) => setSkill(e.target.value)} required />
              {errors.skill && <p className="error-text">{errors.skill}</p>}
            </div>

            <div className="form-row">
              <label>Contact Number</label>
              <input type="text" placeholder="10 digit mobile number" value={contact} onChange={(e) => setContact(e.target.value)} required />
              {errors.contact && <p className="error-text">{errors.contact}</p>}
            </div>

            <div className="form-row">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="Busy">Busy</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="form-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <StyledButton
                type="button"
                variant="secondary"
                onClick={() => {
                  if (props?.onClose) return props.onClose();
                  navigate(-1);
                }}
              >
                Cancel
              </StyledButton>
              <StyledButton type="submit" variant="primary">Add Mechanic</StyledButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMechanic;
