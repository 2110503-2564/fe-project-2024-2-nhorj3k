"use client"; // Ensure this is a client component

import getProvider from "@/libs/getProvider";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProviderDetailPage({ params }: { params: { pid: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [providerDetail, setProviderDetail] = useState<any>(null);

  useEffect(() => {
    async function fetchProvider() {
      const data = await getProvider(params.pid);
      setProviderDetail(data);
    }
    fetchProvider();
  }, [params.pid]);

  if (!providerDetail) return <p>Loading...</p>;

  const imagePath = `/img/providers/${providerDetail.data.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")}.jpg`;

  const handleBooking = () => {
    if (session) {
      router.push("/booking"); // If signed in, go to booking
    } else {
      router.push("/api/auth/signin"); // If not, go to sign-in first
    }
  };

  return (
    <main className="min-h-screen bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 max-w-4xl mx-auto py-16 px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            {providerDetail.data.name}
            <span className="block mt-2 w-20 h-1 bg-blue-600 mx-auto rounded-full"></span>
          </h1>

          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-1/2">
              <div className="relative h-64 lg:h-96 rounded-xl overflow-hidden shadow-lg">
                <Image src={imagePath} alt={providerDetail.data.name} fill className="object-cover" />
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6 text-left">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                <div className="space-y-3 text-gray-600">
                  <p>📍 {providerDetail.data.address}</p>
                  <p>📞 {providerDetail.data.tel}</p>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                {/* Book button always visible */}
                <button
                  onClick={handleBooking}
                  className="flex-1 text-center px-6 py-3 bg-blue-600 text-white text-xl rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  Book ↗
                </button>
                
                <Link
                  href="/provider"
                  className="flex-1 text-center px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center"
                >
                  ← Back to Providers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
