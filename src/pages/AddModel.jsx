import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import InputField from "../components/InputField";
import StyledButton from "../components/StyledButton";

const AddModel = (props) => {
  const location = useLocation();
  const [modelName, setModelName] = useState("");
  const [modelImage, setModelImage] = useState("");
  const [brandId, setBrandId] = useState(props?.initialBrandId || location.state?.brandId || "");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newModel = {
      name: modelName,
      image: modelImage,
      brandId,
    };

    console.log("Model Added:", newModel);
    // 🔗 API call here

    setModelName("");
    setModelImage("");
    setBrandId("");
    if (props.onClose) props.onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputField
        label="Model Name"
        placeholder="Enter model name"
        value={modelName}
        onChange={(e) => setModelName(e.target.value)}
        required
      />

      <InputField
        label="Model Image URL"
        placeholder="Enter image URL"
        value={modelImage}
        onChange={(e) => setModelImage(e.target.value)}
        required
      />

      {modelImage && (
        <div className="mt-2">
          <label className="text-sm text-stone-400 mb-1 block">Preview</label>
          <img src={modelImage} alt="Preview" className="w-full h-32 object-contain bg-stone-900 rounded-md border border-stone-800" />
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
          Add Model
        </StyledButton>
      </div>
    </form>
  );
};

export default AddModel;

