import React from 'react';

/**
 * Functional component representing a filter element.
 *
 * @param {Object} props - Component props
 * @param {string} props.content - The content to display in the filter element
 * @param {Function} props.onClick - The function to be called on element click
 * @returns {JSX.Element} Filter element component
 */
const FilterElement = ({ content, onClick }) => {
    return (
        <div
            onClick={() => onClick(content)}
            className='cursor-pointer hover:bg-[#ea5151de] hover:shadow-md hover:text-white hover:border-red-600 text-[#04807cda] font-semibold bg-[#FCFFF7] border border-[#04686578] rounded-xl p-1 mt-1 mr-1 transition duration-200 ease-in-out transform'>
            {content}
        </div>
    );
};

export default FilterElement;
