export const FILE_SIZE_LIMITS = {
  IMAGE: 20 * 1024 * 1024, // 20MB
  AUDIO: 50 * 1024 * 1024, // 50MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  FILE: 100 * 1024 * 1024, // 100MB
  TEXT: 50000, // 50KB (characters)
} as const;

export const ACCEPTED_FILE_TYPES = {
  IMAGE: {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/gif": [".gif"],
    "image/webp": [".webp"],
  },
  AUDIO: {
    "audio/mpeg": [".mp3"],
    "audio/wav": [".wav"],
    "audio/ogg": [".ogg"],
    "audio/mp4": [".m4a"],
  },
  VIDEO: {
    "video/mp4": [".mp4"],
    "video/webm": [".webm"],
    "video/quicktime": [".mov"],
  },
} as const;
