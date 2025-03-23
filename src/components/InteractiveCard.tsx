'use client'
import React from "react"

export default function InteractiveCard({ children, contentName, image }: { 
  children: React.ReactNode, 
  contentName: string,
  image: string
}) {

    function onCardMouseAction(event: React.SyntheticEvent) {
        const card = event.currentTarget as HTMLElement;
        if (event.type === 'mouseover') {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        }
    }
    
    return (
        <div 
            className="relative w-full h-[300px] rounded-xl bg-white shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
            onMouseOver={onCardMouseAction}
            onMouseOut={onCardMouseAction}
        >
            {/* Circle Image Container */}
            <div className="h-[70%] flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden">
                <img 
                    src={image} // Pass the image URL as a prop
                    alt={contentName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'; // Hide image if it fails to load
                    }}
                />
                </div>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-white via-white/90 to-transparent p-4">
                {children}
            </div>

            {/* Hover Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300">
                    View Details
                </button>
            </div>
        </div>
    )
}