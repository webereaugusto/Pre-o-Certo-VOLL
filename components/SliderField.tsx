
import React from 'react';
import { InfoIcon } from './icons';

interface SliderFieldProps {
  label: string;
  id: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
  unit?: string;
}

const SliderField: React.FC<SliderFieldProps> = ({ label, id, value, onChange, min = 0, max = 100, step = 1, tooltip, unit = '%' }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="flex justify-between items-center text-sm font-medium text-gray-300 mb-2">
         <span className="flex items-center">
            {label}
            {tooltip && (
              <span className="ml-2 group relative">
                <InfoIcon className="w-4 h-4 text-gray-400" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {tooltip}
                </span>
              </span>
            )}
        </span>
        <span className="text-teal-400 font-semibold">{value}{unit}</span>
      </label>
      <input
        type="range"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
      />
    </div>
  );
};

export default SliderField;