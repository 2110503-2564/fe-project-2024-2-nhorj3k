'use client'
import { AppDispatch, useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"
import { removeBooking } from "@/redux/features/bookSlice"
import { BookingItem } from "../../interface"

export default function BookingList() {
    const venueItems = useAppSelector( (state) => state.bookSlice.bookItems)
    const dispatch = useDispatch<AppDispatch>()
    
    if (venueItems.length === 0) {
        return (
          <div className="text-center text-gray-600 text-2xl font-serif mt-5">
            No Venue Booking
          </div>
        )

    } else {
        return (
            <>
            {
                venueItems.map((bookingItem: BookingItem) => (
                    <div className="bg-yellow-200 rounded px-5 py-2 my-2 text-black font-serif"
                        key={bookingItem.nameLastname}>
                            <div className="text-xl">{bookingItem.nameLastname}</div>
                            <div className="text-sm">Tel: {bookingItem.tel}</div>
                            <div className="text-sm">Location: {bookingItem.venue}</div>
                            <div className="text-sm">Date: {bookingItem.bookDate}</div>
                            <button className="block rounded-md bg-[#501717] hover:bg-[#731f1f] 
                                px-3 py-2 text-white shadow-sm" 
                                name="Book Venue" 
                                onClick={() => dispatch(removeBooking(bookingItem))}
                            > 
                                Remove from booking
                            </button>
                    </div>                
                ))
            }
            </>
        )
    }
}