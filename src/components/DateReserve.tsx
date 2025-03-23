'use client'
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useState } from "react";

interface DateReserveProps {
  onDateChange: (date: Dayjs | null, time: Dayjs | null) => void;
}

export default function DateReserve({ onDateChange }: DateReserveProps) {
  const [bookDate, setBookDate] = useState<Dayjs | null>(null);
  const [bookTime, setBookTime] = useState<Dayjs | null>(null);

  const handleDateChange = (value: Dayjs | null) => {
    setBookDate(value);
    onDateChange(value, bookTime);
  };

  const handleTimeChange = (value: Dayjs | null) => {
    setBookTime(value);
    onDateChange(bookDate, value);
  };

  return (
    <div className="bg-gray-300 rounded-lg px-6 py-4 inline-flex items-center space-x-4">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Date"
          value={bookDate}
          onChange={handleDateChange}
          slotProps={{
            textField: {
              size: "small",
              className:
                "bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
            },
          }}
        />
        <TimePicker
          label="Select Time"
          value={bookTime}
          onChange={handleTimeChange}
          ampm={false}
          slotProps={{
            textField: {
              size: "small",
              className:
                "bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
