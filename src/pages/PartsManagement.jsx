import { useState, useMemo, useEffect, useCallback } from "react";
import { BRANDS, MODELS, CATEGORIES, ALL_PARTS, OIL_COMPANIES, OIL_PRODUCTS, HARDWARE_ITEMS } from "./PartsData.jsx";
import {
  getBrands, createBrand as apiBrand,
  getCategories, createCategory as apiCategory,
  getTractorModels, createTractorModel as apiModel,
  getParts, createPart as apiPart,
} from "../api/service.js";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg-elevated: #222829; --border: rgba(255,255,255,0.07); --border-hover: rgba(255,255,255,0.15);
    --primary: #f59e0b; --primary-dim: rgba(245,158,11,0.12); --primary-glow: rgba(245,158,11,0.3);
    --danger: #ef4444; --danger-dim: rgba(239,68,68,0.12); --success: #22c55e; --success-dim: rgba(34,197,94,0.12);
    --text: #f1f5f9; --text-muted: #64748b; --text-dim: #334155;
    --radius: 10px; --radius-sm: 6px; --radius-lg: 16px;
    --font: 'Space Grotesk', sans-serif; --font-display: 'Bebas Neue', sans-serif;
    --shadow: 0 4px 24px rgba(0,0,0,0.5); --shadow-primary: 0 0 20px rgba(245,158,11,0.15);
  }
  body { color: var(--text); font-family: var(--font); }
  .pm-root { min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); }
  .pm-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 16px; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 40; gap: 16px; backdrop-filter: blur(12px);  }
  .pm-header-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
  .pm-header-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }
  .back-btn { width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-surface); color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .back-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-dim); }
  .breadcrumbs { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-muted); flex-wrap: wrap; }
  .breadcrumbs .crumb { cursor: pointer; transition: color 0.15s; white-space: nowrap; }
  .breadcrumbs .crumb:hover { color: var(--text); }
  .breadcrumbs .crumb.active { color: var(--primary); font-weight: 600; }
  .breadcrumbs .sep { color: var(--text-dim); font-size: 12px; }
  .search-wrap { position: relative; }
  .search-wrap svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
  .search-input { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text); font-family: var(--font); font-size: 13px; padding: 8px 12px 8px 34px; width: 200px; transition: all 0.15s; outline: none; }
  .search-input:focus { border-color: var(--primary); background: var(--bg-elevated); width: 240px; }
  .search-input::placeholder { color: var(--text-muted); }
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: var(--radius-sm); font-family: var(--font); font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.15s; white-space: nowrap; outline: none; }
  .btn-primary { background: var(--primary); color: #000; font-weight: 600; }
  .btn-primary:hover { filter: brightness(1.1); box-shadow: var(--shadow-primary); }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text-muted); }
  .btn-outline:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-dim); }
  .btn-danger { background: var(--danger-dim); border: 1px solid rgba(239,68,68,0.2); color: var(--danger); }
  .btn-danger:hover { background: var(--danger); color: white; }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn-tab { background: transparent; border: 1px solid var(--border); color: var(--text-muted); }
  .btn-tab.active { background: var(--primary-dim); border-color: var(--primary); color: var(--primary); }
  .btn-tab:hover:not(.active) { border-color: var(--border-hover); color: var(--text); }
  .pm-content { padding: 24px; flex: 1; }
  .section-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; gap: 12px; flex-wrap: wrap; }
  .section-hdr-left { display: flex; align-items: center; gap: 12px; }
  .section-hdr-right { display: flex; align-items: center; gap: 8px; }
  .section-title { font-family: var(--font-display); font-size: 28px; letter-spacing: 1px; color: var(--text); line-height: 1; }
  .section-count { background: var(--bg-surface); border: 1px solid var(--border); border-radius: 20px; padding: 2px 10px; font-size: 12px; color: var(--text-muted); font-weight: 500; }
  .brand-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
  .brand-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; cursor: pointer; transition: all 0.2s; }
  .brand-card:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: var(--shadow-primary); }
  .brand-card-img { height: 140px; display: flex; align-items: center; justify-content: center; padding: 20px; background: var(--bg-surface); }
  .brand-card-img img { max-height: 80px; max-width: 100%; object-fit: contain; opacity: 0.85; transition: all 0.3s; }
  .brand-card:hover .brand-card-img img { opacity: 1; }
  .brand-card-info { padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; }
  .brand-card-info h3 { font-size: 15px; font-weight: 600; }
  .brand-card-arrow { width: 28px; height: 28px; border-radius: 50%; background: var(--primary-dim); color: var(--primary); display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .brand-card:hover .brand-card-arrow { background: var(--primary); color: #000; }
  .model-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
  .model-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; cursor: pointer; transition: all 0.2s; }
  .model-card:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: var(--shadow-primary); }
  .model-card-img { height: 130px; background: var(--bg-surface); position: relative; overflow: hidden; }
  .model-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
  .model-card:hover .model-card-img img { transform: scale(1.05); }
  .model-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); display: flex; align-items: flex-end; padding: 10px 12px; opacity: 0; transition: opacity 0.2s; }
  .model-card:hover .model-card-overlay { opacity: 1; }
  .model-card-overlay span { color: white; font-size: 12px; font-weight: 500; }
  .model-card-info { padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; }
  .model-card-info h3 { font-size: 14px; font-weight: 600; }
  .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 14px; }
  .cat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px 16px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
  .cat-card:hover { border-color: var(--primary); background: var(--bg-surface); transform: translateY(-2px); }
  .cat-icon { font-size: 32px; width: 60px; height: 60px; background: var(--bg-surface); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .cat-card:hover .cat-icon { background: var(--primary-dim); }
  .cat-card h3 { font-size: 13px; font-weight: 600; }
  .cat-badge { font-size: 11px; color: var(--text-muted); background: var(--bg-elevated); padding: 2px 8px; border-radius: 20px; }
  .parts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
  .part-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; display: flex; flex-direction: column; transition: all 0.2s; }
  .part-card:hover { border-color: var(--border-hover); }
  .part-card-img { height: 120px; background: var(--bg-surface); display: flex; align-items: center; justify-content: center; color: var(--text-dim); font-size: 36px; }
  .part-card-body { padding: 14px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .part-card-body h4 { font-size: 14px; font-weight: 600; }
  .part-id { font-size: 11px; color: var(--text-muted); font-family: monospace; }
  .part-meta { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
  .price-tag { font-size: 16px; font-weight: 700; color: var(--primary); }
  .stock-badge { font-size: 11px; padding: 3px 8px; border-radius: 20px; font-weight: 600; }
  .stock-ok { background: var(--success-dim); color: var(--success); }
  .stock-low { background: var(--danger-dim); color: var(--danger); }
  .add-to-cart-btn { width: 100%; padding: 9px; background: transparent; border: 1px solid var(--primary); color: var(--primary); border-radius: 0 0 var(--radius) var(--radius); font-family: var(--font); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .add-to-cart-btn:hover { background: var(--primary); color: #000; }
  .oils-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px; }
  .oil-company-card { border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; cursor: pointer; transition: all 0.2s; background: var(--bg-card); }
  .oil-company-card:hover { border-color: var(--primary); background: var(--bg-surface); }
  .oil-company-card-img { height: 110px; padding: 16px; display: flex; align-items: center; justify-content: center; }
  .oil-company-card-img img { max-height: 60px; max-width: 100%; object-fit: contain; opacity: 0.8; transition: all 0.2s; }
  .oil-company-card:hover .oil-company-card-img img { opacity: 1; }
  .oil-company-card-name { padding: 10px 14px; font-size: 13px; font-weight: 600; }
  .oil-variant-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin-top: 20px; }
  .oil-variant-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; display: flex; flex-direction: column; gap: 8px; }
  .ovc-name { font-size: 14px; font-weight: 700; }
  .ovc-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); }
  .hw-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
  .hw-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; display: flex; gap: 14px; align-items: flex-start; }
  .hw-card:hover { border-color: var(--border-hover); }
  .hw-img { width: 64px; height: 64px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0; background: var(--bg-surface); display: flex; align-items: center; justify-content: center; color: var(--text-dim); font-size: 24px; }
  .hw-img img { width: 100%; height: 100%; object-fit: cover; }
  .hw-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
  .hw-name { font-size: 14px; font-weight: 700; }
  .hw-meta { font-size: 12px; color: var(--text-muted); display: flex; justify-content: space-between; }
  .hw-actions { display: flex; gap: 6px; margin-top: 8px; }
  .low-stock-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
  .ls-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; display: flex; flex-direction: column; gap: 8px; }
  .ls-card:hover { border-color: var(--border-hover); }
  .ls-icon { font-size: 28px; width: 52px; height: 52px; background: var(--bg-surface); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; }
  .ls-name { font-size: 14px; font-weight: 700; }
  .ls-sub { font-size: 12px; color: var(--text-muted); }
  .ls-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
  .ls-type-badge { font-size: 10px; padding: 2px 8px; border-radius: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .ls-type-part { background: rgba(99,102,241,0.15); color: #818cf8; }
  .ls-type-oil { background: rgba(20,184,166,0.15); color: #2dd4bf; }
  .ls-type-hw { background: rgba(251,146,60,0.15); color: #fb923c; }
  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.15s; }
  .modal-box { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(0,0,0,0.7); animation: slideUp 0.2s; }
  .modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: var(--bg-card); z-index: 1; }
  .modal-title { font-family: var(--font-display); font-size: 22px; letter-spacing: 1px; }
  .modal-close { width: 32px; height: 32px; border-radius: 8px; background: var(--bg-surface); border: 1px solid var(--border); color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; font-size: 18px; }
  .modal-close:hover { background: var(--danger-dim); border-color: var(--danger); color: var(--danger); }
  .modal-body { padding: 24px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .form-input { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text); font-family: var(--font); font-size: 14px; padding: 10px 12px; transition: all 0.15s; outline: none; width: 100%; }
  .form-input:focus { border-color: var(--primary); background: var(--bg-elevated); }
  .form-input::placeholder { color: var(--text-dim); }
  select.form-input { cursor: pointer; }
  select.form-input option { background: var(--bg-card); }
  .form-hint { font-size: 11px; color: var(--text-muted); }
  .form-hint.warn { color: var(--danger); }
  .form-hint.ok { color: var(--success); }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-form { display: flex; flex-direction: column; gap: 16px; }
  .form-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; padding-top: 16px; border-top: 1px solid var(--border); }
  .error-msg { color: var(--danger); font-size: 12px; padding: 8px 12px; background: var(--danger-dim); border-radius: var(--radius-sm); border: 1px solid rgba(239,68,68,0.2); }
  .img-preview { width: 100%; height: 120px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; overflow: hidden; margin-top: 6px; }
  .img-preview img { max-height: 100%; max-width: 100%; object-fit: contain; }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .empty-icon { font-size: 48px; opacity: 0.4; }
  .empty-state h3 { font-size: 16px; font-weight: 600; }
  .empty-state p { font-size: 13px; max-width: 280px; line-height: 1.5; }
  .load-more-wrap { text-align: center; margin-top: 24px; }
  .spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.6s linear infinite; }
  .loading-wrap { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 60px; color: var(--text-muted); font-size: 14px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .anim-fade { animation: fadeIn 0.25s ease; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-dim); border-radius: 3px; }
  @media (max-width: 768px) {
    .pm-header { flex-direction: column; align-items: stretch; }
    .pm-header-right { flex-wrap: wrap; }
    .search-input { width: 100%; }
    .form-grid { grid-template-columns: 1fr; }
    .section-title { font-size: 22px; }
  }
