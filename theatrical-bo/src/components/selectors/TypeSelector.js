import React from "react";
import Select from "react-select";
import { Label } from "../../styled/app.styled";
import { scrapeTypeOptions } from "../../configs/options";

export const TypeSelector = ({ scrapeType, handleScrapeTypeChange }) => {
  return (
    <Label>
      Select Type:
      <Select
        value={scrapeTypeOptions.find((option) => option.value === scrapeType)}
        onChange={(option) => handleScrapeTypeChange({ target: { value: option.value } })}
        options={scrapeTypeOptions}
      />
    </Label>
  );
};
