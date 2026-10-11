// Lesson videos are embedded from YouTube, and YouTube doesn't offer a download link for them.
// To let students save a lesson video, upload the file (e.g. to Google Drive, "Anyone with the
// link") and add its share link here by lesson slug. A lesson whose video_url already points at
// a Google Drive file gets a download link automatically. No entry, no Download button.
export const LESSON_DOWNLOADS: Record<string, string> = {
  'parts-and-functions': 'https://drive.google.com/file/d/1zQI6PALl0xm0T06Nhv80rBpz0JMUI3Hh/view?usp=drive_link',
  'preparing-machine': 'https://drive.google.com/file/d/1En30K60OExgoXnsE9oZJ1VDc7C4Vswaw/view?usp=drive_link',
  'threading-upper-thread': 'https://drive.google.com/file/d/1INL00uZxqj0OFnfM3MowJv4fPXiE18L7/view?usp=drive_link',
  'winding-bobbin': 'https://drive.google.com/file/d/1R3X8_tZM8hdmKvGDb4_9jFvhImAUvNLV/view?usp=drive_link',
  'installing-bobbin': 'https://drive.google.com/file/d/1f5Ooy2-XflDmNnhVfsabrX-fWKd8XF_I/view?usp=drive_link',
  'stitch-length-operation': 'https://drive.google.com/file/d/14DE7zgwUA6bD_j3w0Qmt9emSYlUl3lIl/view?usp=drive_link',
  'safety-practices': 'https://drive.google.com/file/d/1rj3KWVWG3U7sG8gkW8EVByD3r9bUT-sy/view?usp=drive_link',
  'cleaning-care': 'https://drive.google.com/file/d/1ScsTgJYRfCXdrNw-a1K9PH-3H43CHDjz/view?usp=drive_link',
}

const DRIVE_ID = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:[^#]*&)?id=)([\w-]+)/

export function getDownloadUrl(slug: string, videoUrl: string | null): string | null {
  const source = LESSON_DOWNLOADS[slug] ?? videoUrl
  const id = source?.match(DRIVE_ID)?.[1]
  if (id) return `https://drive.google.com/uc?export=download&id=${id}`
  // A direct link to a video file (e.g. hosted storage) is used as is.
  return LESSON_DOWNLOADS[slug] && /^https:\/\//.test(LESSON_DOWNLOADS[slug]) ? LESSON_DOWNLOADS[slug] : null
}
