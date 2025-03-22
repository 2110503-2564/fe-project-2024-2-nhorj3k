'use client'
import React from "react";
import InteractiveCard from "./InteractiveCard";

export default function Card({ providerName}: { providerName: string}) {
    
    return (
        <InteractiveCard contentName={providerName}>
            <div className="w-full h-[30%] p-[10px]">
                <h2 className="text-[14px] font-bold mb-1 text-black">{providerName}</h2>
            </div>
        </InteractiveCard>
    );
}
