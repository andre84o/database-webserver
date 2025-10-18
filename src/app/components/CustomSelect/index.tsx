"use client"

import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

type Props = {
  name: string;
  defaultValue?: string | null;
  options?: Option[];
  children?: React.ReactNode;
  className?: string;
};

export default function CustomSelect({ name, defaultValue, options, children, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [value, setValue] = useState<string>(defaultValue ?? "");
  const [highlight, setHighlight] = useState<number>(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const opts: Option[] = options ?? (children ? Array.from((children as any)).map((c: any) => ({ value: c.props.value ?? c.props.children, label: String(c.props.children) })) : []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (!rootRef.current) return;
    const dropdownEstimate = 9 * 16;
    const rect = rootRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    if (spaceBelow < dropdownEstimate && spaceAbove > spaceBelow) {
      setOpenUp(true);
    } else {
      setOpenUp(false);
    }
  }, [open]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[highlight] as HTMLElement | undefined;
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [highlight]);

  const onKey = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (e.key === 'Escape') return setOpen(false);
    if (e.key === 'ArrowDown') setHighlight((h) => Math.min(h + 1, opts.length - 1));
    if (e.key === 'ArrowUp') setHighlight((h) => Math.max(h - 1, 0));
    if (e.key === 'Enter') {
      const opt = opts[highlight];
      if (opt) {
        setValue(opt.value);
        setOpen(false);
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={onKey}
        className={`w-full text-left border border-gray-200 rounded-lg px-3 py-2 bg-white flex items-center justify-between ${open ? 'shadow-lg' : ''}`}
      >
        <span className="truncate">{opts.find((o) => o.value === value)?.label ?? 'Select a category'}</span>
        <svg className={`h-4 w-4 text-neutral-600 transition-transform ${open ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-label="select options"
          tabIndex={-1}
          className={`${openUp ? 'absolute left-0 right-0 bottom-full mb-2' : 'absolute left-0 right-0 mt-2'} bg-white border rounded-md z-50 max-h-[9rem] overflow-auto`}
        >
          {opts.map((o, i) => (
            <div
              key={o.value + i}
              role="option"
              aria-selected={value === o.value}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onClick={() => {
                setValue(o.value);
                setOpen(false);
                const btn = rootRef.current?.querySelector('button') as HTMLButtonElement | null;
                if (btn) btn.focus();
              }}
              onMouseEnter={() => setHighlight(i)}
              className={`px-3 py-2 cursor-pointer ${i === highlight ? 'bg-slate-100' : ''}`}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
