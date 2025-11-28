// application/controllers/jamming.store.ts
'use client';

import { create } from 'zustand';
import Jamming from '@/domain/entities/jaming.entity';
import SongEntity from '@/domain/entities/song.entity';

interface JammingState {
    activeJams: Jamming[];
    currentJam: Jamming | null;
    loading: boolean;

    // Actions
    setActiveJams: (jams: Jamming[]) => void;
    createJam: (title: string, songs: SongEntity[]) => void;
    joinJam: (jamId: string) => void;
    leaveJam: (jamId: string) => void;
    addSongToJam: (jamId: string, song: SongEntity) => void;
    removeSongFromJam: (jamId: string, songId: string) => void;
    setCurrentJam: (jam: Jamming | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useJammingStore = create<JammingState>((set) => ({
    activeJams: [],
    currentJam: null,
    loading: false,

    setActiveJams: (jams) => set({ activeJams: jams }),
    createJam: (title, songs) => set((state) => {
        const newJam: Jamming = {
            _id: `jam-${Date.now()}`,
            sessionId: `session-${Math.random().toString(36).substr(2, 9)}`,
            title,
            users: [], // Will be populated from auth
            createdBy: {} as any, // Will be set from auth
            playList: songs,
            mode: 'normal',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return { activeJams: [...state.activeJams, newJam], currentJam: newJam };
    }),
    joinJam: (jamId) => set((state) => ({
        activeJams: state.activeJams.map(jam =>
            jam._id === jamId
                ? { ...jam, users: [...jam.users, {} as any], updatedAt: new Date() } // Add current user
                : jam
        )
    })),
    leaveJam: (jamId) => set((state) => ({
        activeJams: state.activeJams.map(jam =>
            jam._id === jamId
                ? { ...jam, users: jam.users.filter((_, index) => index > 0), updatedAt: new Date() } // Remove current user
                : jam
        ),
        currentJam: state.currentJam?._id === jamId ? null : state.currentJam
    })),
    addSongToJam: (jamId, song) => set((state) => ({
        activeJams: state.activeJams.map(jam =>
            jam._id === jamId
                ? { ...jam, playList: [...jam.playList, song], updatedAt: new Date() }
                : jam
        )
    })),
    removeSongFromJam: (jamId, songId) => set((state) => ({
        activeJams: state.activeJams.map(jam =>
            jam._id === jamId
                ? { ...jam, playList: jam.playList.filter(s => s._id !== songId), updatedAt: new Date() }
                : jam
        )
    })),
    setCurrentJam: (jam) => set({ currentJam: jam }),
    setLoading: (loading) => set({ loading: loading }),
}));
