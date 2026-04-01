import React from "react";
import Select from "react-select";
import { Label } from "../../styled/app.styled";
import { urlOptions } from "../../configs/options";



export const UrlSelector = ({ selectedUrl, handleUrlChange }) => {
  return (
    <Label>
      Select URL:
      <Select
        value={urlOptions.find((option) => option.value === selectedUrl)}
        onChange={(option) => handleUrlChange({ target: { value: option.value } })}
        options={urlOptions}
      />
    </Label>
  );
};