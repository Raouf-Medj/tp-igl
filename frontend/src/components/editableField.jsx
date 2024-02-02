import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';

/**
 * Component for an editable field.
 *
 * @param {Object} props - The editable field props
 * @param {string} props.label - The label for the field
 * @param {string | Array} props.value - The value of the field
 * @param {Function} props.onChange - Function to handle field value change
 * @param {boolean} props.isDateField - Indicates if the field is a date field
 * @param {boolean} props.isParagraph - Indicates if the field is a paragraph
 * @returns {JSX.Element} Component for an editable field
 */
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
            className="outline-none focus:border-[#1c8a8a] w-full border mb-1 p-2 pr-8 text-base sm:text-lg rounded-md hover:drop-shadow-lg transition duration-300 ease-in-out transform"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : isMultiLine ? (
          <textarea
            id={label.toLowerCase()}
            className="outline-none focus:border-[#1c8a8a] w-full border p-2 pr-8 text-base sm:text-lg rounded-md min-h-[100px] hover:drop-shadow-lg transition duration-300 ease-in-out transform"
            value={value.join('\n')}
            onChange={(e) => onChange(e.target.value.split('\n'))}
          />
        ) : (
          <textarea
            id={label.toLowerCase()}
            className={`outline-none focus:border-[#1c8a8a] w-full border p-2 pr-8 text-base sm:text-lg ${isParagraph ? "min-h-[200px]" : ""} h-auto rounded-md hover:drop-shadow-lg transition duration-300 ease-in-out transform`}
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
