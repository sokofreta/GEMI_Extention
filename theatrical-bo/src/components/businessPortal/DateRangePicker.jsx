import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/DateRangePicker.css';
const DateRangePicker = ({ selected, onChange }) => {
  const [startDate, setStartDate] = useState(selected);

  const handleChange = (date) => {
    const minDate = new Date('1900-01-01');
    const maxDate = new Date('2100-12-31');
    if (date >= minDate && date <= maxDate) {
      setStartDate(date);
      onChange(date);
    } else {
      alert('Selected date is out of valid range.');
    }
  };

  return (
    <DatePicker 
      selected={startDate} 
      onChange={handleChange} 
      dateFormat="dd/MM/yyyy" 
      placeholderText="Select Date" 
      className="custom-date-picker" 
    />
  );
};

export default DateRangePicker;
