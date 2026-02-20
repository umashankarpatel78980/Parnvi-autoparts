import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import InputField from "../components/InputField";
import StyledButton from "../components/StyledButton";

const AddPart = (props) => {
  const location = useLocation();
  const [partName, setPartName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState(props?.initialCategoryId || location.state?.categoryId || "");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPart = {
      name: partName,
      price,
      stock,
      categoryId,
    };

    console.log("Part Added:", newPart);
    // 🔗 API call here

    setPartName("");
    setPrice("");
    setStock("");
    setCategoryId("");
    if (props.onClose) props.onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputField
        label="Part Name"
        placeholder="Enter part name"
        value={partName}
        onChange={(e) => setPartName(e.target.value)}
        required
      />

      <InputField
        label="Price (₹)"
        type="number"
        placeholder="0"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <div>
        <InputField
          label="Stock"
          type="number"
          placeholder="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        {stock && (
          <p className="text-xs mt-1" style={{ color: stock < 10 ? 'var(--danger)' : 'var(--accent)' }}>
            {stock < 10 ? 'Low stock warning' : 'Stock level OK'}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-stone-800">
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
        <StyledButton type="submit" variant="primary">
          Add Part
        </StyledButton>
      </div>
    </form>
  );
};

export default AddPart;

