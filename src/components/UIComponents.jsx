import React, { useState } from 'react';
import { CheckCircle, XCircle, Info, ChevronDown, X, Loader } from 'lucide-react';
import { useAppContext } from "../hooks/AppContext";

// ===== FORM COMPONENTS =====
export function Badge({ s }) {
  const m = { scheduled:'bdg-sch', completed:'bdg-com', cancelled:'bdg-can', pending:'bdg-pen' };
  const l = { scheduled:'Scheduled', completed:'Completed', cancelled:'Cancelled', pending:'Pending' };
  return <span className={`bdg ${m[s]||'bdg-sch'}`}>{l[s]||s}</span>;
}

export function FG({ label, req, err, children, span }) {
  return (
    <div className="fgp" style={span?{gridColumn:'1/-1'}:{}}>
      {label && <label className="fl">{label}{req&&<span>*</span>}</label>}
      {children}
      {err && <span className="ferr">{err}</span>}
    </div>
  );
}

export function Input({ label, req, err, span, ...p }) {
  return <FG label={label} req={req} err={err} span={span}><input className={`fi${err?' err':''}`} {...p}/></FG>;
}

export function Sel({ label, req, err, span, children, ...p }) {
  return <FG label={label} req={req} err={err} span={span}><select className={`fsl${err?' err':''}`} {...p}>{children}</select></FG>;
}

export function Area({ label, span, ...p }) {
  return <FG label={label} span={span}><textarea className="fta" {...p}/></FG>;
}

export function SecTitle({ ic, children }) {
  return <div className="sec-t"><span className="sec-d"/>{ic&&<span style={{color:'var(--t)'}} className="flex">{ic}</span>}{children}</div>;
}

