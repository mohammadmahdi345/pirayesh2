import React, { useState, useRef, useEffect } from "react";

const CustomSelect = ({ options = [], value, onChange, placeholder = "انتخاب کنید", renderOptionLabel }) => {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const ref = useRef();

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!open) setHighlight(-1);
  }, [open]);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight(h => Math.min(h + 1, options.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight(h => Math.max(h - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlight >= 0 && options[highlight]) {
          onChange(options[highlight].value);
          setOpen(false);
        }
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, highlight, options, onChange]);

  const selected = options.find(o => String(o.value) === String(value));

  return (
    <div className={`custom-select ${open ? "open" : ""}`} ref={ref}>
      <button
        type="button"
        className="custom-select-btn"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="custom-select-value">
          {selected ? (renderOptionLabel ? renderOptionLabel(selected) : selected.label) : placeholder}
        </span>
        <span className="custom-select-caret" aria-hidden>▾</span>
      </button>

      <ul className="custom-select-list" role="listbox" tabIndex={-1} aria-hidden={!open}>
        {options.map((opt, i) => (
          <li
            key={opt.value ?? i}
            role="option"
            aria-selected={String(opt.value) === String(value)}
            className={`custom-select-option ${i === highlight ? "highlight" : ""} ${String(opt.value) === String(value) ? "selected" : ""}`}
            onMouseEnter={() => setHighlight(i)}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
          >
            {renderOptionLabel ? renderOptionLabel(opt) : <span className="label">{opt.label}</span>}
            {String(opt.value) === String(value) && <span className="tick">✓</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomSelect;
