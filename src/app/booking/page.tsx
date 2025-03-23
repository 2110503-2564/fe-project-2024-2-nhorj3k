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

  // Combine date and time from DateReserve into a single Date object.
  const handleDateTimeChange = (date: Dayjs | null, time: Dayjs | null) => {
    if (date && time) {
      const combined = new Date(date.toDate());
      combined.setHours(time.hour(), time.minute(), 0);
      setSelectedDateTime(combined);
    } else {
      setSelectedDateTime(null);
    }
  };

  // Open confirmation modal or alert if date/time not selected
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
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 mt-11">
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Provider Booking</h1>

        {message && (
          <div
            className={`mb-4 p-4 rounded-md text-center ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="provider" className="block text-gray-700 font-medium mb-2">
            Select Provider
          </label>
          <select
            id="provider"
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
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
        </div>

        {/* DateReserve component for picking date and time */}
        <div className="mb-6">
          <DateReserve onDateChange={handleDateTimeChange} />
        </div>

        <button
          className="w-full py-3 bg-[#501717] hover:bg-[#731f1f] text-white font-semibold rounded-lg shadow-md transition-colors"
          onClick={handleOpenModal}
          disabled={loading || booking || !selectedProvider || !session?.user?._id}
        >
          {booking ? 'Booking...' : 'Book Provider'}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
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
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                onClick={confirmBooking}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
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
