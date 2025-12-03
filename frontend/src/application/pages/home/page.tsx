// application/pages/home/page.tsx
'use client';

import { AddSongDialog } from '@/application/components/songs/add_song_dialogue';
import useAuthStore from '@/application/controllers/auth.controller';
import useSongsStore from '@/application/controllers/song.controller';
import envConfig from '@/config/env.config';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function HomePage() {
    const { user } = useAuthStore();
    const { songs, getSongs, setCurrentPlaying, currentPlaying } = useSongsStore();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        getSongs({ page: 1, limit: 999, id: null });
    }, [user, getSongs]);

    return (
        <div className="max-w-full mx-auto space-y-4">
            <header className='flex justify-between items-center'>
                <p className='text-2xl font-semibold'>
                    My Songs
                </p>
                <button type='button' className='bg-music-primary py-2 px-7 rounded-lg text-white' onClick={() => setOpen(true)}>+ Add Song</button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {songs.map((song) => (
                    <div
                        key={song._id}
                        className="bg-card rounded-xl border border-border/40 p-6 cursor-pointer hover:shadow-lg flex justify-between gap-4 items-center transition-shadow min-w-0"
                        onClick={() => currentPlaying?._id === song._id ? {} : setCurrentPlaying(song, true)}
                    >
                        <div className="size-16 bg-linear-to-br from-music-primary/20 to-music-accent/20 rounded-lg flex items-center justify-center ">
                            {song.coverImage ? (<Image src={song.coverImage.local ? `${envConfig.baseUrl}${song.coverImage.path}` : song.coverImage.path} alt={song.name} className='size-16 text-music-primary rounded-lg' width={64} height={64} />) : (<MusicIcon className="w-8 h-8 text-music-primary" />)}
                        </div>
                        <div className='flex flex-col items-start flex-1 min-w-0 overflow-hidden'>
                            <h3 className="font-semibold text-foreground truncate w-full">
                                {song.name}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate w-full">
                                {song.artists?.join(', ') || 'Unknown Artist'}
                            </p>
                        </div>
                        <button disabled={currentPlaying?._id === song._id} className="disabled:opacity-50 text-nowrap disabled:cursor-not-allowed px-4 py-2 bg-music-primary text-white rounded-lg text-sm font-medium hover:bg-music-primary/90 transition-colors">
                            Play Now
                        </button>
                    </div>
                ))}
            </div>

            <AddSongDialog open={open} onClose={() => setOpen(false)} />
        </div >
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