`;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  back: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>,
  chevron: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>,
  search: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>,
  plus: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>,
  close: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>,
  pkg: () => <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
  edit: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  trash: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>,
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
// Normalize backend brand → UI shape
const normalizeBrand = (b) => ({
  id: b._id,
  name: b.name,
  image: b.image?.url || b.image || "",
  slug: b.slug,
  _fromDB: true,
});

// Normalize backend model → UI shape
const normalizeModel = (m) => ({
  id: m._id,
  name: m.name,
  image: m.image || "",
  brandId: m.brand?._id || m.brand,
  type: m.type,
  slug: m.slug,
  _fromDB: true,
});

// Normalize backend category → UI shape
const normalizeCategory = (c) => ({
  id: c._id,
  name: c.name,
  icon: c.icon?.url || c.icon || "⚙️",
  slug: c.slug,
  _fromDB: true,
});

// Normalize backend part → UI shape
const normalizePart = (p) => ({
  id: p._id,
  name: p.name,
  price: p.price,
  stock: p.stock,
  modelId: p.modelId?._id || p.modelId,
  categoryId: p.categoryId?._id || p.categoryId,
  slug: p.slug,
  _fromDB: true,
});

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}><Icon.close /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// ─── FORM HELPERS ─────────────────────────────────────────────────────────────
function Field({ label, hint, hintType, children }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      {children}
      {hint && <span className={`form-hint ${hintType || ''}`}>{hint}</span>}
    </div>
  );
}
function Input({ label, hint, hintType, ...props }) {
  return <Field label={label} hint={hint} hintType={hintType}><input className="form-input" {...props} /></Field>;
}
function Select({ label, hint, hintType, options, ...props }) {
  return (
    <Field label={label} hint={hint} hintType={hintType}>
      <select className="form-input" {...props}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
}

// ─── ADD BRAND FORM ───────────────────────────────────────────────────────────
function AddBrandForm({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await apiBrand({ name: name.trim(), image: { url: image.trim(), publicId: "" } });
      onAdd(normalizeBrand(res.data.data));
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-form" onSubmit={handleSubmit}>
      <Input label="Brand Name" placeholder="e.g. Mahindra" value={name} onChange={e => setName(e.target.value)} required />
      <Input label="Logo / Image URL" placeholder="https://..." value={image} onChange={e => setImage(e.target.value)} required />
      {image && <div className="img-preview"><img src={image} alt="preview" onError={e => e.target.style.display = 'none'} /></div>}
      {error && <p className="error-msg">{error}</p>}
      <div className="form-footer">
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Adding..." : <><Icon.plus /> Add Brand</>}</button>
      </div>
    </form>
  );
}

// ─── ADD MODEL FORM ───────────────────────────────────────────────────────────
function AddModelForm({ brands, initialBrandId, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [brandId, setBrandId] = useState(initialBrandId || "");
  const [type, setType] = useState("big");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await apiModel({ name: name.trim(), brand: brandId, type, image: image || "https://images.unsplash.com/photo-1599693162823-0bb16e9e4e26?w=400&q=80" });
      onAdd(normalizeModel(res.data.data));
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add model");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-form" onSubmit={handleSubmit}>
      <Select label="Brand" value={brandId} onChange={e => setBrandId(e.target.value)} required
        options={[{ value: '', label: 'Select Brand' }, ...brands.map(b => ({ value: b.id, label: b.name }))]} />
      <Input label="Model Name" placeholder="e.g. 575 DI" value={name} onChange={e => setName(e.target.value)} required />
      <Select label="Type" value={type} onChange={e => setType(e.target.value)}
        options={[{ value: 'big', label: 'Big Tractor' }, { value: 'medium', label: 'Medium Tractor' }, { value: 'mini', label: 'Mini Tractor' }]} />
      <Input label="Image URL" placeholder="https://..." value={image} onChange={e => setImage(e.target.value)} />
      {image && <div className="img-preview"><img src={image} alt="preview" onError={e => e.target.style.display = 'none'} /></div>}
      {error && <p className="error-msg">{error}</p>}
      <div className="form-footer">
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Adding..." : <><Icon.plus /> Add Model</>}</button>
      </div>
    </form>
  );
}

// ─── ADD CATEGORY FORM ────────────────────────────────────────────────────────
function AddCategoryForm({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("⚙️");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ICONS = ["⚙️", "🔧", "⛽", "⚡", "🌀", "🛑", "🔩", "🔌", "💧", "🏗️"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await apiCategory({ name: name.trim(), icon: { url: icon, publicId: "" } });
      onAdd(normalizeCategory(res.data.data));
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-form" onSubmit={handleSubmit}>
      <Input label="Category Name" placeholder="e.g. Engine Parts" value={name} onChange={e => setName(e.target.value)} required />
      <Field label="Icon">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          {ICONS.map(ic => (
            <button key={ic} type="button" onClick={() => setIcon(ic)}
              style={{ width: 40, height: 40, fontSize: 20, background: ic === icon ? 'var(--primary-dim)' : 'var(--bg-surface)', border: `1px solid ${ic === icon ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer' }}>
              {ic}
            </button>
          ))}
        </div>
      </Field>
      {error && <p className="error-msg">{error}</p>}
      <div className="form-footer">
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Adding..." : <><Icon.plus /> Add Category</>}</button>
      </div>
    </form>
  );
}

