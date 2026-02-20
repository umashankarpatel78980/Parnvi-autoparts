import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import StyledButton from "../components/StyledButton";

const AddBrand = (props) => {
  const [brandName, setBrandName] = useState("");
  const [brandImage, setBrandImage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBrand = {
      name: brandName,
      image: brandImage,
    };

    console.log("Brand Added:", newBrand);
    // 🔗 API call here

    setBrandName("");
    setBrandImage("");
    if (props.onClose) props.onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputField
        label="Brand Name"
        placeholder="Enter brand name"
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
        required
      />

      <InputField
        label="Brand Image URL"
        placeholder="Enter image URL"
        value={brandImage}
        onChange={(e) => setBrandImage(e.target.value)}
        required
      />

      {brandImage && (
        <div className="mt-2">
          <label className="text-sm text-stone-400 mb-1 block">Preview</label>
          <img src={brandImage} alt="Preview" className="w-full h-32 object-contain bg-stone-900 rounded-md border border-stone-800" />
        </div>
      )}

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
          Add Brand
        </StyledButton>
      </div>
    </form>
  );
};

export default AddBrand;

