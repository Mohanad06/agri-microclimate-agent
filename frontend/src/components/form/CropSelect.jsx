import React from 'react';

/**
 * Dynamic CropSelect dropdown component.
 *
 * @param {Object} props
 * @param {string} props.value
 * @param {string[]} [props.crops=[]]
 * @param {Function} props.onChange
 * @param {boolean} [props.disabled=false]
 */
export function CropSelect({ value, crops = [], onChange, disabled = false }) {
  return (
    <select
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label="Select target crop"
    >
      <option value="" disabled>Select crop...</option>
      {crops.map((crop) => (
        <option key={crop} value={crop}>
          {crop}
        </option>
      ))}
    </select>
  );
}

export default CropSelect;
