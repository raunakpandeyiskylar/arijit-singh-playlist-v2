"use client"

import authTokenStorage from "@/data/datasources/local/authToken.storage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = authTokenStorage.getToken();
            console.log("Protected Route - Token: ", token);

            if (!token) {
                console.log("No token found, redirecting to login");
                router.replace("/auth/login");
            } else {
                setIsChecking(false);
            }
        };

        const timer = setTimeout(checkAuth, 0);

        return () => clearTimeout(timer);
    }, [router]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-8 h-8 border-4 border-music-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
