// application/controllers/songs.store.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import SongEntity from '@/domain/entities/song.entity';
import CreateSongUsecase from '@/domain/usecases/songs/create_song.usecase';
import songsService from '@/data/services/songs.service';
import GetSongUsecase from '@/domain/usecases/songs/get_song.usecase';

interface SongsState {
    songs: SongEntity[];
    currentPlaying: SongEntity | null;
    playing: boolean;
    loading: boolean;
    error: string | null;
    volume: number;
    currentTime: number;
    duration: number;
    loop: boolean;
    shuffle: boolean;

    // Actions
    setSongs: (songs: SongEntity[]) => void;
    addSong: (songData: FormData) => Promise<void>;
    getSongs: ({ page, limit, id }: { page: number, limit: number, id: string | null }) => Promise<void>;
    setCurrentPlaying: (song: SongEntity | null, playing: boolean) => void;
    togglePlay: () => void;
    setVolume: (volume: number) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
}

const useSongsStore = create<SongsState>()(persist(
    (set, get) => ({
        songs: [],
        currentPlaying: null,
        playing: false,
        loading: false,
        error: null,
        volume: 1,
        currentTime: 0,
        duration: 0,
        loop: false,
        shuffle: false,

        setSongs: (songs) => set({ songs }),
        setCurrentPlaying: (song, playing) => set({ currentPlaying: song, playing: playing }),
        togglePlay: () => set((state) => ({ playing: !state.playing })),
        setVolume: (volume) => set({ volume }),
        setCurrentTime: (currentTime) => set({ currentTime }),
        setDuration: (duration) => set({ duration }),
        toggleLoop: () => set((state) => ({ loop: !state.loop })),
        toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
        playNext: () => {
            const { songs, currentPlaying, shuffle } = get();
            if (!currentPlaying || songs.length === 0) return;

            const currentIndex = songs.findIndex(song => song._id === currentPlaying._id);
            let nextIndex;

            if (shuffle) {
                nextIndex = Math.floor(Math.random() * songs.length);
            } else {
                nextIndex = (currentIndex + 1) % songs.length;
            }

            set({ currentPlaying: songs[nextIndex], playing: true });
        },
        playPrevious: () => {
            const { songs, currentPlaying, shuffle } = get();
            if (!currentPlaying || songs.length === 0) return;

            const currentIndex = songs.findIndex(song => song._id === currentPlaying._id);
            let previousIndex;

            if (shuffle) {
                previousIndex = Math.floor(Math.random() * songs.length);
            } else {
                previousIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
            }

            set({ currentPlaying: songs[previousIndex], playing: true });
        },

        addSong: async (songData) => {
            try {
                set({ loading: true, error: null });

                const response = await new CreateSongUsecase(songsService).call(songData);

                if (!response.status || !response.data || response.data.type === "single") {
                    throw new Error(response.message);
                }

                get().getSongs({ page: 1, limit: 999, id: null });
            } catch (error: any) {
            } finally {
                set({ loading: false });
            }
        },

        getSongs: async ({ page = 1, limit = 20, id }: { page: number, limit: number, id: string | null }) => {
            try {
                set({ loading: false, error: null, });

                const response = await new GetSongUsecase(songsService).call(limit, page, id);

                if (!response.status || !response.data) {
                    throw new Error(response.message);
                }

                if (response.data.type !== "single") {
                    get().setSongs(response.data.items as SongEntity[])
                } else {
                    throw new Error("No Song Found");
                }


            } catch (error: any) {
                set({ error: error.mesasge || "Something went wrong" });
            } finally {
                set({ loading: false });
            }
        }
    }),
    {
        name: "song-store",
        partialize: (state) => ({
            currentPlaying: state.currentPlaying,
            playing: state.playing,
            volume: state.volume,
            loop: state.loop,
            shuffle: state.shuffle,
        }),
    }
));

export default useSongsStore;
