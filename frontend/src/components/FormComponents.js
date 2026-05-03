import React, { useState } from 'react';

/**
 * InputField Component
 * Reusable input field with validation and error display
 */
export const InputField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`w-full px-4 py-2 rounded border-2 transition-all duration-200 focus:outline-none ${
          error
            ? 'border-red-500 focus:border-red-600'
            : isFocused
            ? 'border-blue-500'
            : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <span className="mr-1">⚠️</span> {error}
        </p>
      )}
    </div>
  );
};

/**
 * SubmitButton Component
 * Reusable submit button with loading state
 */
export const SubmitButton = ({ text, loading = false, disabled = false }) => {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={`w-full py-2 px-4 rounded font-semibold text-white transition-all duration-200 flex items-center justify-center ${
        loading || disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
      }`}
    >
      {loading && <div className="loader mr-2" style={{ width: '20px', height: '20px' }}></div>}
      {text}
    </button>
  );
};

/**
 * AlertMessage Component
 * Display success or error messages
 */
export const AlertMessage = ({ type = 'error', message, onClose }) => {
  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-100' : 'bg-green-100';
  const textColor = isError ? 'text-red-700' : 'text-green-700';
  const borderColor = isError ? 'border-red-400' : 'border-green-400';
  const icon = isError ? '❌' : '✅';

  return (
    <div
      className={`${bgColor} border-l-4 ${borderColor} ${textColor} p-4 mb-4 rounded flex justify-between items-start`}
    >
      <div className="flex items-start">
        <span className="mr-2">{icon}</span>
        <div>{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 ml-4"
        >
          ✕
        </button>
      )}
    </div>
  );
};
