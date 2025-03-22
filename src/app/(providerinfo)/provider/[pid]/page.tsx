import getProvider from "@/libs/getProvider";
import Image from "next/image";

export default async function ProviderDetailPage({params} : {params: {pid:string}}) {
    
    const providerDetail = await getProvider(params.pid);

    return (
        <main className="text-center p-5 font-serif">
            <h1 className="text-lg font-medium text-black">{providerDetail.data.name}</h1>
            <div className="flex flex-row my-5">
                <div className="text-md mx-5 text-black text-left">
                    <div>Name: { providerDetail.data.name}</div>
                    <div>Address: { providerDetail.data.address }</div>
                    <div>Tel: { providerDetail.data.tel }</div>
                </div>
            </div>
        </main>
    )
}
