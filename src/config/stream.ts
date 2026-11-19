/**
 * KenLive TV – Live Stream Configuration
 *
 * STREAM_URL   : Paste your HLS .m3u8 URL here. Leave "" to show the standby slate.
 * YOUTUBE_ID   : YouTube Live video ID used as fallback viewer option.
 */

export const STREAM_CONFIG = {
  /** Primary HLS (.m3u8) live stream URL */
  STREAM_URL: "",

  /** YouTube Live / featured video ID (fallback) */
  YOUTUBE_FALLBACK_ID: "dQw4w9WgXcQ", // Replace with KenLive / Ken Wakuraya Live ID

  CHANNEL_NAME: "KenLive TV",
  DEFAULT_STREAM_TITLE: "KenLive TV Live – Tazama Moja kwa Moja",
} as const;

export default STREAM_CONFIG;
