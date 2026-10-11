// Lesson videos are embedded from YouTube, and YouTube doesn't offer a download link for them.
// To let students save a lesson video, upload the file (e.g. to Google Drive, "Anyone with the
// link") and add its share link here by lesson slug. A lesson whose video_url already points at
// a Google Drive file gets a download link automatically. No entry, no Download button.
export const LESSON_DOWNLOADS: Record<string, string> = {
  // 'parts-and-functions': 'https://drive.google.com/file/d/FILE_ID/view?usp=sharing',
}

const DRIVE_ID = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:[^#]*&)?id=)([\w-]+)/

export function getDownloadUrl(slug: string, videoUrl: string | null): string | null {
  const source = LESSON_DOWNLOADS[slug] ?? videoUrl
  const id = source?.match(DRIVE_ID)?.[1]
  if (id) return `https://drive.google.com/uc?export=download&id=${id}`
  // A direct link to a video file (e.g. hosted storage) is used as is.
  return LESSON_DOWNLOADS[slug] && /^https:\/\//.test(LESSON_DOWNLOADS[slug]) ? LESSON_DOWNLOADS[slug] : null
}
