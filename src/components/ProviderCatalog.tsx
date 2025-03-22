import Card from "./Card";
import Link from "next/link";
import { ProviderItem, ProviderJson } from "../../interface";

export default async function ProviderCatalog({ providersJson }: { providersJson: Promise<ProviderJson> }) {
    const providersJsonReady = await providersJson;

    return (
        <div className="font-serif">
            <h2 className="text-xl text-black text-center my-4">
                Explore {providersJsonReady.count} providers in our provider catalog
            </h2>

            <div className="grid-container">
                {providersJsonReady.data.map((providerItem: ProviderItem) => (
                    <Link href={`/provider/${providerItem.id}`} key={providerItem.id} className="card-link">
                        <Card providerName={providerItem.name} />
                    </Link>
                ))}
            </div>
        </div>
    );
}