import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InputField from "../components/InputField";
import StyledButton from "../components/StyledButton";

const AddVarient = (props) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [size, setSize] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [sku, setSku] = useState("");
    const [status, setStatus] = useState("Available");

    const productId = props?.productId || location.state?.productId;

    const handleSubmit = (e) => {
        e.preventDefault();

        const newVariant = {
            productId,
            size,
            price: Number(price),
            stock: Number(stock),
            sku,
            status,
        };

        console.log("Variant Added:", newVariant);
        // 🔗 API call here

        setSize("");
        setPrice("");
        setStock("");
        setSku("");
        setStatus("Available");

        if (props?.onClose) {
            props.onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField
                label="Size"
                as="select"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
            >
                <option value="">Select Size</option>
                <option value="1L">1 Liter</option>
                <option value="2L">2 Liter</option>
                <option value="5L">5 Liter</option>
                <option value="10L">10 Liter</option>
                <option value="15L">15 Liter</option>
                <option value="20L">20 Liter</option>
                <option value="25L">25 Liter</option>
            </InputField>

            <InputField
                label="Price (₹)"
                type="number"
                placeholder="Enter price"
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
                label="Status"
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
            </InputField>

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
                    Add Variant
                </StyledButton>
            </div>
        </form>
    );
};

export default AddVarient;
