import React from "react";
import Select from "react-select";
import { rangeOptions } from "../configs/options";

function RangeSelector({ selectedRange, handleRangeChange }) {
  const options = rangeOptions.map((option) => ({
    value: `${option.start}-${option.end}`,
    label: `${option.start}-${option.end}`,
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minWidth: 150, 
    }),
    menu: (provided) => ({
      ...provided,
      minWidth: 150, 
    }),
  };

  return (
    <label>
      Select Range:
      <Select
        value={options.find((option) => option.value === `${selectedRange.start}-${selectedRange.end}`)}
        onChange={(option) => handleRangeChange({ target: { value: option.value } })}
        options={options}
        styles={customStyles}
      />
    </label>
  );
}

export default RangeSelector;