import { useState } from "react";

const useScraper = () => {
  const [click, setClicked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ start: 0, end: 100 });
  const [scrapeType, setScrapeType] = useState("actors");

  const start = () => {
    setClicked(true);

  };

  const stop = () => {
    setDisabled(true);

  };

  const reset = () => {
    setClicked(false);
    setDisabled(false);

  };

  const handleRangeChange = (e) => {
    const selectedValue = e.target.value;
    const [start, end] = selectedValue.split("-").map(Number);
    setSelectedRange({ start, end });
  };

  const handleScrapeTypeChange = (e) => {
    setScrapeType(e.target.value);
  };


  return {
    click,
    disabled,
    selectedRange,
    start,
    stop,
    reset,
    handleRangeChange,
    scrapeType,
    handleScrapeTypeChange,
  };
};

export default useScraper;