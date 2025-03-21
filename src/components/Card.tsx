'use client'
import React from "react";
import Image from "next/image";
import InteractiveCard from "./InteractiveCard";
import Rating from "@mui/material/Rating";

export default function Card({ venueName, imgSrc, onRating }: { venueName: string; imgSrc: string; onRating?: (rating: number) => void }) {
    const [value, setValue] = React.useState<number | null>(0);

    function onVenueSelected() {
        alert("You Select " + venueName);
    }

    return (
        <InteractiveCard contentName={venueName}>
            <div className="w-full h-[70%] relative rounded-t-lg">
                <Image
                    src={imgSrc}
                    alt="Product Picture"
                    fill={true}
                    className="object-cover rounded-t-lg"
                />
            </div>
            <div className="w-full h-[30%] p-[10px]">
                <h2 className="text-[14px] font-bold mb-1 text-[#501717] underline">{venueName}</h2>
                {
                    onRating? <div onClick={(e) => {e.stopPropagation(); e.preventDefault() }}>
                    <Rating
                        id={`${venueName} Rating`}
                        name={`${venueName} Rating`}
                        data-testid={`${venueName} Rating`}
                        value={value}
                        onChange={(e, newValue) => {
                            setValue(newValue);
                            onRating?.(newValue ?? 0);
                        }}
                    /></div> : ''
                }
                
            </div>
        </InteractiveCard>
    );
}