// ===== DROPDOWN/COMBOBOX =====
export function Dropdown({ label, req, value, onChange, options, searchable = false, err, span }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = searchable
    ? options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <FG label={label} req={req} err={err} span={span}>
      <div className="dd-wrapper" style={{position: 'relative'}}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`dd-trigger ${err ? 'err' : ''}`}
          style={{
            width: '100%',
            padding: '8px 11px',
            border: `1.5px solid var(--bd)`,
            borderRadius: 'var(--rs)',
            background: 'var(--wh)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            fontSize: 13
          }}
        >
          <span>{selectedOption?.label || 'Select...'}</span>
          <ChevronDown size={16} style={{opacity: 0.5}} />
        </button>

        {open && (
          <div className="dd" style={{
            position: 'absolute',
            top: '100%',
            width: '100%',
            marginTop: 6,
            zIndex: 50
          }}>
            {searchable && (
              <input
                type="text"
                placeholder="Search..."
                value={search}
                autoFocus
                onFocus={() => setOpen(true)}
                onChange={(e) => setSearch(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  padding: '8px 11px',
                  border: 'none',
                  borderBottom: '1px solid var(--bd)',
                  fontSize: 13,
                  outline: 'none'
                }}
              />
            )}
            {filteredOptions.length === 0 ? (
              <div style={{padding: '12px 11px', fontSize: 13, color: 'var(--t3)'}}>
                No options found
              </div>
            ) : (
              filteredOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`psi ${opt.value === value ? 'on' : ''}`}
                  onClick={() => {
                    onChange({ target: { value: opt.value } });
                    setOpen(false);
                    setSearch('');
                  }}
                >
                  {opt.icon && <span style={{display: 'flex'}}>{opt.icon}</span>}
                  {opt.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </FG>
  );
}

// ===== SKELETON LOADERS =====
export function SkeletonLine({ width = '100%', height = 16, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius: 'var(--rs)',
        marginBottom: 8,
        ...style
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--wh)',
      borderRadius: 'var(--rl)',
      border: '1px solid var(--bd)',
      padding: 20,
      marginBottom: 14
    }}>
      <SkeletonLine width="60%" />
      <SkeletonLine width="100%" style={{height: 12, marginBottom: 14}} />
      <SkeletonLine width="80%" style={{height: 12, marginBottom: 14}} />
      <div style={{display: 'flex', gap: 10, marginTop: 14}}>
        <SkeletonLine width="80px" style={{height: 32}} />
        <SkeletonLine width="80px" style={{height: 32}} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="tbl-w">
      <table>
        <thead>
          <tr>
            <th><SkeletonLine width="80px" /></th>
            <th><SkeletonLine width="100px" /></th>
            <th><SkeletonLine width="100px" /></th>
            <th><SkeletonLine width="60px" /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({length: rows}).map((_, i) => (
            <tr key={i}>
              <td><SkeletonLine width="80px" /></td>
              <td><SkeletonLine width="100px" /></td>
              <td><SkeletonLine width="100px" /></td>
              <td><SkeletonLine width="60px" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonAppointment() {
  return (
    <div className="ac" style={{pointerEvents: 'none'}}>
      <div className="at-b">
        <SkeletonLine width="50px" style={{height: 14}} />
      </div>
      <div className="a-inf" style={{flex: 1}}>
        <SkeletonLine width="60%" style={{height: 14, marginBottom: 8}} />
        <SkeletonLine width="80%" style={{height: 12}} />
      </div>
    </div>
  );
}

// ===== EMPTY STATE =====
export function EmptyState({ icon: Icon, title, message, actionText, onAction }) {
  return (
    <div className="empty-state">
      {Icon && <div className="empty-icon"><Icon size={24}/></div>}
      <h3 style={{fontSize: 15, fontWeight: 700, color: 'var(--tx)', marginBottom: 8}}>{title}</h3>
      <p style={{fontSize: 13, color: 'var(--t2)', marginBottom: 20, maxWidth: 300}}>{message}</p>
      {actionText && onAction && (
        <button className="btn btn-p" onClick={onAction}>{actionText}</button>
      )}
    </div>
  );
}

// ===== TOAST SYSTEM =====
export function Toaster() {
  const { toasts, removeToast } = useAppContext();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`} onClick={() => removeToast(t.id)}>
          {t.type === 'success' ? <CheckCircle size={16} color="var(--ok)" /> :
           t.type === 'error' ? <XCircle size={16} color="var(--er)" /> :
           <Info size={16} color="var(--inf)" />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ===== MODAL/DIALOG =====
export function Modal({ open, onClose, title, children, actions }) {
  if (!open) return null;

  return (
    <div className="ov" onClick={onClose}>
      <div className="md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <div className="md-t">{title}</div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: 'var(--t2)'
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div>{children}</div>
        {actions && (
          <div className="flex gap-2 justify-end mt-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== LOADING SPINNER =====
export function LoadingSpinner({ size = 24, message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3" style={{ color: 'var(--t2)' }}>
      <div style={{animation: 'spin 1s linear infinite'}} >
        <Loader size={size} color="var(--t)" />
      </div>
      {message && <p style={{fontSize: 13}}>{message}</p>}
    </div>
  );
}

// ===== STATUS BADGE =====
export function StatusBadge({ status, label }) {
  const statusMap = {
    active: { bg: 'var(--okbg)', color: 'var(--ok)' },
    inactive: { bg: '#f3f4f6', color: '#6b7280' },
    pending: { bg: 'var(--wnbg)', color: 'var(--wn)' },
    available: { bg: 'var(--okbg)', color: 'var(--ok)' },
    unavailable: { bg: 'var(--erbg)', color: 'var(--er)' }
  };

  const style = statusMap[status] || statusMap.inactive;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      background: style.bg,
      color: style.color
    }}>
      <span style={{width: 6, height: 6, borderRadius: '50%', background: style.color}} />
      {label || status}
    </span>
  );
}

// ===== CHIP INPUT =====
export function ChipInput({ label, value = [], onChange, placeholder = 'Type and press Enter' }) {
  const [input, setInput] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      onChange([...value, input.trim()]);
      setInput('');
    }
  };

  const removeChip = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <FG label={label}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        padding: 6,
        border: '1.5px solid var(--bd)',
        borderRadius: 'var(--rs)',
        background: 'var(--wh)',
        minHeight: 40
      }}>
        {value.map((chip, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            background: 'var(--bg)',
            borderRadius: 'var(--rs)',
            fontSize: 13
          }}>
            {chip}
            <button
              type="button"
              onClick={() => removeChip(i)}
              style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          style={{
            flex: 1,
            minWidth: 100,
            border: 'none',
            outline: 'none',
            fontSize: 13,
            background: 'transparent'
          }}
        />
      </div>
    </FG>
  );
}

// ===== CONFIRMATION DIALOG =====
export function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      actions={[
        <button key="cancel" className="btn btn-s sm" onClick={onCancel}>{cancelText}</button>,
        <button
          key="confirm"
          className={`btn ${isDangerous ? 'btn-d' : 'btn-p'} sm`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      ]}
    >
      <p style={{fontSize: 13, color: 'var(--t2)', lineHeight: 1.6}}>{message}</p>
    </Modal>
  );
}

// ===== INFO CARD =====
export function InfoCard({ title, value, icon: Icon, color = 'var(--t)', subtitle }) {
  return (
    <div className="sc">
      {Icon && (
        <div className="s-ic" style={{background: `${color}22`, color}}>
          <Icon size={20} />
        </div>
      )}
      <div className="sl">{title}</div>
      <div className="sv" style={{color}}>{value}</div>
      {subtitle && <div className="sch">{subtitle}</div>}
    </div>
  );
}

