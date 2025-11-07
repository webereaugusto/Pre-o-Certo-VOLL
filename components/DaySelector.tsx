
import React from 'react';
import { PricingInputs } from '../types';

type Day = keyof PricingInputs['capacity']['workingDays'];

interface DaySelectorProps {
  workingDays: PricingInputs['capacity']['workingDays'];
  onDayToggle: (day: Day) => void;
}

const days: { key: Day; label: string }[] = [
  { key: 'mon', label: 'S' },
  { key: 'tue', label: 'T' },
  { key: 'wed', label: 'Q' },
  { key: 'thu', label: 'Q' },
  { key: 'fri', label: 'S' },
  { key: 'sat', label: 'S' },
];

const fullDayNames: { [key in Day]: string } = {
  mon: 'Segunda',
  tue: 'Terça',
  wed: 'Quarta',
  thu: 'Quinta',
  fri: 'Sexta',
  sat: 'Sábado',
}

const DaySelector: React.FC<DaySelectorProps> = ({ workingDays, onDayToggle }) => {
  return (
    <div className="mb-4">
        <label className="text-sm font-medium text-gray-300 mb-2 block">Dias de Trabalho na Semana</label>
        <div className="flex items-center space-x-2">
        {days.map(({ key, label }) => (
            <div key={key} className="flex-1">
                <input
                    type="checkbox"
                    id={key}
                    name={key}
                    checked={workingDays[key]}
                    onChange={() => onDayToggle(key)}
                    className="sr-only peer"
                />
                <label
                    htmlFor={key}
                    title={fullDayNames[key]}
                    className="flex items-center justify-center w-full h-10 p-2 text-gray-300 bg-gray-900/50 border-2 border-gray-600 rounded-lg cursor-pointer peer-checked:border-teal-500 peer-checked:bg-teal-900/50 peer-checked:text-teal-300 hover:text-gray-200 hover:bg-gray-800/50 transition-all duration-200"
                >
                    <div className="text-sm font-semibold">{label}</div>
                </label>
            </div>
        ))}
        </div>
    </div>
  );
};

export default DaySelector;
