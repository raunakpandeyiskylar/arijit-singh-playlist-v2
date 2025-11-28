'use client';

import { create } from 'zustand';
import SongEntity from '@/domain/entities/song.entity';

interface SongsState {
    songs: SongEntity[];
    currentPlaying: SongEntity | null;
    playing: boolean;
    loading: boolean;

    // Actions
    setSongs: (songs: SongEntity[]) => void;
    addSong: (song: SongEntity) => void;
    removeSong: (songId: string) => void;
    setCurrentPlaying: (song: SongEntity | null) => void;
    togglePlay: () => void;
    setLoading: (loading: boolean) => void;
}

export const useSongsStore = create<SongsState>((set) => ({
    songs: [],
    currentPlaying: null,
    playing: false,
    loading: false,

    setSongs: (songs) => set({ songs }),
    addSong: (song) => set((state) => ({ songs: [...state.songs, song] })),
    removeSong: (songId) => set((state) => ({
        songs: state.songs.filter(song => song._id !== songId)
    })),
    setCurrentPlaying: (song) => set({ currentPlaying: song }),
    togglePlay: () => set((state) => ({ playing: !state.playing })),
    setLoading: (loading) => set({ loading: loading }),
}));
