import { SelectHTMLAttributes, forwardRef } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

const Select = forwardRef<HTMLSelectElement, Props>(({ label, error, className = "", children, ...props }, ref) => {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-ink-900">{label}</span>}
      <select
        ref={ref}
        className={`w-full rounded-sm border border-ink-900/20 bg-linen-50 px-3 py-2 text-sm text-ink-900 focus:border-indigo-500 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-weft-600">{error}</span>}
    </label>
  );
});
Select.displayName = "Select";

export default Select;
