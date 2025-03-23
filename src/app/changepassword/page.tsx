"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ChangePasswordPage() {
    const { data: session } = useSession();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("https://swp-backend.onrender.com/api/v1/auth/updatePassword", {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.user?.token}`
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();
            
            if (res.ok) {
                setMessage(data.message || "Password changed successfully!");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1500);
            } else {
                setMessage(data.message || "Error changing password. Please try again.");
            }
        } catch (error) {
            setMessage("Error connecting to server. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[url('/img/changepassword-bg.jpg')] bg-cover bg-center relative flex items-center justify-center py-12 px-4">
            <div className="absolute inset-0 bg-black/50"></div>
            
            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 relative z-10 transform transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 font-serif">
                    Change Password
                    <span className="block mt-2 w-20 h-1 bg-blue-600 mx-auto rounded-full"></span>
                </h2>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg text-center animate-slideDown ${
                        message.includes("success") 
                            ? 'bg-green-100 border border-green-300 text-green-800' 
                            : 'bg-red-100 border border-red-300 text-red-800'
                    }`}>
                        {message}
                        <button 
                            onClick={() => setMessage("")}
                            className="ml-4 text-gray-500 hover:text-gray-700"
                        >
                            &times;
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <label className="block text-gray-700 font-medium mb-3 text-lg">
                            Current Password
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-5 py-3 text-lg text-black border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                            required
                        />
                    </div>

                    <div className="relative group">
                        <label className="block text-gray-700 font-medium mb-3 text-lg">
                            New Password
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-5 py-3 text-lg text-black border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-95"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Updating...</span>
                            </div>
                        ) : (
                            'Change Password'
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Return to {" "}
                    <a 
                        href="/"
                        className="text-blue-600 hover:text-blue-500 font-semibold underline transition-colors"
                    >
                        Homepage
                    </a>
                </p>
            </div>
        </div>
    );
}