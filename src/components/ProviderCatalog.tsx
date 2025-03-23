import Card from "./Card";
import Link from "next/link";
import { ProviderItem, ProviderJson } from "../../interface";

export default async function ProviderCatalog({ providersJson }: { providersJson: Promise<ProviderJson> }) {
    const providersJsonReady = await providersJson;

    return (
        <div className="space-y-12 px-4 md:px-8">
            <div className="text-center space-y-4 animate-fadeIn">
                <h2 className="text-3xl font-bold font-serif text-gray-800">
                    Explore Our Providers
                </h2>
                <p className="text-gray-600 text-lg">
                    Discover {providersJsonReady.count} premium service providers
                </p>
                <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {providersJsonReady.data.map((providerItem: ProviderItem) => (
                    <Link 
                        href={`/provider/${providerItem.id}`} 
                        key={providerItem.id}
                        className="group transform transition-all duration-300 hover:-translate-y-2"
                    >
                        <div className="h-full bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                        <Card 
                            providerName={providerItem.name}
                            image={`/img/providers/${providerItem.name
                                .toLowerCase()
                                .replace(/\s+/g, '-') // Replace spaces with hyphens
                                .replace(/[^a-z0-9-]/g, '')}.jpg`} // Remove special characters
                        />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    </Link>
                ))}
            </div>

            {!providersJsonReady.data.length && (
                <div className="text-center py-12 text-gray-500">
                    <p className="animate-pulse">Loading premium providers...</p>
                </div>
            )}
        </div>
    );
}