import { existsSync, mkdirSync, readFileSync, statSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { RawQlResponse } from "raw_lib";
import { exec } from "yt-dlp-exec";

export interface YouTubeConversionRequest {
    youtubeUrl: string;
}

export interface YouTubeConversionResponse extends RawQlResponse<{
    audio: string,
    mimeType: string,
    size?: number;
}> {
    status: boolean;
    data: {
        type: "single",
        item: {
            audio: string,
            mimeType: string,
            size?: number;
        }
    }
    message: string;
}

export default class YoutubeConvertor {
    private static temptDir = join(tmpdir(), 'youtube-converter');

    static async ensureTempDir(): Promise<void> {
        if (!existsSync(this.temptDir)) {
            mkdirSync(this.temptDir, { recursive: true });
        }
    }

    static async convertToAudio(request: YouTubeConversionRequest): Promise<YouTubeConversionResponse> {
        try {
            await this.ensureTempDir();

            const { youtubeUrl } = request;

            if (!this.validateYouTubeUrl(youtubeUrl)) {
                throw Error("Invalid Youtube url");
            }

            const filename = `song_${Date.now()}`;
            const outputPath = join(this.temptDir, `${filename}.mp3`);

            await exec(youtubeUrl, {
                extractAudio: true,
                audioFormat: 'mp3',
                audioQuality: 0,
                output: outputPath,
                noCheckCertificate: true,
                noWarnings: true,
                noPlaylist: true,
                ffmpegLocation: '/usr/bin/ffmpeg',
            });

            if (!existsSync(outputPath)) {
                throw new Error('Conversion failed, file not created');
            }

            const stats = statSync(outputPath);
            if (stats.size === 0) {
                throw new Error("Conversion Failed - empty output file");
            }

            const audioBuffer = readFileSync(outputPath);

            unlinkSync(outputPath);

            return {
                status: true,
                message: "Got the Audio Successfully",
                data: {
                    type: "single",
                    item: {
                        audio: audioBuffer.toString('base64'),
                        mimeType: 'audio/mp3',
                        size: audioBuffer.length,
                    }
                }
            }
        } catch (error: any) {
            return {
                status: false,
                data: {
                    type: "single",
                    item: {
                        audio: '',
                        mimeType: 'audio/wav',
                    }
                },
                message: error.message || 'YouTube conversion failed',
            };
        }
    }

    private static validateYouTubeUrl(url: string): boolean {
        const patterns = [
            /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
            /^(https?:\/\/)?(www\.)?(youtu\.be\/)([a-zA-Z0-9_-]+)/,
            /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
        ];

        return patterns.some(pattern => pattern.test(url));
    }
}
