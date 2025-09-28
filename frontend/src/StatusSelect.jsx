// StatusSelect.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * Props:
 * - value: current value
 * - onChange: fn(value)
 * - options: [{value,label},...]
 * - placeholder: string
 */
const StatusSelect = ({ value, onChange, options = [], placeholder = "" }) => {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const ref = useRef();

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  useEffect(() => {
    if (open) setHighlight(-1);
  }, [open]);

  const toggle = () => setOpen((s) => !s);
  const pick = (opt) => {
    onChange(opt.value);
    setOpen(false);
  };

  const onKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open) {
        const opt = options[highlight] || options[0];
        if (opt) pick(opt);
      } else {
        setOpen(true);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="status-select-wrapper" ref={ref}>
      <button
        type="button"
        className="reserv-cancell enhanced-select custom-select"
        onClick={toggle}
        onKeyDown={onKey}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="select-label">{selected ? selected.label : placeholder}</span>
        <span className={`select-arrow ${open ? "open" : ""}`} aria-hidden>▾</span>
      </button>

      {open && (
        <ul className="custom-dropdown" role="listbox" tabIndex={-1}>
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              className={`custom-option ${value === opt.value ? "selected" : ""} ${highlight === idx ? "highlight" : ""}`}
              onMouseEnter={() => setHighlight(idx)}
              onClick={() => pick(opt)}
            >
              <span className="opt-label">{opt.label}</span>
              {value === opt.value && <span className="opt-check">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StatusSelect;