// ─── ADD PART FORM ────────────────────────────────────────────────────────────
function AddPartForm({ categories, initialModelId, initialCategoryId, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [catId, setCatId] = useState(initialCategoryId || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const stockNum = Number(stock);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await apiPart({ name: name.trim(), price: Number(price), stock: Number(stock), modelId: initialModelId, categoryId: catId });
      onAdd(normalizePart(res.data.data));
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add part");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-form" onSubmit={handleSubmit}>
      <Input label="Part Name" placeholder="e.g. Piston Ring Set" value={name} onChange={e => setName(e.target.value)} required />
      <Select label="Category" value={catId} onChange={e => setCatId(e.target.value)} required
        options={[{ value: '', label: 'Select Category' }, ...categories.map(c => ({ value: c.id, label: `${c.icon} ${c.name}` }))]} />
      <div className="form-grid">
        <Input label="Price (₹)" type="number" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} required />
        <Input label="Stock" type="number" placeholder="0" value={stock} onChange={e => setStock(e.target.value)} required
          hint={stock ? (stockNum < 10 ? '⚠ Low stock warning' : '✓ Stock OK') : ''}
          hintType={stock ? (stockNum < 10 ? 'warn' : 'ok') : ''} />
      </div>
      {error && <p className="error-msg">{error}</p>}
      <div className="form-footer">
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Adding..." : <><Icon.plus /> Add Part</>}</button>
      </div>
    </form>
  );
}

