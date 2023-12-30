import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';

const EditableField = ({ label, value, onChange, isDateField, isParagraph }) => {
  const isMultiLine = Array.isArray(value);

  return (
    <div className={`mb-4 relative flex-grow`}>
      <label htmlFor={label.toLowerCase()} className="block font-bold mb-1">
        {label}
      </label>
      <div className="relative">
        {isDateField ? (
          <input
            type="date"
            id={label.toLowerCase()}
            className="w-full border mb-1 p-2 pr-8 text-base sm:text-lg rounded-md"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : isMultiLine ? (
          <textarea
            id={label.toLowerCase()}
            className="w-full border p-2 pr-8 text-base sm:text-lg rounded-md min-h-[100px]"
            value={value.join('\n')}
            onChange={(e) => onChange(e.target.value.split('\n'))}
          />
        ) : (
          <textarea
            id={label.toLowerCase()}
            className={`w-full border p-2 pr-8 text-base sm:text-lg ${isParagraph ? "min-h-[200px]" : ""} h-auto rounded-md`}
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
