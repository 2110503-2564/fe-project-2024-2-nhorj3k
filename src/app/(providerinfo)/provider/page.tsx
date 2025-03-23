import getProviders from "@/libs/getProviders";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";
import ProviderCatalog from "@/components/ProviderCatalog";

export default function Card() {
    const providers = getProviders();

    return (
        <main className="text-center">
            <div
                className="relative bg-fixed bg-cover bg-center min-h-[90vh] flex items-center justify-center"
                style={{ backgroundImage: "url('/img/providers.jpg')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
                
                <div className="relative z-10 space-y-6 animate-fadeInUp">
                    <h1 className="text-4xl md:text-6xl font-bold text-white font-serif mb-4">
                        Find Your Perfect Provider
                    </h1>
                    <p className="text-xl text-white/90 font-light max-w-2xl mx-auto">
                        Discover trusted service providers tailored to your needs
                    </p>
                </div>
            </div>

            <div className="p-5 mt-5">
                <Suspense fallback={<p>Loading... <LinearProgress /></p>}>
                    <ProviderCatalog providersJson={providers} />
                </Suspense>
            </div>
        </main>
    );
}