// ─── OIL / HARDWARE FORMS (local only — no backend yet) ──────────────────────
function AddOilForm({ onClose, onAdd }) {
  const [name, setName] = useState(""); const [image, setImage] = useState("");
  const handleSubmit = e => { e.preventDefault(); if (!name.trim()) return; onAdd({ id: Date.now(), name: name.trim(), image: image || "https://placehold.co/120x80/1c2124/64748b?text=Oil" }); onClose(); };
  return (
    <form className="form-form" onSubmit={handleSubmit}>
      <Input label="Company Name" placeholder="e.g. Castrol" value={name} onChange={e => setName(e.target.value)} required />
      <Input label="Logo URL" placeholder="https://..." value={image} onChange={e => setImage(e.target.value)} />
      {image && <div className="img-preview"><img src={image} alt="preview" onError={e => e.target.style.display = 'none'} /></div>}
      <div className="form-footer">
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary"><Icon.plus /> Add Oil Company</button>
      </div>
    </form>
  );
}

function AddVariantForm({ companyId, onClose, onAdd }) {
  const [productName, setProductName] = useState(""); const [size, setSize] = useState("1L");
  const [price, setPrice] = useState(""); const [stock, setStock] = useState(""); const [sku, setSku] = useState("");
  const sizes = ["500ml", "1L", "2L", "5L", "10L", "15L", "20L", "25L"];
  const handleSubmit = e => { e.preventDefault(); onAdd({ companyId, productName, size, price: Number(price), stock: Number(stock), sku }); onClose(); };
  const stockNum = Number(stock);
  return (
    <form className="form-form" onSubmit={handleSubmit}>
      <Input label="Product Name" placeholder="e.g. Castrol ACTIV 4T" value={productName} onChange={e => setProductName(e.target.value)} required />
      <Select label="Size" value={size} onChange={e => setSize(e.target.value)} options={sizes.map(s => ({ value: s, label: s }))} />
      <div className="form-grid">
        <Input label="Price (₹)" type="number" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} required />
        <Input label="Stock" type="number" placeholder="0" value={stock} onChange={e => setStock(e.target.value)} required hint={stock ? (stockNum < 10 ? '⚠ Low stock' : '✓ OK') : ''} hintType={stock ? (stockNum < 10 ? 'warn' : 'ok') : ''} />
      </div>
      <Input label="SKU Code" placeholder="e.g. CAT-1L" value={sku} onChange={e => setSku(e.target.value)} required />
      <div className="form-footer">
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary"><Icon.plus /> Add Variant</button>
      </div>
    </form>
  );
}

