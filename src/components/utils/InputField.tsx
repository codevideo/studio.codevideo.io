import * as React from 'react';

// Common Input Component
interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isTextarea?: boolean;
  required?: boolean;
}

export const InputField = (props: InputFieldProps) => {
    const { label, id, value, onChange, placeholder = '', isTextarea = false, required = false } = props;
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full px-3 py-2 bg-white dark:bg-emerald-800 border border-emerald-300 dark:border-emerald-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
      ) : (
        <input
          type="text"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full px-3 py-2 bg-white dark:bg-emerald-800 border border-emerald-300 dark:border-emerald-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      )}
    </div>
  );
};