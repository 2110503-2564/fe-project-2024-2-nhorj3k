// Card.tsx
'use client'
import React from "react";
import InteractiveCard from "./InteractiveCard";

export default function Card({ providerName, image }: { providerName: string, image: string }) {
    const imagePath = `/img/providers/${providerName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')}.jpg`;
    
    return (
        <InteractiveCard contentName={providerName} image={imagePath}>
            <div className="w-full h-full flex items-center justify-center p-4">
                <h2 className="text-xl font-bold text-black text-center bg-gradient-to-r bg-clip-text">
                    {providerName}
                </h2>
            </div>
        </InteractiveCard>
    );
}