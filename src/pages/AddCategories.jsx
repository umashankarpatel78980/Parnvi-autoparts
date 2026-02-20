import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import InputField from "../components/InputField";
import StyledButton from "../components/StyledButton";

const AddCategory = (props) => {
  const location = useLocation();
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const [modelId, setModelId] = useState(props?.initialModelId || location.state?.modelId || "");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCategory = {
      name: categoryName,
      icon: categoryIcon,
      modelId,
    };
    console.log("Category Added:", newCategory);
    // 🔗 API call here

    setCategoryName("");
    setCategoryIcon("");
    setModelId("");
    if (props.onClose) props.onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputField
        label="Category Name"
        placeholder="Enter category name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        required
      />

      <InputField
        label="Category Icon (emoji / icon name)"
        placeholder="⚙️ or EngineIcon"
        value={categoryIcon}
        onChange={(e) => setCategoryIcon(e.target.value)}
        required
      />

      {categoryIcon && (
        <div className="mt-2">
          <label className="text-sm text-stone-400 mb-1 block">Icon Preview</label>
          <div className="h-16 flex items-center justify-center text-2xl bg-stone-900 rounded-md border border-stone-800">
            {categoryIcon}
          </div>
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
          Add Category
        </StyledButton>
      </div>
    </form>
  );
};

export default AddCategory;

