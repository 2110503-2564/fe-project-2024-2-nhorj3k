"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Define the BookingItem interface
interface BookingItem {
    _id: string;
    nameLastname: string;
    tel: string;
    venue: string;
    bookDate: string;
    bookedBy?: string; // Add this new property
  }

export default function BookingList() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: string; text: string }>({
    type: "",
    text: "",
  });

  // Fetch bookings from API
  const fetchBookings = async () => {
    if (session?.user?._id) {
      try {
        setLoading(true);
        const token = session.user.token;
        const endpoint =
          session?.user?.role === "admin"
            ? "https://swp-backend.onrender.com/api/v1/bookings" // Admin gets all bookings
            : `https://swp-backend.onrender.com/api/v1/bookings/user/${session.user._id}`; // User gets their own bookings
  
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        const responseData = await response.json();
        if (responseData.success) {
          const bookingsData = responseData.data.map((booking: any) => ({
            nameLastname: booking.provider.name,
            tel: booking.provider.tel,
            venue: booking.provider.address,
            bookDate: booking.rentalDate,
            _id: booking._id,
            bookedBy: booking.user?.name || booking.user?.email || booking.user || "Unknown user", // Extract user info
          }));
          setBookings(bookingsData);
        } else {
          setMessage({
            type: "error",
            text: responseData.message || "Failed to fetch bookings",
          });
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setMessage({
          type: "error",
          text: "An error occurred while fetching bookings",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch Providers
  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://swp-backend.onrender.com/api/v1/providers"
      );
      const data = await response.json();

      if (data && data.data) {
        setProviders(data.data);
        if (data.data.length > 0) {
          setSelectedProvider(data.data[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
      setMessage({ type: "error", text: "Failed to fetch providers" });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchBookings();
    fetchProviders();

    // Optional: Set up a refresh interval
    const refreshInterval = setInterval(() => {
      fetchBookings();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [session]);

  // Handle removing a booking
  const handleRemoveBooking = async (bookingId: string) => {
    if (session?.user?.token) {
      try {
        setLoading(true);
        const token = session.user.token;
        const response = await fetch(
          `https://swp-backend.onrender.com/api/v1/bookings/${bookingId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        if (result.success) {
          // Update local state by filtering out the deleted booking
          setBookings(bookings.filter((booking) => booking._id !== bookingId));
          setMessage({ type: "success", text: "Booking removed successfully" });
        } else {
          setMessage({
            type: "error",
            text: result.message || "Failed to remove booking",
          });
        }
      } catch (error) {
        console.error("Error removing booking:", error);
        setMessage({
          type: "error",
          text: "An error occurred while removing the booking",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle editing a booking
  const handleEditBooking = async (bookingId: string) => {
    if (session?.user?.token && selectedProvider && selectedDate) {
      try {
        setLoading(true);
        const token = session.user.token;
        const response = await fetch(
          `https://swp-backend.onrender.com/api/v1/bookings/${bookingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              rentalDate: selectedDate,
              provider: selectedProvider,
            }),
          }
        );

        const result = await response.json();
        if (result.success) {
          // Refresh bookings to get updated data
          fetchBookings();
          setMessage({ type: "success", text: "Booking updated successfully" });
        } else {
          setMessage({
            type: "error",
            text: result.message || "Failed to update booking",
          });
        }
      } catch (error) {
        console.error("Error updating booking:", error);
        setMessage({
          type: "error",
          text: "An error occurred while updating the booking",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setMessage({ type: "error", text: "Please select a provider and date" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Message feedback */}
      {message.text && (
        <div
          className={`p-3 rounded ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}

      {/* Bookings list */}
      {!loading && bookings.length === 0 ? (
        <div className="text-center text-gray-600 text-2xl font-serif mt-5">
          No Venue Booking
        </div>
      ) : (
        bookings.map((bookingItem: BookingItem) => (
          <div
            className="bg-green-100 rounded-lg shadow-md p-4 text-gray-800"
            key={bookingItem._id}
          >
            <div className="text-lg font-semibold">
              {bookingItem.nameLastname}
            </div>
            <div className="text-sm">Tel: {bookingItem.tel}</div>
            <div className="text-sm">Location: {bookingItem.venue}</div>
            <div className="text-sm">Date: {bookingItem.bookDate}</div>
            {session?.user?.role === "admin" && (
      <div className="text-sm font-medium text-indigo-700 mt-1">
        Booked by: {bookingItem.bookedBy}
      </div>
    )}

            {/* Edit section */}
            <div className="mt-3 flex gap-2">
              <button
                className="flex-1 rounded-md bg-red-500 hover:bg-red-600 text-white px-3 py-2 text-sm font-semibold transition duration-200"
                onClick={() => handleRemoveBooking(bookingItem._id)}
                disabled={loading}
              >
                Remove
              </button>

              <button
                className="flex-1 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 text-sm font-semibold transition duration-200"
                onClick={() => handleEditBooking(bookingItem._id)}
                disabled={loading}
              >
                Edit
              </button>
            </div>

            {/* Provider dropdown and Date picker */}
            <div className="mt-3 flex gap-2">
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="flex-1 p-2 border rounded-md"
                disabled={loading}
              >
                {providers.map((provider: any) => (
                  <option key={provider._id} value={provider._id}>
                    {provider.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 p-2 border rounded-md"
                disabled={loading}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
