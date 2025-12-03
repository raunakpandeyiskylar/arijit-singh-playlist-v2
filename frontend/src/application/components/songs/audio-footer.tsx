// components/audio-player-footer.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import useSongsStore from '@/application/controllers/song.controller';
import Image from 'next/image';
import envConfig from '@/config/env.config';

export default function AudioPlayerFooter() {
    const {
        currentPlaying,
        playing,
        volume,
        currentTime,
        duration,
        loop,
        shuffle,
        togglePlay,
        setVolume,
        setCurrentTime,
        setDuration,
        toggleLoop,
        toggleShuffle,
        playNext,
        playPrevious,
    } = useSongsStore();

    const audioRef = useRef<HTMLAudioElement>(null);
    const [, setIsSeeking] = useState(false);

    // Sync audio element with store
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => {
            if (loop) {
                audio.currentTime = 0;
                audio.play();
            } else {
                playNext();
            }
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener("pause", () => togglePlay(false));
        audio.addEventListener("play", () => togglePlay(true));

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener("pause", () => togglePlay(false));
            audio.removeEventListener("play", () => togglePlay(true));
        };
    }, [setCurrentTime, setDuration, loop, playNext, togglePlay]);

    // Play/pause audio
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentPlaying) return;
    }, [playing, currentPlaying]);

    // Update volume
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
        }
    }, [volume]);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const handleSeekStart = () => setIsSeeking(true);
    const handleSeekEnd = () => setIsSeeking(false);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!currentPlaying) {
        return null;
    }

    return (
        <>
            {/* Hidden audio element */}
            <audio
                ref={audioRef}
                src={typeof currentPlaying.song === 'string' ? currentPlaying.song : currentPlaying.song?.path}
                loop={loop}
                preload='metadata'
            />

            {/* Player Footer */}
            <footer className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-t border-border/40 z-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Song Info */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`size-12 bg-linear-to-br from-music-primary/20 to-music-accent/20 rounded-lg flex items-center justify-center shrink-0`}>
                                {currentPlaying.coverImage ? (<Image src={currentPlaying.coverImage.local ? `${envConfig.baseUrl}${currentPlaying.coverImage.path}` : currentPlaying.coverImage.path} alt={currentPlaying.name} className='size-12 text-music-primary rounded-lg' width={48} height={48} />) : (<MusicIcon className="w-8 h-8 text-music-primary" />)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-foreground truncate text-sm">
                                    {currentPlaying.name}
                                </h4>
                                <p className="text-xs text-muted-foreground truncate">
                                    {currentPlaying.artists?.join(', ')}
                                </p>
                            </div>
                        </div>

                        {/* Playback Controls */}
                        <div className="flex flex-col items-center gap-2 flex-1 w-full max-w-full sm:max-w-md">
                            {/* Control Buttons */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleShuffle}
                                    className={`p-1.5 rounded transition-colors ${shuffle
                                        ? 'text-music-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <ShuffleIcon className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={playPrevious}
                                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <SkipBackIcon className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => {
                                        if (audioRef.current?.paused) {
                                            audioRef.current.play();
                                        } else {
                                            audioRef.current?.pause();
                                        }
                                    }}
                                    className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                                >
                                    {playing ? (
                                        <PauseIcon className="w-4 h-4" />
                                    ) : (
                                        <PlayIcon className="w-4 h-4 ml-0.5" />
                                    )}
                                </button>

                                <button
                                    onClick={playNext}
                                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <SkipForwardIcon className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={toggleLoop}
                                    className={`p-1.5 rounded transition-colors ${loop
                                        ? 'text-music-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <RepeatIcon className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="flex items-center gap-3 w-full">
                                <span className="text-xs text-muted-foreground tabular-nums min-w-[35px] text-right">
                                    {formatTime(currentTime)}
                                </span>

                                <div className="flex-1">
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration || 0}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        onMouseDown={handleSeekStart}
                                        onMouseUp={handleSeekEnd}
                                        onTouchStart={handleSeekStart}
                                        onTouchEnd={handleSeekEnd}
                                        style={{
                                            background: `linear-gradient(to right, hsl(var(--music-primary)) ${(currentTime / duration) * 100}%, hsl(var(--muted)) ${(currentTime / duration) * 100}%)`,
                                        }}
                                        className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
                                    />
                                </div>

                                <span className="text-xs text-muted-foreground tabular-nums min-w-[35px]">
                                    {formatTime(duration)}
                                </span>
                            </div>
                        </div>

                        {/* Volume Control */}
                        <div className="hidden sm:flex items-center gap-2 min-w-0 flex-1 justify-end">
                            <VolumeIcon volume={volume} className="w-4 h-4 text-muted-foreground shrink-0" />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                style={{
                                    background: `linear-gradient(to right, hsl(var(--music-primary)) ${(volume) * 100}%, hsl(var(--muted)) ${(volume) * 100}%)`,
                                }}
                                className="w-20 h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
                            />
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

// Icon Components
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

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
    );
}

function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
        </svg>
    );
}

function SkipBackIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
        </svg>
    );
}

function SkipForwardIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
        </svg>
    );
}

function ShuffleIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
            <path d="m18 2 4 4-4 4" />
            <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
            <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
            <path d="m18 14 4 4-4 4" />
        </svg>
    );
}

function RepeatIcon(props: React.SVGProps<SVGSVGElement>) {
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
            <path d="m17 2 4 4-4 4" />
            <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
            <path d="m7 22-4-4 4-4" />
            <path d="M21 13v1a4 4 0 0 1-4 4H3" />
        </svg>
    );
}

function VolumeIcon({ volume, ...props }: { volume: number } & React.SVGProps<SVGSVGElement>) {
    if (volume === 0) {
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
                <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587a.7.7 0 0 1-.497.206H3.5A1.5 1.5 0 0 0 2 9.293v5.414A1.5 1.5 0 0 0 3.5 16.5h2.416a.7.7 0 0 1 .497.206l3.383 3.384A.705.705 0 0 0 11 19.849V4.702Z" />
                <path d="M22 9l-6 6" />
                <path d="m16 9 6 6" />
            </svg>
        );
    } else if (volume < 0.5) {
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
                <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587a.7.7 0 0 1-.497.206H3.5A1.5 1.5 0 0 0 2 9.293v5.414A1.5 1.5 0 0 0 3.5 16.5h2.416a.7.7 0 0 1 .497.206l3.383 3.384A.705.705 0 0 0 11 19.849V4.702Z" />
                <path d="M15 8a5 5 0 0 1 0 8" />
            </svg>
        );
    } else {
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
                <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587a.7.7 0 0 1-.497.206H3.5A1.5 1.5 0 0 0 2 9.293v5.414A1.5 1.5 0 0 0 3.5 16.5h2.416a.7.7 0 0 1 .497.206l3.383 3.384A.705.705 0 0 0 11 19.849V4.702Z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
        );
    }
}
