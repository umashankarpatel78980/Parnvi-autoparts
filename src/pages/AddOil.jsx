import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import InputField from "../components/InputField";
import StyledButton from "../components/StyledButton";

const AddOil = (props) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [oilName, setOilName] = useState("");
    const [oilImage, setOilImage] = useState("");
    const [brandId, setBrandId] = useState(props?.initialBrandId || location.state?.brandId || "");

    const handleSubmit = (e) => {
        e.preventDefault();

        const newOil = {
            name: oilName,
            image: oilImage,
            brandId,
        };

        console.log("Oil Added:", newOil);
        // 🔗 API call here

        setOilName("");
        setOilImage("");
        setBrandId("");

        // Close form after submission if onClose exists
        if (props?.onClose) {
            props.onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField
                label="Oil Name"
                placeholder="Enter oil name"
                value={oilName}
                onChange={(e) => setOilName(e.target.value)}
                required
            />

            <InputField
                label="Oil Image URL"
                placeholder="Enter image URL"
                value={oilImage}
                onChange={(e) => setOilImage(e.target.value)}
                required
            />

            {oilImage && (
                <div className="mt-2">
                    <label className="text-sm text-stone-400 mb-1 block">Preview</label>
                    <img src={oilImage} alt="Preview" className="w-full h-32 object-contain bg-stone-900 rounded-md border border-stone-800" />
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
                    Add Oil
                </StyledButton>
            </div>
        </form>
    );
};

export default AddOil;
