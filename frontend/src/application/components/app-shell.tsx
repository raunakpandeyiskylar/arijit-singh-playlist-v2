'use client';

import { useTheme } from '@/lib/theme_provider';
import { ThemeToggle } from './theme-toggle';
import useAuthStore from '@/application/controllers/auth.controller';
import { useRouter } from 'next/navigation';

export function AppShell({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    const { user, authenticated, logout } = useAuthStore();
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Background gradient */}
            <div
                className="fixed inset-0 -z-10 opacity-5"
                style={{
                    background: theme === 'dark'
                        ? 'linear-gradient(135deg, hsl(262 83% 65%), hsl(320 70% 65%))'
                        : 'linear-gradient(135deg, hsl(262 83% 58%), hsl(320 70% 55%))'
                }}
            />

            {/* Main content */}
            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
                    <div className="container m-auto flex h-16 items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-music-primary to-music-accent">
                                <MusicIcon className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold gradient-text">
                                Daa
                            </span>
                        </div>

                        <nav className="flex items-center gap-4">
                            {authenticated && user && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-muted-foreground">
                                        Welcome, {user.name || user.username}
                                    </span>
                                    <button
                                        onClick={async () => {
                                            await logout();
                                            router.replace("/auth/login");
                                        }}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                            <ThemeToggle />
                        </nav>
                    </div>
                </header>

                {/* Page content */}
                <main className="container m-auto px-4 py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

function MusicIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
        </svg>
    );
}
