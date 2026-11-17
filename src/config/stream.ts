/**
 * KenLive TV - Live Stream Configuration
 * ========================================
 * EDIT THIS FILE to change the live video feed.
 *
 * Instructions:
 * 1. STREAM_URL: Paste your HLS .m3u8 live stream URL here when ready.
 *    Leave as "" (empty string) to show the standby broadcast slate.
 * 2. YOUTUBE_FALLBACK_ID: Optional YouTube Live stream or video ID
 *    (e.g., from https://www.youtube.com/watch?v=VIDEO_ID).
 *    If provided and STREAM_URL is empty, viewer can watch on YouTube.
 * 3. RADIO_STREAM_URL: Live audio feed for KenLive Radio (MP3 or AAC stream).
 */

export interface StreamConfig {
  /** The primary HLS (.m3u8) live stream link */
  STREAM_URL: string;
  /** Optional fallback YouTube Live Video ID (e.g. 'jfKfPfyJRdk' or Ken Wakuraya live ID) */
  YOUTUBE_FALLBACK_ID: string;
  /** KenLive Radio live stream audio URL */
  RADIO_STREAM_URL: string;
  /** Broadcaster channel name */
  CHANNEL_NAME: string;
  /** Stream title */
  DEFAULT_STREAM_TITLE: string;
}

export const STREAM_CONFIG: StreamConfig = {
  // Replace with your real .m3u8 stream URL when ready (e.g., "https://stream.kenlive.co.ke/live/hls.m3u8")
  // Leaving this as "" will trigger the polished "We're back soon" broadcast standby slate
  STREAM_URL: "",

  // Fallback YouTube Live ID (used when HLS is empty or viewer chooses YouTube)
  // Defaulting to Ken Wakuraya's official YouTube channel live / featured video
  YOUTUBE_FALLBACK_ID: "dQw4w9WgXcQ", // Replace with KenLive / Ken Wakuraya Live ID

  // KenLive Radio live streaming audio endpoint (e.g. Icecast / Shoutcast URL)
  RADIO_STREAM_URL: "https://stream.zeno.fm/f3wvbbqmdg8uv", // High-quality African radio stream placeholder

  CHANNEL_NAME: "KenLive TV",
  DEFAULT_STREAM_TITLE: "KenLive TV Live Stream - Tazama Moja kwa Moja",
};

export default STREAM_CONFIG;

