'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Define types for your data
interface Provider {
  _id: string;
  name: string;
  address: string;
  tel: string;
  bookings: any[]; // You can define a more specific type for bookings if needed
}

// Define the message type
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
  
  const { data: session } = useSession();
  
  useEffect(() => {
    // Fetch providers on component mount
    const fetchProviders = async () => {
      try {
        const response = await fetch('https://swp-backend.onrender.com/api/v1/providers');
        const data = await response.json();
        
        if (data && data.data) {
          setProviders(data.data);
          // Set first provider as default if available
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
  
  const handleBooking = async () => {
    if (!selectedProvider || !session?.user?._id) {
      setMessage({ type: 'error', text: 'Provider and user must be selected' });
      return;
    }
    
    setBooking(true);
    
    try {
      const now = new Date();
      const rentalDate = now.toISOString();
      const bookingData = {
        rentalDate: rentalDate,
        user: session.user._id
      };
      const response = await fetch(
        `https://swp-backend.onrender.com/api/v1/providers/${selectedProvider}/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${session.user.token}`
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
        text: error instanceof Error ? error.message : 'Error creating booking'
      });
    } finally {
      setBooking(false);
    }
  };
  
  // Find the selected provider name
  const selectedProviderName = providers.find(
    provider => provider._id === selectedProvider
  )?.name || 'Loading...';
  
  return (
    <main className="w-[100%] flex flex-col items-center space-y-6 font-serif mt-16">
      <div className="text-2xl font-serif mt-6 text-black">Provider Booking</div>
      
      {message && (
        <div className={`p-4 mb-4 rounded-md w-[550px] ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="w-[550px]">
        <div className="text-md text-left text-gray-600">Select Provider</div>
        <select
          id="provider"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
          value={selectedProvider}
          onChange={handleProviderChange}
          disabled={loading}
        >
          {loading ? (
            <option>Loading providers...</option>
          ) : providers.length === 0 ? (
            <option>No providers available</option>
          ) : (
            providers.map(provider => (
              <option key={provider._id} value={provider._id}>
                {provider.name} - {provider.address}
              </option>
            ))
          )}
        </select>
      </div>
      
      {selectedProvider && (
        <div className="w-[550px] text-left">
          <p className="text-gray-600">
            <span className="font-medium">Selected Provider:</span> {selectedProviderName}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Booking Time:</span> {new Date().toLocaleString()}
          </p>
        </div>
      )}
      
      <button 
        className="block rounded-md bg-[#501717] hover:bg-[#731f1f] 
        px-3 py-2 text-white shadow-sm" 
        onClick={handleBooking}
        disabled={loading || booking || !selectedProvider || !session?.user?._id}
      > 
        {booking ? 'Booking...' : 'Book Provider'}
      </button>
    </main>
  );
}