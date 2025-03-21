'use client'
import DateReserve from "@/components/DateReserve"
import { TextField } from "@mui/material"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { BookingItem } from "../../../interface"
import { addBooking } from "@/redux/features/bookSlice"
import { useState } from "react"
import { Dayjs } from "dayjs"
import dayjs from "dayjs"

export default function Booking() {
    const dispatch = useDispatch<AppDispatch>()

    const [nameLastname, setNameLastname] = useState("");
    const [tel, setTel] = useState("");
    const [venue, setVenue] = useState("");
    const [bookDate, setBookDate] = useState<Dayjs | null>(null);

    const makeBooking = () => {
        if (nameLastname && tel && venue && bookDate) {
            const item: BookingItem = {
                nameLastname: nameLastname,
                tel: tel,
                venue: venue,
                bookDate: dayjs(bookDate).format("YYYY/MM/DD")
            };
            dispatch(addBooking(item));
        }
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameLastname(event.target.value);
    }

    const handleTelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTel(event.target.value);
    }

    return (
        <main className="w-[100%] flex flex-col items-center space-y-6 font-serif">
            <div className="text-2xl font-serif mt-6 text-black">Venue Booking</div>

            <div className="w-fit">
                <div className="text-md text-left text-gray-600">Name</div>
                <TextField 
                    id="name-lastname"
                    name="Name-Lastname"
                    label="Name-Lastname"
                    variant="standard"
                    value={nameLastname}
                    onChange={handleNameChange}
                    className="w-[550px] rounded-lg bg-white"
                />
            </div>

            <div className="w-fit">
                <div className="text-md text-left text-gray-600">Telephone</div>
                <TextField 
                    id="contact-number"
                    name="Contact-Number"
                    label="Contact-Number"
                    variant="standard"
                    value={tel}
                    onChange={handleTelChange}
                    className="w-[550px] rounded-lg bg-white"
                />
            </div>

            <div className="w-fit space-y-2">
                <div className="text-md text-left text-gray-600">Date and Location</div>
                <DateReserve 
                    onDateChange={(value: Dayjs) => setBookDate(value)}
                    onLocationChange={(value: string) => setVenue(value)} 
                />
            </div>

            <button 
                className="block rounded-md bg-[#501717] hover:bg-[#731f1f] 
                px-3 py-2 text-white shadow-sm" 
                name="Book Venue" 
                onClick={makeBooking}
            > 
                Book Venue
            </button>
        </main>
    )
}
