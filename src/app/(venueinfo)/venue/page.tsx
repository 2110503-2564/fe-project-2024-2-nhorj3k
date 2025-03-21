import getVenues from "@/libs/getVenues"
import VenueCatalog from "@/components/VenueCatalog"
import { Suspense } from "react"
import { LinearProgress } from "@mui/material"

export default function Card() {
    const venues = getVenues()

    return (
        <main className="text-center p-5">
            <h1 className="text-xl font-medium text-black font-serif ">Select Your Venue</h1>
            <Suspense fallback={ <p>Loading... <LinearProgress/></p> }>
            <VenueCatalog venuesJson={venues}/>                
            </Suspense>
        </main>
    )
}