function AddHardwareForm({ initial, onClose, onAdd }) {
  const [name, setName] = useState(initial?.name || ""); const [category, setCategory] = useState(initial?.category || "");
  const [unit, setUnit] = useState(initial?.unit || "pcs"); const [price, setPrice] = useState(initial?.price || "");
  const [stock, setStock] = useState(initial?.stock || ""); const [sku, setSku] = useState(initial?.sku || "");
  const [image, setImage] = useState(initial?.image || "");
  const isEdit = !!initial?.id;
  const handleSubmit = e => { e.preventDefault(); onAdd({ id: initial?.id || Date.now(), name, category, unit, price: Number(price), stock: Number(stock), sku, image }); onClose(); };
  const stockNum = Number(stock);
  const cats = [{ value: '', label: 'Select Category' }, { value: 'Fasteners', label: 'Fasteners' }, { value: 'Rotating', label: 'Rotating' }, { value: 'Lubrication', label: 'Lubrication' }, { value: 'Fittings', label: 'Fittings' }];
  return (
    <form className="form-form" onSubmit={handleSubmit}>
      <Input label="Product Name" placeholder="e.g. M10 Bolt Set" value={name} onChange={e => setName(e.target.value)} required />
      <Select label="Category" value={category} onChange={e => setCategory(e.target.value)} required options={cats} />
      <div className="form-grid">
        <Input label="Price (₹)" type="number" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} required />
        <Input label="Stock" type="number" placeholder="0" value={stock} onChange={e => setStock(e.target.value)} required hint={stock ? (stockNum < 10 ? '⚠ Low stock' : '✓ OK') : ''} hintType={stock ? (stockNum < 10 ? 'warn' : 'ok') : ''} />
      </div>
      <div className="form-grid">
        <Select label="Unit" value={unit} onChange={e => setUnit(e.target.value)} options={[{ value: 'pcs', label: 'Pieces' }, { value: 'kg', label: 'Kilograms' }, { value: 'ltr', label: 'Liters' }, { value: 'set', label: 'Set' }]} />
        <Input label="SKU" placeholder="e.g. BLT-001" value={sku} onChange={e => setSku(e.target.value)} required />
      </div>
      <Input label="Image URL" placeholder="https://..." value={image} onChange={e => setImage(e.target.value)} />
      {image && <div className="img-preview"><img src={image} alt="preview" onError={e => e.target.style.display = 'none'} /></div>}
      <div className="form-footer">
        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">{isEdit ? 'Update Hardware' : <><Icon.plus /> Add Hardware</>}</button>
      </div>
    </form>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function PartsManagement() {

  // ── State: merge dummy + backend ─────────────────────────────────────────
  const [brands, setBrands] = useState(BRANDS.map(b => ({ ...b, _fromDB: false })));
  const [models, setModels] = useState(MODELS.map(m => ({ ...m, _fromDB: false })));
  const [categories, setCategories] = useState(CATEGORIES.map(c => ({ ...c, _fromDB: false })));
  const [parts, setParts] = useState(ALL_PARTS.map(p => ({ ...p, _fromDB: false })));
  const [oilCompanies, setOilCompanies] = useState(OIL_COMPANIES);
  const [oilProducts, setOilProducts] = useState(OIL_PRODUCTS);
  const [hardwareItems, setHardwareItems] = useState(HARDWARE_ITEMS);

  // ── Loading states ────────────────────────────────────────────────────────
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingParts, setLoadingParts] = useState(false);

  // ── Navigation ────────────────────────────────────────────────────────────
  const [view, setView] = useState("brands");
  const [tab, setTab] = useState("parts");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOilCompany, setSelectedOilCompany] = useState(null);
  const [tractorType, setTractorType] = useState("big");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleLsCount, setVisibleLsCount] = useState(12);
  const [modal, setModal] = useState(null);

  // ── Fetch brands from backend on mount ───────────────────────────────────
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoadingBrands(true);
        const res = await getBrands();
        const dbBrands = res.data.data.map(normalizeBrand);
        // Merge: keep dummy data + add DB data (avoid duplicates by name)
        setBrands(prev => {
          const dummyOnly = prev.filter(b => !dbBrands.find(db => db.name.toLowerCase() === b.name.toLowerCase()));
          return [...dummyOnly, ...dbBrands];
        });
      } catch (err) {
        console.warn("Backend unavailable, using dummy data:", err.message);
        // Keep dummy data as fallback
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrands();
  }, []);

  // ── Fetch models when brand selected ─────────────────────────────────────
  useEffect(() => {
    if (!selectedBrand?._fromDB) return; // skip for dummy brands
    const fetchModels = async () => {
      try {
        setLoadingModels(true);
        const res = await getTractorModels({ brand: selectedBrand.id });
        const dbModels = res.data.data.map(normalizeModel);
        setModels(prev => {
          const dummyOnly = prev.filter(m => !dbModels.find(db => db.id === m.id));
          return [...dummyOnly, ...dbModels];
        });
      } catch (err) {
        console.warn("Failed to fetch models:", err.message);
      } finally {
        setLoadingModels(false);
      }
    };
    fetchModels();
  }, [selectedBrand]);

  // ── Fetch categories when model selected ─────────────────────────────────
  useEffect(() => {
    if (!selectedModel?._fromDB) return;
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await getCategories();
        const dbCats = res.data.data.map(normalizeCategory);
        setCategories(prev => {
          const dummyOnly = prev.filter(c => !dbCats.find(db => db.name.toLowerCase() === c.name.toLowerCase()));
          return [...dummyOnly, ...dbCats];
        });
      } catch (err) {
        console.warn("Failed to fetch categories:", err.message);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [selectedModel]);

  // ── Fetch parts when category selected ───────────────────────────────────
  useEffect(() => {
    if (!selectedModel?._fromDB || !selectedCategory?._fromDB) return;
    const fetchParts = async () => {
      try {
        setLoadingParts(true);
        const res = await getParts({ modelId: selectedModel.id, categoryId: selectedCategory.id });
        const dbParts = res.data.data.map(normalizePart);
        setParts(prev => {
          const dummyOnly = prev.filter(p => !dbParts.find(db => db.id === p.id));
          return [...dummyOnly, ...dbParts];
        });
      } catch (err) {
        console.warn("Failed to fetch parts:", err.message);
      } finally {
        setLoadingParts(false);
      }
    };
    fetchParts();
  }, [selectedModel, selectedCategory]);

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openModal = (type, props = {}) => setModal({ type, props });
  const closeModal = () => setModal(null);

  // ── Navigation ────────────────────────────────────────────────────────────
  const goToBrands = () => { setView("brands"); setSelectedBrand(null); setSelectedModel(null); setSelectedCategory(null); setSearchTerm(""); };
  const goToModels = () => { setView("models"); setSelectedModel(null); setSelectedCategory(null); setSearchTerm(""); };
  const goToCategories = () => { setView("categories"); setSelectedCategory(null); setSearchTerm(""); };
  const goBack = () => {
    if (view === "parts") goToCategories();
    else if (view === "categories") goToModels();
    else if (view === "models") goToBrands();
    else if (view === "low-stock") setView("brands");
  };
  const switchTab = t => { setTab(t); setView("brands"); setSelectedBrand(null); setSelectedModel(null); setSelectedCategory(null); setSelectedOilCompany(null); setSearchTerm(""); };

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  const addBrand = b => setBrands(prev => [...prev, b]);
  const addModel = m => setModels(prev => [...prev, m]);
  const addCategory = c => setCategories(prev => [...prev, c]);
  const addPart = p => setParts(prev => [...prev, p]);
  const addOilCompany = c => setOilCompanies(prev => [...prev, c]);
  const addVariant = ({ companyId, productName, size, price, stock, sku }) => {
    const newVariant = { id: Date.now(), size, price, stock, sku, status: "Available" };
    setOilProducts(prev => {
      const existing = prev.find(p => p.companyId === companyId && p.name === productName);
      if (existing) return prev.map(p => p.id === existing.id ? { ...p, variants: [...p.variants, newVariant] } : p);
      return [...prev, { id: Date.now(), companyId, name: productName, variants: [newVariant] }];
    });
  };
  const addHardware = item => setHardwareItems(prev => { const exists = prev.find(h => h.id === item.id); return exists ? prev.map(h => h.id === item.id ? item : h) : [...prev, item]; });
  const deleteHardware = id => { if (window.confirm("Delete this item?")) setHardwareItems(prev => prev.filter(h => h.id !== id)); };

  // ── Filtered data ─────────────────────────────────────────────────────────
  const filteredBrands = useMemo(() => brands.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())), [brands, searchTerm]);
  const filteredModels = useMemo(() => models.filter(m => m.brandId === selectedBrand?.id && m.type === tractorType && m.name.toLowerCase().includes(searchTerm.toLowerCase())), [models, selectedBrand, tractorType, searchTerm]);
  const filteredCategories = useMemo(() => categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())), [categories, searchTerm]);
  const filteredParts = useMemo(() => parts.filter(p => p.modelId === selectedModel?.id && p.categoryId === selectedCategory?.id && p.name.toLowerCase().includes(searchTerm.toLowerCase())), [parts, selectedModel, selectedCategory, searchTerm]);

  // ── Low stock ─────────────────────────────────────────────────────────────
  const lowStockItems = useMemo(() => {
    const items = [];
    parts.filter(p => p.stock < 10).forEach(p => {
      const m = models.find(x => x.id === p.modelId);
      const b = brands.find(x => x.id === m?.brandId);
      const c = categories.find(x => x.id === p.categoryId);
      items.push({ ...p, _type: "part", _key: `part-${p.id}`, _sub: `${b?.name || ''} › ${m?.name || ''}`, _cat: c?.name || '' });
    });
    oilProducts.forEach(prod => {
      const co = oilCompanies.find(c => c.id === prod.companyId);
      prod.variants.filter(v => v.stock < 10).forEach(v => {
        items.push({ ...v, name: prod.name, _type: "oil", _key: `oil-${v.id}`, _sub: co?.name || '', _cat: v.size });
      });
    });
    hardwareItems.filter(h => h.stock < 10).forEach(h => {
      items.push({ ...h, _type: "hardware", _key: `hw-${h.id}`, _sub: h.category, _cat: h.unit });
    });
    return items;
  }, [parts, oilProducts, hardwareItems, models, brands, categories, oilCompanies]);

  // ── Modal render ──────────────────────────────────────────────────────────
  const renderModal = () => {
    if (!modal) return null;
    const { type, props } = modal;
    const titles = { brand: "ADD BRAND", model: "ADD MODEL", category: "ADD CATEGORY", part: "ADD PART", oil: "ADD OIL COMPANY", "oil-variant": "ADD OIL VARIANT", hardware: props?.initial?.id ? "EDIT HARDWARE" : "ADD HARDWARE" };
    return (
      <Modal title={titles[type] || ""} onClose={closeModal}>
        {type === "brand" && <AddBrandForm onClose={closeModal} onAdd={addBrand} />}
        {type === "model" && <AddModelForm brands={brands} initialBrandId={props.initialBrandId} onClose={closeModal} onAdd={addModel} />}
        {type === "category" && <AddCategoryForm onClose={closeModal} onAdd={addCategory} />}
        {type === "part" && <AddPartForm categories={categories} initialModelId={props.initialModelId} initialCategoryId={props.initialCategoryId} onClose={closeModal} onAdd={addPart} />}
        {type === "oil" && <AddOilForm onClose={closeModal} onAdd={addOilCompany} />}
        {type === "oil-variant" && <AddVariantForm companyId={props.companyId} onClose={closeModal} onAdd={addVariant} />}
        {type === "hardware" && <AddHardwareForm initial={props.initial} onClose={closeModal} onAdd={addHardware} />}
      </Modal>
    );
  };

  // ── Header helpers ────────────────────────────────────────────────────────
  const showBack = (tab === "parts" && view !== "brands") || (tab === "oils" && selectedOilCompany) || view === "low-stock";
  const handleBack = () => { if (tab === "oils" && selectedOilCompany) setSelectedOilCompany(null); else goBack(); };

  const renderBreadcrumbs = () => {
    if (tab === "oils") return (
      <div className="breadcrumbs">
        <span className={`crumb ${!selectedOilCompany ? 'active' : ''}`} onClick={() => setSelectedOilCompany(null)}>Oils</span>
        {selectedOilCompany && <><span className="sep">›</span><span className="crumb active">{selectedOilCompany.name}</span></>}
      </div>
    );
    if (tab === "hardware") return <div className="breadcrumbs"><span className="crumb active">Hardware</span></div>;
    return (
      <div className="breadcrumbs">
        <span className={`crumb ${view === 'brands' ? 'active' : ''}`} onClick={goToBrands}>All Brands</span>
        {selectedBrand && <><span className="sep">›</span><span className={`crumb ${view === 'models' ? 'active' : ''}`} onClick={goToModels}>{selectedBrand.name}</span></>}
        {selectedModel && <><span className="sep">›</span><span className={`crumb ${view === 'categories' ? 'active' : ''}`} onClick={goToCategories}>{selectedModel.name}</span></>}
        {selectedCategory && <><span className="sep">›</span><span className="crumb active">{selectedCategory.name}</span></>}
      </div>
    );
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="pm-root">

        {/* HEADER */}
        <div className="pm-header">
          <div className="pm-header-left">
            {showBack && <button className="back-btn" onClick={handleBack}><Icon.back /></button>}
            {renderBreadcrumbs()}
          </div>
          <div className="pm-header-right">
            <div className="search-wrap">
              <Icon.search />
              <input className="search-input" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button className={`btn btn-tab ${tab === 'parts' ? 'active' : ''}`} onClick={() => switchTab("parts")}>🚜 Tractor Parts</button>
            <button className={`btn btn-tab ${tab === 'oils' ? 'active' : ''}`} onClick={() => switchTab("oils")}>🛢 Oils</button>
            <button className={`btn btn-tab ${tab === 'hardware' ? 'active' : ''}`} onClick={() => switchTab("hardware")}>🔩 Hardware</button>
            <button className={`btn btn-tab ${view === 'low-stock' ? 'active' : ''}`}
              onClick={() => { setTab('parts'); setView('low-stock'); setSearchTerm(''); }}
              style={{ borderColor: view === 'low-stock' ? 'var(--danger)' : '', color: view === 'low-stock' ? 'var(--danger)' : '', background: view === 'low-stock' ? 'var(--danger-dim)' : '' }}>
              ⚠ Low Stock <span style={{ background: 'var(--danger)', color: 'white', borderRadius: '12px', padding: '1px 6px', fontSize: '11px', marginLeft: 2 }}>{lowStockItems.length}</span>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="pm-content anim-fade" key={`${tab}-${view}-${selectedBrand?.id}-${selectedModel?.id}-${selectedCategory?.id}-${selectedOilCompany?.id}`}>

          {/* LOW STOCK */}
          {view === "low-stock" && (
            <>
              <div className="section-hdr">
                <div className="section-hdr-left"><h2 className="section-title">LOW STOCK</h2><span className="section-count">{lowStockItems.length} items</span></div>
              </div>
              {lowStockItems.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">✅</div><h3>All stocked up!</h3><p>No items below minimum stock threshold.</p></div>
              ) : (
                <>
                  <div className="low-stock-grid">
                    {lowStockItems.slice(0, visibleLsCount).map(item => (
                      <div key={item._key} className="ls-card">
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <div className="ls-icon">{item._type === 'part' ? '⚙️' : item._type === 'oil' ? '🛢' : '🔩'}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="ls-name">{item.name} {item._cat && item._type !== 'part' ? `(${item._cat})` : ''}</div>
                            <div className="ls-sub">{item._sub}</div>
                          </div>
                        </div>
                        <div className="ls-meta">
                          <span className="price-tag">₹{item.price}</span>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <span className="stock-badge stock-low">{item.stock} left</span>
                            <span className={`ls-type-badge ls-type-${item._type === 'hardware' ? 'hw' : item._type}`}>{item._type}</span>
                          </div>
                        </div>
                        <button className="add-to-cart-btn">+ Add to Cart</button>
                      </div>
                    ))}
                  </div>
                  {visibleLsCount < lowStockItems.length && (
                    <div className="load-more-wrap">
                      <button className="btn btn-outline" onClick={() => setVisibleLsCount(n => n + 12)}>View More ({lowStockItems.length - visibleLsCount} remaining)</button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* OILS */}
          {tab === "oils" && view !== "low-stock" && (
            <>
              {!selectedOilCompany ? (
                <>
                  <div className="section-hdr">
                    <div className="section-hdr-left"><h2 className="section-title">OIL BRANDS</h2><span className="section-count">{oilCompanies.length}</span></div>
                    <div className="section-hdr-right"><button className="btn btn-outline" onClick={() => openModal("oil")}><Icon.plus /> Add Company</button></div>
                  </div>
                  <div className="oils-grid">
                    {oilCompanies.map(c => (
                      <div key={c.id} className="oil-company-card" onClick={() => setSelectedOilCompany(c)}>
                        <div className="oil-company-card-img"><img src={c.image} alt={c.name} onError={e => e.target.style.display = 'none'} /></div>
                        <div className="oil-company-card-name">{c.name}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="section-hdr">
                    <div className="section-hdr-left"><h2 className="section-title">{selectedOilCompany.name} PRODUCTS</h2></div>
                    <div className="section-hdr-right"><button className="btn btn-outline" onClick={() => openModal("oil-variant", { companyId: selectedOilCompany.id })}><Icon.plus /> Add Variant</button></div>
                  </div>
                  {oilProducts.filter(p => p.companyId === selectedOilCompany.id).length === 0 ? (
                    <div className="empty-state"><div className="empty-icon">🛢</div><h3>No products yet</h3></div>
                  ) : (
                    <div className="oil-variant-grid">
                      {oilProducts.filter(p => p.companyId === selectedOilCompany.id).flatMap(prod =>
                        prod.variants.map(v => (
                          <div key={v.id} className="oil-variant-card">
                            <div className="ovc-name">{prod.name} <span style={{ color: 'var(--primary)', fontSize: 12 }}>({v.size})</span></div>
                            <div className="ovc-row"><span>₹{v.price}</span><span className={`stock-badge ${v.stock < 10 ? 'stock-low' : 'stock-ok'}`}>{v.stock} in stock</span></div>
                            <div className="ovc-row"><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v.sku}</span><span style={{ fontSize: 11, color: 'var(--success)' }}>{v.status}</span></div>
                            <button className="add-to-cart-btn" style={{ marginTop: 8 }}>+ Add to Cart</button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* HARDWARE */}
          {tab === "hardware" && view !== "low-stock" && (
            <>
              <div className="section-hdr">
                <div className="section-hdr-left"><h2 className="section-title">HARDWARE</h2><span className="section-count">{hardwareItems.length}</span></div>
                <div className="section-hdr-right"><button className="btn btn-outline" onClick={() => openModal("hardware", {})}><Icon.plus /> Add Hardware</button></div>
              </div>
              {hardwareItems.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">🔩</div><h3>No hardware items</h3></div>
              ) : (
                <div className="hw-grid">
                  {hardwareItems.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                    <div key={item.id} className="hw-card">
                      <div className="hw-img">{item.image ? <img src={item.image} alt={item.name} onError={e => e.target.style.display = 'none'} /> : '🔩'}</div>
                      <div className="hw-body">
                        <div className="hw-name">{item.name}</div>
                        <div className="hw-meta"><span>{item.category}</span><span>{item.unit}</span></div>
                        <div className="hw-meta"><span style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{item.price}</span><span className={`stock-badge ${item.stock < 10 ? 'stock-low' : 'stock-ok'}`}>{item.stock} in stock</span></div>
                        {item.sku && <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'monospace', marginTop: 2 }}>SKU: {item.sku}</div>}
                        <div className="hw-actions">
                          <button className="btn btn-outline btn-sm" onClick={() => openModal("hardware", { initial: item })}><Icon.edit /> Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteHardware(item.id)}><Icon.trash /> Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* TRACTOR PARTS */}
          {tab === "parts" && view !== "low-stock" && (
            <>
              {/* BRANDS */}
              {view === "brands" && (
                <>
                  <div className="section-hdr">
                    <div className="section-hdr-left">
                      <h2 className="section-title">SELECT BRAND</h2>
                      <span className="section-count">{filteredBrands.length}</span>
                    </div>
                    <div className="section-hdr-right">
                      <button className="btn btn-outline" onClick={() => openModal("brand")}><Icon.plus /> Add Brand</button>
                    </div>
                  </div>
                  {loadingBrands ? (
                    <div className="loading-wrap"><div className="spinner" /> Loading brands...</div>
                  ) : filteredBrands.length === 0 ? (
                    <div className="empty-state"><div className="empty-icon">🏭</div><h3>No brands found</h3></div>
                  ) : (
                    <div className="brand-grid">
                      {filteredBrands.map(b => (
                        <div key={b.id} className="brand-card" onClick={() => { setSelectedBrand(b); setView("models"); setSearchTerm(""); }}>
                          <div className="brand-card-img">
                            <img src={b.image} alt={b.name} onError={e => e.target.style.display = 'none'} />
                            {b._fromDB && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, background: 'var(--success-dim)', color: 'var(--success)', padding: '2px 6px', borderRadius: 10, fontWeight: 600 }}>DB</span>}
                          </div>
                          <div className="brand-card-info">
                            <h3>{b.name}</h3>
                            <div className="brand-card-arrow"><Icon.chevron /></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* MODELS */}
              {view === "models" && selectedBrand && (
                <>
                  <div className="section-hdr">
                    <div className="section-hdr-left"><h2 className="section-title">{selectedBrand.name.toUpperCase()} MODELS</h2><span className="section-count">{filteredModels.length}</span></div>
                    <div className="section-hdr-right">
                      <button className={`btn btn-tab ${tractorType === 'big' ? 'active' : ''}`} onClick={() => setTractorType("big")}>Big</button>
                      <button className={`btn btn-tab ${tractorType === 'medium' ? 'active' : ''}`} onClick={() => setTractorType("medium")}>Medium</button>
                      <button className={`btn btn-tab ${tractorType === 'mini' ? 'active' : ''}`} onClick={() => setTractorType("mini")}>Mini</button>
                      <button className="btn btn-outline" onClick={() => openModal("model", { initialBrandId: selectedBrand.id })}><Icon.plus /> Add Model</button>
                    </div>
                  </div>
                  {loadingModels ? (
                    <div className="loading-wrap"><div className="spinner" /> Loading models...</div>
                  ) : filteredModels.length === 0 ? (
                    <div className="empty-state"><div className="empty-icon">🚜</div><h3>No models found</h3><p>No {tractorType} tractors for {selectedBrand.name}.</p></div>
                  ) : (
                    <div className="model-grid">
                      {filteredModels.map(m => (
                        <div key={m.id} className="model-card" onClick={() => { setSelectedModel(m); setView("categories"); setSearchTerm(""); }}>
                          <div className="model-card-img">
                            <img src={m.image} alt={m.name} onError={e => { e.target.style.objectFit = 'contain'; e.target.style.padding = '10px'; }} />
                            <div className="model-card-overlay"><span>View Parts →</span></div>
                          </div>
                          <div className="model-card-info"><h3>{m.name}</h3><div className="brand-card-arrow"><Icon.chevron /></div></div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* CATEGORIES */}
              {view === "categories" && selectedModel && (
                <>
                  <div className="section-hdr">
                    <div className="section-hdr-left"><h2 className="section-title">CATEGORIES</h2><span className="section-count">{filteredCategories.length}</span></div>
                    <div className="section-hdr-right"><button className="btn btn-outline" onClick={() => openModal("category")}><Icon.plus /> Add Category</button></div>
                  </div>
                  {loadingCategories ? (
                    <div className="loading-wrap"><div className="spinner" /> Loading categories...</div>
                  ) : (
                    <div className="cat-grid">
                      {filteredCategories.map(c => (
                        <div key={c.id} className="cat-card" onClick={() => { setSelectedCategory(c); setView("parts"); setSearchTerm(""); }}>
                          <div className="cat-icon">{c.icon}</div>
                          <h3>{c.name}</h3>
                          <span className="cat-badge">{parts.filter(p => p.modelId === selectedModel.id && p.categoryId === c.id).length} parts</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* PARTS */}
              {view === "parts" && selectedModel && selectedCategory && (
                <>
                  <div className="section-hdr">
                    <div className="section-hdr-left">
                      <h2 className="section-title">{selectedCategory.icon} {selectedCategory.name.toUpperCase()}</h2>
                      <span className="section-count">{filteredParts.length} parts</span>
                    </div>
                    <div className="section-hdr-right">
                      <button className="btn btn-outline" onClick={() => openModal("part", { initialModelId: selectedModel.id, initialCategoryId: selectedCategory.id })}><Icon.plus /> Add Part</button>
                    </div>
                  </div>
                  {loadingParts ? (
                    <div className="loading-wrap"><div className="spinner" /> Loading parts...</div>
                  ) : filteredParts.length === 0 ? (
                    <div className="empty-state"><div className="empty-icon">📦</div><h3>No parts found</h3><p>No parts in this category for {selectedModel.name}.</p></div>
                  ) : (
                    <div className="parts-grid">
                      {filteredParts.map(p => (
                        <div key={p.id} className="part-card">
                          <div className="part-card-img"><Icon.pkg /></div>
                          <div className="part-card-body">
                            <h4>{p.name}</h4>
                            <div className="part-id">#{String(p.id).slice(-4).padStart(4, '0')}</div>
                            <div className="part-meta">
                              <span className="price-tag">₹{p.price}</span>
                              <span className={`stock-badge ${p.stock < 10 ? 'stock-low' : 'stock-ok'}`}>{p.stock} in stock</span>
                            </div>
                          </div>
                          <button className="add-to-cart-btn">+ Add to Cart</button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {renderModal()}
      </div>
    </>
  );
}