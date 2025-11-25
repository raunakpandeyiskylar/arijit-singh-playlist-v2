import { AppShell } from "@/application/components/app-shell";

export default function AuthLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AppShell>
            <section className="auth-container min-h-screen w-full">
                {/* Mobile & Tablet: Vertical layout */}
                <div className="block lg:hidden">
                    <div className="flex flex-col">
                        {/* Hero Section - Top */}
                        <div className="px-4 py-8 text-center">
                            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                                    Your{' '}
                                    <span className="gradient-text bg-linear-to-r from-music-primary to-music-accent">
                                        Music
                                    </span>{' '}
                                    Sanctuary
                                </h1>

                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Discover, stream, and share your favorite music. Experience sound like never before.
                                </p>
                            </div>
                        </div>

                        {/* Auth Form - Middle */}
                        <div className="flex-1 flex items-center justify-center px-4 py-8">
                            <div className="w-full max-w-md">
                                {children}
                            </div>
                        </div>

                        {/* Features - Bottom */}
                        <div className="px-4 py-8 border-t border-border/40">
                            <div className="max-w-4xl mx-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <FeatureCard
                                        icon={<HeadphonesIcon />}
                                        title="High Quality Audio"
                                        description="Crystal clear sound with premium streaming"
                                    />
                                    <FeatureCard
                                        icon={<LibraryIcon />}
                                        title="Vast Library"
                                        description="Millions of songs from global artists"
                                    />
                                    <FeatureCard
                                        icon={<PlayIcon />}
                                        title="Smart Recommendations"
                                        description="Discover music tailored to your taste"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop: Horizontal layout */}
                <div className="hidden lg:flex min-h-[calc(100vh-4rem)]">
                    {/* Left Side - Hero & Features */}
                    <div className="flex-1 flex flex-col justify-center px-8 py-12">
                        <div className="max-w-2xl mx-auto w-full">
                            <div className="space-y-12">
                                {/* Hero Section */}
                                <div className="space-y-8 animate-fade-in">
                                    <div>
                                        <h1 className="text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                                            Your{' '}
                                            <span className="gradient-text bg-linear-to-r from-music-primary to-music-accent">
                                                Music
                                            </span>{' '}
                                            Sanctuary
                                        </h1>
                                    </div>

                                    <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                                        Discover, stream, and share your favorite music. Experience sound like never before with our immersive audio platform.
                                    </p>
                                </div>

                                {/* Features Grid */}
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-8">
                                    <FeatureCard
                                        icon={<HeadphonesIcon />}
                                        title="High Quality Audio"
                                        description="Experience crystal clear sound with our premium audio streaming"
                                    />
                                    <FeatureCard
                                        icon={<LibraryIcon />}
                                        title="Vast Library"
                                        description="Access millions of songs from artists around the world"
                                    />
                                    <FeatureCard
                                        icon={<PlayIcon />}
                                        title="Smart Recommendations"
                                        description="Discover new music tailored to your taste"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Auth Form */}
                    <div className="flex-1 flex items-center justify-center px-8 py-12">
                        <div className="w-full max-w-md">
                            {children}
                        </div>
                    </div>
                </div>
            </section>
        </AppShell>
    );
}

function FeatureCard({
    icon,
    title,
    description
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:border-music-primary/20 hover:bg-card/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-linear-to-br from-music-primary/5 to-music-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
                <div className="mb-3 sm:mb-4 inline-flex rounded-lg bg-music-primary/10 p-2 sm:p-3 text-music-primary">
                    <div className="w-5 h-5 sm:w-6 sm:h-6">
                        {icon}
                    </div>
                </div>

                <h3 className="mb-2 text-base sm:text-lg font-semibold text-foreground leading-tight">
                    {title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}

function HeadphonesIcon() {
    return (
        <svg
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
            <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
        </svg>
    );
}

function LibraryIcon() {
    return (
        <svg
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
            <path d="m16 6 4 14" />
            <path d="M12 6v14" />
            <path d="M8 8v12" />
            <path d="M4 4v16" />
        </svg>
    );
}

function PlayIcon() {
    return (
        <svg
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
            <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
    );
}
