import { AppShell } from '@/application/components/app-shell';
import ProtectedRoute from '@/application/components/protected_routes';

export default function Home() {
  return (
    <ProtectedRoute>
      <AppShell>
        <div className="flex flex-col items-center justify-center text-center space-y-8 py-16">
          {/* Hero Section */}
          <div className="max-w-4xl space-y-6 animate-fade-in">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
              Your{' '}
              <span className="gradient-text bg-linear-to-r from-music-primary to-music-accent">
                Music
              </span>{' '}
              Sanctuary
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover, stream, and share your favorite music. Experience sound like never before with our immersive audio platform.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
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
      </AppShell>
    </ProtectedRoute>
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
    <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:border-music-primary/20">
      <div className="absolute inset-0 bg-linear-to-br from-music-primary/5 to-music-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="mb-4 inline-flex rounded-lg bg-music-primary/10 p-3 text-music-primary">
          {icon}
        </div>

        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed">
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
