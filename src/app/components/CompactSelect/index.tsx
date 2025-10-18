"use client"

import { useRef, useState } from "react";

type Props = {
  name: string;
  defaultValue?: string | null;
  className?: string;
  children: React.ReactNode;
};

export default function CompactSelect({ name, defaultValue, className = "", children }: Props) {
  const ref = useRef<HTMLSelectElement | null>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`relative ${expanded ? 'shadow-lg rounded-lg' : ''}`}>
      <select
        ref={ref}
        name={name}
        defaultValue={defaultValue ?? ""}
        aria-label={name}
        className={`${className} w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-base pr-10`}
        onFocus={() => {
          try {
            if (ref.current) ref.current.size = 3;
            setExpanded(true);
          } catch (e) {}
        }}
        onBlur={() => {
          try {
            if (ref.current) ref.current.size = 1;
            setExpanded(false);
          } catch (e) {}
        }}
      >
        {children}
      </select>

      {/* Chevron icon */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg className={`h-4 w-4 text-neutral-600 transition-transform ${expanded ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
