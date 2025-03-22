import getVenues from "@/libs/getProviders";
import { Suspense } from "react";
import { LinearProgress } from "@mui/material";
import ProviderCatalog from "@/components/ProviderCatalog";

export default function Card() {
    const providers = getVenues();

    return (
        <main className="text-center">
            {/* Top Section with Background Image */}
            <div
                className="relative bg-cover bg-center h-[36rem]"
                style={{ backgroundImage: "url('/img/providers.jpg')" }}
            >
                {/* Overlay to make content readable */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center h-full">
                    <h1 className="text-xl font-medium text-white font-serif">Select Your Provider</h1>
                </div>
            </div>

            <div className="p-5">
                <Suspense fallback={<p>Loading... <LinearProgress /></p>}>
                    <ProviderCatalog providersJson={providers} />
                </Suspense>
            </div>
        </main>
    );
}