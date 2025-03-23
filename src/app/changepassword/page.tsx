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
                window.location.href = "http://localhost:3000/";
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-4">Change Password</h2>
                {message && (
                    <p className={`text-center ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                        {message}
                    </p>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                        required
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                        disabled={isLoading}
                    >
                        {isLoading ? "Changing..." : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}