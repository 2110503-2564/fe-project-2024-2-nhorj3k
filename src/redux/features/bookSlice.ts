import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingItem } from "../../../interface";

type BookState = {
  bookItems: BookingItem[];
};

const initialState: BookState = { bookItems: [] };

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<BookingItem>) => {
      // Check if the booking already exists
      const existingIndex = state.bookItems.findIndex(
        (item) =>
          item._id === action.payload._id // Ensure it's based on unique _id
      );
      if (existingIndex !== -1) {
        state.bookItems[existingIndex] = action.payload; // Update existing booking
      } else {
        state.bookItems.push(action.payload); // Add new booking
      }
    },
    removeBooking: (state, action: PayloadAction<BookingItem>) => {
      // Delete booking using _id instead of other properties to ensure accurate deletion
      state.bookItems = state.bookItems.filter(
        (item) => item._id !== action.payload._id
      );
    },
    setBookings: (state, action: PayloadAction<BookingItem[]>) => {
      // Set the entire list of bookings, useful after fetching data
      state.bookItems = action.payload;
    },
  },
});

export const { addBooking, removeBooking, setBookings } = bookSlice.actions;
export default bookSlice.reducer;