import { clsx } from "clsx";
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium mb-2 text-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            "w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:border-primary transition-colors",
            error ? "border-error focus:border-error" : "border-card",
            className,
          )}
          {...props}
        />
        {error && <p className="text-error text-sm mt-1">{error}</p>}
        {helperText && <p className="text-text-secondary text-sm mt-1">{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
