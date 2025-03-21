'use client'
import { DatePicker } from "@mui/x-date-pickers"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { Select, MenuItem } from "@mui/material"
import { Dayjs } from "dayjs"
import { useState } from "react"

export default function DateReserve({onDateChange, onLocationChange}
    : {onDateChange:Function, onLocationChange:Function}) {
    
    const [bookDate, setBookDate] = useState<Dayjs|null>(null)
    const [location, setLocation] = useState<string|null>(null)
    
    return (
        <div className="bg-yellow-100 rounded-lg space-x-5 space-y-2 
        w-fit px-10 py-5 flex flex-row justify-center">

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker className="bg-white"
                value={bookDate}
                onChange={(value)=>{setBookDate(value); onDateChange(value)}}/>
            </LocalizationProvider>

            <Select variant="standard" id="venue" value={location}
            className="h-[2em] w-[200px]" 
            sx={{ fontFamily: "serif" }}
            onChange={ (e) => {setLocation(e.target.value); onLocationChange(e.target.value)} }>
                <MenuItem className="font-serif" value="Bloom">The Bloom Pavilion</MenuItem>
                <MenuItem className="font-serif" value="Spark">Spark Space</MenuItem>
                <MenuItem className="font-serif" value="GrandTable">The Grand Table</MenuItem>
            </Select>
        </div>
    )
}