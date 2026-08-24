import { TextareaHTMLAttributes, forwardRef } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

const TextArea = forwardRef<HTMLTextAreaElement, Props>(({ label, error, className = "", ...props }, ref) => {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-ink-900">{label}</span>}
      <textarea
        ref={ref}
        className={`w-full rounded-sm border border-ink-900/20 bg-linen-50 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-900/40 focus:border-indigo-500 ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-weft-600">{error}</span>}
    </label>
  );
});
TextArea.displayName = "TextArea";

export default TextArea;
