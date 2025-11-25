// application/controllers/playlists.store.ts
'use client';

import { create } from 'zustand';
import PlaylistEntity from '@/domain/entities/playlist.entity';
import SongEntity from '@/domain/entities/song.entity';

interface PlaylistsState {
    playlists: PlaylistEntity[];
    currentPlaylist: PlaylistEntity | null;
    loading: boolean;

    // Actions
    setPlaylists: (playlists: PlaylistEntity[]) => void;
    createPlaylist: (name: string, songs: SongEntity[]) => void;
    addToPlaylist: (playlistId: string, song: SongEntity) => void;
    removeFromPlaylist: (playlistId: string, songId: string) => void;
    deletePlaylist: (playlistId: string) => void;
    setCurrentPlaylist: (playlist: PlaylistEntity | null) => void;
    setLoading: (loading: boolean) => void;
}

export const usePlaylistsStore = create<PlaylistsState>((set) => ({
    playlists: [],
    currentPlaylist: null,
    loading: false,

    setPlaylists: (playlists) => set({ playlists }),
    createPlaylist: (name, songs) => set((state) => {
        const newPlaylist: PlaylistEntity = {
            _id: `playlist-${Date.now()}`,
            name,
            songs,
            mode: 'normal',
            createdBy: {} as any, // Will be set from auth
            for: {} as any, // Will be set from auth
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return { playlists: [...state.playlists, newPlaylist] };
    }),
    addToPlaylist: (playlistId, song) => set((state) => ({
        playlists: state.playlists.map(playlist =>
            playlist._id === playlistId
                ? { ...playlist, songs: [...playlist.songs, song], updatedAt: new Date() }
                : playlist
        )
    })),
    removeFromPlaylist: (playlistId, songId) => set((state) => ({
        playlists: state.playlists.map(playlist =>
            playlist._id === playlistId
                ? { ...playlist, songs: playlist.songs.filter(s => s._id !== songId), updatedAt: new Date() }
                : playlist
        )
    })),
    deletePlaylist: (playlistId) => set((state) => ({
        playlists: state.playlists.filter(playlist => playlist._id !== playlistId)
    })),
    setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),
    setLoading: (loading) => set({ loading: loading }),
}));
