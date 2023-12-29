import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditableField = ({ label, value, onChange, isDateField }) => {
  const isMultiLine = Array.isArray(value);

  return (
    <div className={`mb-4 relative flex-grow ${isMultiLine ? 'h-24' : ''}`}>
      <label htmlFor={label.toLowerCase()} className="block font-bold mb-1">
        {label}
      </label>
      <div className="relative">
        {isDateField ? (
          <DatePicker
            id={label.toLowerCase()}
            className="w-full border p-2 pr-8 text-base sm:text-lg"
            selected={value}
            onChange={(date) => onChange(date)}
          />
        ) : isMultiLine ? (
          <textarea
            id={label.toLowerCase()}
            className="w-full border p-2 pr-8 text-base sm:text-lg"
            value={value.join('\n')}
            onChange={(e) => onChange(e.target.value.split('\n'))}
          />
        ) : (
          <textarea
            id={label.toLowerCase()}
            className="w-full border p-2 pr-8 text-base sm:text-lg min-h-[2em] h-auto resize-none overflow-y-auto"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        <FaPencilAlt className="absolute top-2 right-2 text-gray-500 " />
      </div>
    </div>
  );
};

export default EditableField;
