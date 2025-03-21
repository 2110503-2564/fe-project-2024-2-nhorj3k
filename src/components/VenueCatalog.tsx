import Card from "./Card"
import Link from "next/link"
import { VenueItem, VenueJson } from "../../interface"

export default async function VenueCatalog({venuesJson} : {venuesJson:Promise<VenueJson>}) {
    const venuesJsonReady = await venuesJson

    return (
        <div className="font-serif">
            <h2 className="text-xl text-black text-center my-4">
                Explore {venuesJsonReady.count} venues in our venue catalog
            </h2>

            <div style={{margin:"20px", display:"flex",
                flexDirection:"row", alignContent:"space-around",
                justifyContent:"space-around", flexWrap:"wrap"}}>
                {
                    venuesJsonReady.data.map((venueItem:VenueItem) => (
                        <Link href={`/venue/${venueItem.id}`} className="w-1/5"> 
                            <Card 
                                venueName={venueItem.name} 
                                imgSrc={venueItem.picture}                     
                            />
                        </Link>
                    ))
                }        
            </div>
        </div>
    )
}