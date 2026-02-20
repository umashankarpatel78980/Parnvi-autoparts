import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import StyledButton from "../components/StyledButton";

const AddHardwareProduct = (props) => {
    const navigate = useNavigate();
    const isEditing = !!props?.initialHardwareId;

    const [name, setName] = useState(props?.name || "");
    const [category, setCategory] = useState(props?.category || "");
    const [unit, setUnit] = useState(props?.unit || "pcs");
    const [price, setPrice] = useState(props?.price || "");
    const [stock, setStock] = useState(props?.stock || "");
    const [sku, setSku] = useState(props?.sku || "");
    const [image, setImage] = useState(props?.image || "");

    const handleSubmit = (e) => {
        e.preventDefault();

        const newHardwareItem = {
            name,
            category,
            unit,
            price: Number(price),
            stock: Number(stock),
            sku,
            image,
        };

        console.log("Hardware Product Added:", newHardwareItem);
        // 🔗 API call here

        setName("");
        setCategory("");
        setUnit("pcs");
        setPrice("");
        setStock("");
        setSku("");
        setImage("");

        if (props?.onClose) {
            props.onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField
                label="Product Name"
                placeholder="Enter hardware name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <InputField
                label="Category"
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
            >
                <option value="">Select Category</option>
                <option value="Fasteners">Fasteners</option>
                <option value="Rotating">Rotating</option>
                <option value="Lubrication">Lubrication</option>
                <option value="Fittings">Fittings</option>
            </InputField>

            <InputField
                label="Unit"
                as="select"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
            >
                <option value="pcs">Pieces (pcs)</option>
            </InputField>

            <InputField
                label="Price (₹)"
                type="number"
                placeholder="Enter price per unit"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
            />

            <div>
                <InputField
                    label="Stock"
                    type="number"
                    placeholder="Available stock"
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

            <InputField
                label="SKU"
                placeholder="Enter SKU code"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
            />

            <InputField
                label="Image URL"
                placeholder="Enter image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
            />

            {image && (
                <div className="mt-2">
                    <label className="text-sm text-stone-400 mb-1 block">Preview</label>
                    <img src={image} alt="Preview" className="w-full h-32 object-contain bg-stone-900 rounded-md border border-stone-800" />
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
                    {isEditing ? 'Update Hardware' : 'Add Hardware'}
                </StyledButton>
            </div>
        </form>
    );
};

export default AddHardwareProduct;
