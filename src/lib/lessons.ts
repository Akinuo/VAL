import type { Lesson } from './content'

export function isLessonFull(l: Lesson, done: Set<string>): boolean {
  return l.steps.length > 0 && l.steps.every(s => done.has(s.id))
}

// Lessons unlock sequentially: a lesson is reachable once every lesson
// before it is fully complete. Returns one flag per lesson, in order.
export function unlockedFlags(lessons: Lesson[], done: Set<string>): boolean[] {
  let priorComplete = true
  return lessons.map(l => {
    const unlocked = priorComplete
    priorComplete = priorComplete && isLessonFull(l, done)
    return unlocked
  })
}
