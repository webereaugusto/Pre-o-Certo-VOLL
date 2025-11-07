
import React from 'react';
import { InfoIcon } from './icons';

interface InputFieldProps {
  label: string;
  id: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tooltip?: string;
  isCurrency?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, value, onChange, tooltip, isCurrency = true }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-300 mb-2">
        {label}
        {tooltip && (
          <span className="ml-2 group relative">
            <InfoIcon className="w-4 h-4 text-gray-400" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <div className="relative">
        {isCurrency && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">R$</span>}
        <input
          type="number"
          id={id}
          name={id}
          value={value === 0 ? '' : value}
          onChange={onChange}
          placeholder="0"
          className={`w-full bg-gray-900/50 border border-gray-600 rounded-lg py-2 ${isCurrency ? 'pl-9' : 'pl-3'} pr-3 text-white focus:ring-teal-500 focus:border-teal-500 transition`}
        />
      </div>
    </div>
  );
};

export default InputField;