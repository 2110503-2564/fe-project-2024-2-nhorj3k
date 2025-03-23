'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Dayjs } from "dayjs";
import DateReserve from '@/components/DateReserve';

interface Provider {
  _id: string;
  name: string;
  address: string;
  tel: string;
  bookings: any[];
}

type MessageType = {
  type: 'success' | 'error';
  text: string;
} | null;

export default function Booking() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState<MessageType>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('https://swp-backend.onrender.com/api/v1/providers');
        const data = await response.json();
        if (data && data.data) {
          setProviders(data.data);
          if (data.data.length > 0) {
            setSelectedProvider(data.data[0]._id);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching providers:', error);
        setMessage({ type: 'error', text: 'Failed to fetch providers' });
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvider(e.target.value);
  };

  const handleDateTimeChange = (date: Dayjs | null, time: Dayjs | null) => {
    if (date && time) {
      const combined = new Date(date.toDate());
      combined.setHours(time.hour(), time.minute(), 0);
      setSelectedDateTime(combined);
    } else {
      setSelectedDateTime(null);
    }
  };

  const handleOpenModal = () => {
    if (!selectedDateTime) {
      alert("Please select both a date and time.");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmBooking = async () => {
    setShowConfirmModal(false);
    if (!selectedProvider || !session?.user?._id || !selectedDateTime) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }
    setBooking(true);
    try {
      const rentalDate = selectedDateTime.toISOString();
      const bookingData = {
        rentalDate,
        user: session.user._id
      };
      const response = await fetch(
        `https://swp-backend.onrender.com/api/v1/providers/${selectedProvider}/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify(bookingData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating booking');
      }
      setMessage({ type: 'success', text: 'Booking successful!' });
    } catch (error) {
      console.error('Booking error:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error creating booking',
      });
    } finally {
      setBooking(false);
    }
  };

  const selectedProviderName =
    providers.find((provider) => provider._id === selectedProvider)?.name || 'Loading...';

  return (
    <main className="min-h-screen bg-[url('/img/booking-background.jpg')] bg-cover bg-center relative flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="w-full max-w-xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 relative z-10 transform transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 font-serif">
          Provider Booking
          <span className="block mt-2 w-20 h-1 bg-blue-600 mx-auto rounded-full"></span>
        </h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center animate-slideDown ${
              message.type === 'success' 
                ? 'bg-green-100 border border-green-300 text-green-800' 
                : 'bg-red-100 border border-red-300 text-red-800'
            }`}
          >
            {message.text}
            <button 
              onClick={() => setMessage(null)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        )}

        <div className="mb-6 space-y-8">
          <div className="relative group">
            <label className="block text-gray-700 font-medium mb-3 text-lg">
              Select Provider
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                id="provider"
                className="w-full px-5 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#501717] 
                          text-black transition-all duration-300 bg-white appearance-none hover:border-gray-300"
                value={selectedProvider}
                onChange={handleProviderChange}
                disabled={loading}
              >
                {loading ? (
                  <option>Loading providers...</option>
                ) : providers.length === 0 ? (
                  <option>No providers available</option>
                ) : (
                  providers.map((provider) => (
                    <option key={provider._id} value={provider._id}>
                      {provider.name} - {provider.address}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative group">
            <label className="block text-gray-700 font-medium mb-3 text-lg">
              Select Date & Time
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="border-2 border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all duration-300">
              <DateReserve 
                onDateChange={handleDateTimeChange}
              />
            </div>
          </div>
        </div>

        <button
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg 
          hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-95"
          onClick={handleOpenModal}
          disabled={loading || booking || !selectedProvider || !session?.user?._id}
        >
          {booking ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            'Book Now'
          )}
        </button>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 m-4 transform animate-scaleUp">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Booking</h2>
            <div className="mb-4">
              <p className="text-gray-700">
                <strong>Provider:</strong> {selectedProviderName}
              </p>
              <p className="text-gray-700">
                <strong>Booking Time:</strong>{" "}
                {selectedDateTime ? selectedDateTime.toLocaleString() : "Not set"}
              </p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                onClick={confirmBooking}
              >
                Confirm
              </button>
              <button
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}