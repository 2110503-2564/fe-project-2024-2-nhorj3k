"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface BookingStats {
  totalBookings: number;
  provider: string;
}

export default function StatsPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<BookingStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://swp-backend.onrender.com/api/v1/bookings/stats", {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }

        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          // Sort by total bookings descending
          const sortedStats = [...result.data].sort((a, b) => b.totalBookings - a.totalBookings);
          setStats(sortedStats);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.token) {
      fetchStats();
    }
  }, [session]);

  const totalBookings = stats.reduce((sum, provider) => sum + provider.totalBookings, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
          <p className="mt-4 text-gray-600">Please try again later or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Booking Statistics</h1>
          <p className="mt-3 text-xl text-gray-500">Overview of bookings by provider</p>
        </div>

        {stats.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-lg text-gray-600">No booking statistics available.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                    <dd className="mt-1 text-3xl font-semibold text-blue-600">{totalBookings}</dd>
                  </dl>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Providers</dt>
                    <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.length}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Provider Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Bookings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.map((provider, index) => (
                      <tr key={provider.provider} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-medium">
                              {index + 1}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{provider.provider}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-semibold">{provider.totalBookings}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}