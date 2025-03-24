'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Banner() {
    const router = useRouter();
    const { data: session } = useSession();

    const handleBookingClick = () => {
        if (session) {
            router.push('/booking');
        } else {
            router.push('/api/auth/signin');
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <div className="absolute inset-0">
                <Image 
                    src={'/img/cover.jpg'} 
                    alt="cover"
                    fill
                    objectFit="cover"
                    priority
                    className="brightness-75"
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>

            <div className="relative flex flex-col items-center text-center text-white z-10 mt-32">
                <h1 className="text-5xl font-bold font-serif drop-shadow-lg">
                    Plan Your Trip With Ease
                </h1>
                <h3 className="text-2xl font-serif mt-3 opacity-90">
                    "Rain or shine, your ride's on time"
                </h3>

                <div className="flex flex-row gap-6 mt-6">
                    <button 
                        className="bg-white text-black font-semibold font-serif py-3 px-6 rounded-lg 
                                   shadow-lg hover:bg-gray-300 transition duration-300"
                        onClick={() => {
                                router.push('/provider');
                                router.refresh();
                            }
                        }
                    >
                        Check out our providers
                    </button>
                    
                    <button 
                        className="bg-blue-500 text-white font-semibold font-serif py-3 px-6 rounded-lg 
                                   shadow-lg hover:bg-blue-600 transition duration-300"
                        onClick={handleBookingClick}
                    >
                        Book NOW ↗
                    </button>
                </div>
            </div>
        </div>
    );
}
