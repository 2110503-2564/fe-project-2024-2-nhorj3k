import getProvider from "@/libs/getProvider";
import Image from "next/image";
import Link from "next/link";

export default async function ProviderDetailPage({params} : {params: {pid:string}}) {
    const providerDetail = await getProvider(params.pid);
    const imagePath = `/img/providers/${providerDetail.data.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')}.jpg`;

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
                                <Image
                                    src={imagePath}
                                    alt={providerDetail.data.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 space-y-6 text-left">
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                                <div className="space-y-3 text-gray-600">
                                    <p className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        {providerDetail.data.address}
                                    </p>
                                    <p className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                        {providerDetail.data.tel}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <Link 
                                    href="/booking" 
                                    className="flex-1 text-center px-6 py-3 bg-blue-600 text-white text-xl rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
                                >
                                    Book ↗
                                </Link>
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
    )
}