import API from "./axios";

// ── Brands ────────────────────────────────────────────────────────────────────
export const getBrands      = ()         => API.get("/brands");
export const createBrand    = (data)     => API.post("/brands", data);
export const updateBrand    = (id, data) => API.put(`/brands/${id}`, data);
export const deleteBrand    = (id)       => API.delete(`/brands/${id}`);

// ── Categories ────────────────────────────────────────────────────────────────
export const getCategories    = ()         => API.get("/categories");
export const createCategory   = (data)     => API.post("/categories", data);
export const deleteCategory   = (id)       => API.delete(`/categories/${id}`);

// ── Tractor Models ────────────────────────────────────────────────────────────
export const getTractorModels  = (params)   => API.get("/tractor-models", { params });
export const createTractorModel = (data)    => API.post("/tractor-models", data);
export const deleteTractorModel = (id)      => API.delete(`/tractor-models/${id}`);

// ── Parts ─────────────────────────────────────────────────────────────────────
export const getParts       = (params)   => API.get("/parts", { params });
export const createPart     = (data)     => API.post("/parts", data);
export const deletePart     = (id)       => API.delete(`/parts/${id}`);